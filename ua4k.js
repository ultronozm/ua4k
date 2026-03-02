// Runtime state
let levels = [];
let rules_dict = {};
let binds = {};
let goals = [];
let voids = [];
let level_number = 0;
let board = null;
let board_history = [];
let charMap = {};
let colorMap = {};
let globalTickInterval = null;
let timerId = null;
let whitespaceChars = [];
let hiddenLineChars = [];

const DEBUG_LOGS = false;

function debugLog(...args) {
    if (DEBUG_LOGS) {
        console.log(...args);
    }
}

function setHtml(id, value) {
    document.getElementById(id).innerHTML = value;
}

// Initialization
function onTimerTick() {
    debugLog("onTimerTick");
    if (rules_dict['_tick'] && !levelComplete()) {
        let ruleApplied = applyRule(rules_dict['_tick']);
        drawBoard();
        if (ruleApplied) {
            checkEndLevel();
        }
    }
}

var gamesDropdown = document.getElementById('games');
for (let key in gamesData) {
    let option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    gamesDropdown.appendChild(option);
}

gamesDropdown.addEventListener('change', function() {
    gamesDropdown.blur();
});

function initGame(data) {
    debugLog("initGame");
    levels = data.levels;
    rules_dict = data.rules;
    binds = data.binds;
    goals = data.goals;
    voids = data.voids;
    whitespaceChars = data.whitespaceChars;
    hiddenLineChars = data.hiddenLineChars;
    charMap = data.charMap;
    colorMap = data.colorMap;
    globalTickInterval = data.globalTick;
    level_number = 0;
    board = null;
    initLevel();
    drawBoard();
    updateLevelDisplay();
    updateDocsDisplay();
    debugLog("initGame done");
}

function handleGameSelection() {
    const selectedGame = gamesData[gamesDropdown.value];
    initGame(selectedGame);
}

gamesDropdown.addEventListener('change', handleGameSelection);

gamesDropdown.dispatchEvent(new Event('change'));  // Load the first game when the page loads

// Rendering
function updateLevelDisplay() {
    document.getElementById('level').textContent = "Level: " + level_number;
}

function updateMovesDisplay() {
    document.getElementById('moves').textContent = "Moves: " + board_history.length;
}

function updateDocsDisplay() {
    let docsElem = document.getElementById('docs');
    docsElem.innerHTML = '';
    for (let key in binds) {
        let textNode = document.createTextNode(key + " : " + binds[key]);
        docsElem.appendChild(textNode);
        let brNode = document.createElement("br");
        docsElem.appendChild(brNode);
    }
    let goalsElem = document.getElementById('goals');
    goalsElem.innerHTML = '';
    for (let goal of goals) {
        let textNode = document.createTextNode("Goal:" + goal);
        goalsElem.appendChild(textNode);
        let brNode = document.createElement("br");
        goalsElem.appendChild(brNode);
    }
    let voidsElem = document.getElementById('voids');
    voidsElem.innerHTML = '';
    for (let voidPattern of voids) {
        let textNode = document.createTextNode("Void:" + voidPattern);
        voidsElem.appendChild(textNode);
        let brNode = document.createElement("br");
        voidsElem.appendChild(brNode);
    }
}

function drawBoard() {
    let displayElem = document.getElementById('display');
    displayElem.innerHTML = '';
    
    for (let row = 0; row < board.length; row++) {
        let boardStr = '';
        let hidden = false;
        for (let col = 0; col < board[row].length; col++) {
            let baseChar = board[row][col];
            let newChar = baseChar;
            if (whitespaceChars.includes(newChar)) {
                newChar = '&nbsp;'; // update here
            }
            else if (hiddenLineChars.includes(newChar)) {
                hidden = true;
                break;
            }
            else if (charMap[newChar]) {
                newChar = charMap[newChar];
            }
            if (colorMap[baseChar]) {
                newChar = `<span style="color: ${colorMap[baseChar]}">${newChar}</span>`;
            }

            boardStr += newChar;
        }
        if (hidden) {
            continue;
        }

        // let textNode = document.createTextNode(boardStr);
        // displayElem.appendChild(textNode);
        // if (row !== board.length - 1) {
        //     let brNode = document.createElement("br");
        //     displayElem.appendChild(brNode);
        // }
        
        displayElem.innerHTML += boardStr;
        
        if (row !== board.length - 1) {
            displayElem.innerHTML += "<br>";  // also changed appending br directly
        }
    }
}



function initLevel() {
    let level = levels[level_number];
    board = JSON.parse(JSON.stringify(level['board']));
    board_history = [];
    updateMovesDisplay();
    setHtml('status', '');
    setHtml('title', level['title'] ? level['title'] : '');
    setHtml('author', level['author'] ? ('by ' + level['author']) : '');
    setHtml('description', level['description'] ? level['description'] : '');
    if (timerId) {
        debugLog("Clearing timer");
        clearInterval(timerId);
    }
    if (rules_dict['_init']) {
        applyRule(rules_dict['_init']);
    }
    var tickInterval = level.tickInterval || globalTickInterval;
    if (tickInterval && rules_dict['_tick']) {
        debugLog("Starting timer");
        timerId = setInterval(onTimerTick, tickInterval);
    }
}

// Rule engine
function getSubgrid(row, col, height, width) {
    let subgrid = [];
    for (let i = 0; i < height; i++) {
        let subgridRow = [];
        for (let j = 0; j < width; j++) {
            subgridRow.push(board[row + i][col + j]);
        }
        subgrid.push(subgridRow);
    }
    return subgrid;
}

// this function is needed because of the awkward difference between
// how boards and rules are stored (strings vs. arrays of single
// character strings).
function patternMatchHelper(fromPattern, subgrid) {
    // digits serve as wildcards but need to match consistently
    var digitMap = {};
    for (let i = 0; i < fromPattern.length; i++) {
        for (let j = 0; j < fromPattern[0].length; j++) {
            let cell = fromPattern[i][j];
            let subgridCell = subgrid[i][j];
            if (cell == '?')
                continue;
            // we should modify this so that the file somehow specifies which
            // characters to use as wildcards
            if (false && cell >= '0' && cell <= '9') {
                if (digitMap[cell]) {
                    if (digitMap[cell] != subgridCell) {
                        // debugLog("Pattern match failed at " + i + ", " + j + " with " + cell + " and " + subgridCell + " due to digitMap");                        
                        return false;
                    }
                } else {
                    digitMap[cell] = subgridCell;
                }
            } else if (cell != subgridCell) {
                // debugLog("Pattern match failed at " + i + ", " + j + " with " + cell + " and " + subgridCell + " due to cell");
                return false;
            }
        }
    }
    return true;
}

function patternMatch(fromPattern, row, col) {
    let patternHeight = fromPattern.length;
    let patternWidth = fromPattern[0].length;
    if (row >= 0 && col >= 0 && row + patternHeight <= board.length && col + patternWidth <= board[0].length) {
        let subgrid = getSubgrid(row, col, patternHeight, patternWidth);
        return patternMatchHelper(fromPattern, subgrid);
    }
    return false;
}

function applyRuleAt(rule, row, col) {
    debugLog("Applying rule " + rule + " at " + row + ", " + col);
    debugLog("Board before applying rule: " + board);
    let fromPattern = rule.from;
    let toPattern = rule.to;
    let sideEffects = rule.side_effects;
    debugLog("fromPattern: " + fromPattern);
    debugLog("toPattern: " + toPattern);
    debugLog("sideEffects: " + sideEffects);
    let patternHeight = toPattern.length;
    let patternWidth = toPattern[0].length;
    if (row >= 0 && col >= 0 && row + patternHeight <= board.length && col + patternWidth <= board[0].length) {
        var subgrid = getSubgrid(row, col, patternHeight, patternWidth);
        var digitMap = {};
        for (let i = 0; i < patternHeight; i++) {
            for (let j = 0; j < patternWidth; j++) {
                let cell = fromPattern[i][j];
                if (cell >= '0' && cell <= '9') {
                    digitMap[cell] = subgrid[i][j];
                }
            }
        }
        var tempBoard = JSON.parse(JSON.stringify(board));
        debugLog("Temp board: " + tempBoard);
        for (let i = 0; i < patternHeight; i++) {
            for (let j = 0; j < patternWidth; j++) {
                let cell = toPattern[i][j];
                if (cell == '?')
                    continue;
                // again, TODO: modify to accomodate arbitrary wildcards
                if (false && cell >= '0' && cell <= '9')
                    cell = digitMap[cell];
                let tempRow = board[row + i].split('');
                tempRow[col + j] = cell;
                board[row + i] = tempRow.join('');
                debugLog("Setting cell " + (row + i) + ", " + (col + j) + " to " + cell);
            }
        }
        debugLog("Board after applying rule: " + board);

        for (let sideEffect of sideEffects) {
            debugLog("Applying side effect: " + sideEffect);
            if (sideEffect[sideEffect.length - 1] == '!') {
                sideEffect = sideEffect.slice(0, -1);
                if (!applyRule(rules_dict[sideEffect])) {
                    board = JSON.parse(JSON.stringify(tempBoard));
                    debugLog("Board after reverting: " + board);
                    return false;
                }
            } else {
                applyRule(rules_dict[sideEffect]);
            }
            debugLog("Board after applying side effect " + sideEffect + ": " + board);
        }            

        
        // if (sideEffect && sideEffect.length > 0) {
        //     debugLog("Applying side effect: " + sideEffect);
        //     if (sideEffect[sideEffect.length - 1] == '!') {
        //         sideEffect = sideEffect.slice(0, -1);
        //         if (!applyRule(rules_dict[sideEffect])) {
        //             board = JSON.parse(JSON.stringify(tempBoard));
        //             debugLog("Board after reverting: " + board);
        //             return false;
        //         }
        //     } else {
        //         applyRule(rules_dict[sideEffect]);
        //     }
        //     debugLog("Board after applying rule and side effect " + sideEffect + ": " + board);
        // }
    } else {
        debugLog("This should never happen.")
    }
    return true;
}

function patternOccurs(pattern) {
    let height = board.length;
    let width = board[0].length;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (patternMatch(pattern, i, j)) {
                return true;
            }
        }
    }
    return false;
}

function levelComplete() {
    let height = board.length;
    let width = board[0].length;
    for (let goal of goals) {
        if (!patternOccurs(goal)) {
            return false;
        }
    }
    for (let voidPattern of voids) {
        if (patternOccurs(voidPattern)) {
            return false;
        }
    }
    return true;
}

let lastRow = -1;
let lastCol = -1;

function applyRule(rule, min_row=0, min_col=0) {
    switch (rule.type) {
    case "simple":
        var height = board.length;
        var width = board[0].length;
        debugLog("Applying SIMPLE " + rule.from + " with min_row, min_col: " + min_row + ", " + min_col);

        var ruleApplied = false;
        if (rule.method == 'firstmatch') {
            for (let i = min_row; i < height && !ruleApplied; i++) {
                for (let j = min_col; j < width && !ruleApplied; j++) {
                    if (patternMatch(rule.from, i, j)) {
                        ruleApplied = applyRuleAt(rule, i, j);
                        lastRow = i;
                        lastCol = j;
                    }
                }
            }
        } else if (rule.method == 'lastmatch') {
            for (let i = height - 1; i >= min_row && !ruleApplied; i--) {
                for (let j = width - 1; j >= min_col && !ruleApplied; j--) {
                    if (patternMatch(rule.from, i, j)) {
                        ruleApplied = applyRuleAt(rule, i, j);
                        lastRow = i;
                        lastCol = j;
                    }
                }
            }
        }
        else if (rule.method == 'random') {
            var matchPositions = [];
            for (let i = min_row; i < height; i++) {
                for (let j = min_col; j < width; j++) {
                    if (patternMatch(rule.from, i, j)) {
                        matchPositions.push([i, j]);
                    }
                }
            }
            if (matchPositions.length > 0) {
                var randomIndex = Math.floor(Math.random() * matchPositions.length);
                var matchPosition = matchPositions[randomIndex];
                ruleApplied = applyRuleAt(rule, matchPosition[0], matchPosition[1]);
                lastRow = matchPosition[0];
                lastCol = matchPosition[1];
            }
        }
        return ruleApplied;
    case "call":
        var name = rule.name;
        debugLog("Applying CALL " + name);
        var ruleApplied = applyRule(rules_dict[name]);
        debugLog("CALL " + name + " applied: " + ruleApplied);
        return ruleApplied;
    case "match1":
        var ruleApplied = false;
        var rules = rule.rules;
        for (let i = 0; i < rules.length; i++) {
            if (applyRule(rules[i])) {
                ruleApplied = true;
                break;
            }
        }
        return ruleApplied;
    case "try_all":
        var rules = rule.rules;
        for (let i = 0; i < rules.length; i++)
            applyRule(rules[i]);
        return true;
    case "random":
        var rules = rule.rules;
        var length = rules.length;
        // apply a random element
        var randomIndex = Math.floor(Math.random() * length);
        return applyRule(rules[randomIndex]);
    case "atomic":
        var board_copy = JSON.parse(JSON.stringify(board));
        var ruleApplied = true;
        var rules = rule.rules;
        var condition = rule.condition;
        var min_row = 0;
        var min_col =0;
        for (let i = 0; i < rules.length; i++) {
            var rule = rules[i];
            debugLog("Applying atomic rule " + rule + ", step " + i + " with min_row, min_col: " + min_row + ", " + min_col);
            debugLog("condition: " + condition);
            if (!applyRule(rule, min_row, min_col)) {
                ruleApplied = false;
                debugLog("Atomic rule fail: " + rules[i]);
                break;
            }
            if (condition == 'vertical') {
                min_row = lastRow + 1;
            }
            else if (condition == 'horizontal') {
                min_col = lastCol + 1;
            }
        }
        if (!ruleApplied) {
            board = board_copy;
        }
        return ruleApplied;
    }
}

function checkEndLevel() {
    if (levelComplete()) {
        let displayElem = document.getElementById('status');
        displayElem.innerHTML = 'Level complete!  Press any key to advance to the next level.';
    }
}

// Input handling
function gameAction(a) {
    debugLog("gameAction: " + a);
    var board_copy = JSON.parse(JSON.stringify(board));
    let cmd = binds[a];
    debugLog("cmd: " + cmd);
    let rule = rules_dict[cmd];
    debugLog("rule: " + rule);
    debugLog("rule.type: " + rule.type);
    debugLog("rule.rules.length: " + rule.rules.length);
    let ruleApplied = applyRule(rule);
    //debugLog("ruleApplied: " + ruleApplied);
    drawBoard();
    if (ruleApplied) {
        board_history.push(board_copy);
        updateMovesDisplay();
        checkEndLevel();
    }
    return ruleApplied;
}

function nextLevel() {
    level_number++;
    if (level_number < levels.length) {
        initLevel();
        drawBoard();
        updateLevelDisplay();
    } else {
        document.getElementById('display').innerHTML = "You have completed all the levels.  Wow!";
        let img = document.createElement('img');
        img.src = 'kitten.jpg';
        document.getElementById('display').appendChild(img);
        board = null;
    }
}

function handleKeyPress(event) {
    if (board && levelComplete()) {
        nextLevel();
        return;
    }
    var charCode = event.charCode;
    if (charCode == 'l'.charCodeAt(0)) {
        var newLevel = prompt("Enter level number");
        if (newLevel != null && newLevel >= 0 && newLevel < levels.length) {
            level_number = newLevel;
            initLevel();
            drawBoard();
            updateLevelDisplay();
        }
    } else if (board) {
        if (charCode == 'U'.charCodeAt(0)) {
            initLevel();
            drawBoard();
        } else if (charCode == 'u'.charCodeAt(0)) {
            if (board_history.length > 0) {
                board = board_history.pop();
                updateMovesDisplay();
            }
            drawBoard();
        }
        else {
            gameAction(String.fromCharCode(charCode));
        }
        // else if ((charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57)) {
        //     var action = String.fromCharCode(charCode);
        //     gameAction(action);
        // }
    }
}

document.addEventListener('keypress', handleKeyPress);

// Touch helpers
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function initTouchControls() {
  const touchControls = document.getElementById('touchControls');
  const buttons = touchControls.getElementsByClassName('controlBtn');

  for (let button of buttons) {
    button.addEventListener('touchstart', function(e) {
      e.preventDefault();
      const key = this.getAttribute('data-key');
      simulateKeyPress(key);
    });
  }
}

function simulateKeyPress(key) {
  const event = new KeyboardEvent('keypress', {
    key: key,
    charCode: key.charCodeAt(0),
    bubbles: true
  });
  document.dispatchEvent(event);
}

// Call this function when the page loads
window.addEventListener('load', function() {
  if (isMobile()) {
    initTouchControls();
  }
});
