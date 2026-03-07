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
let gamesDropdown = null;
let dropdownInitialized = false;

const DEBUG_LOGS = false;

function byId(id) {
    return document.getElementById(id);
}

function getStartupSelection() {
    const injectedSelection = window.UA4K_STARTUP_SELECTION;
    if (injectedSelection && typeof injectedSelection === 'object') {
        const requestedGame =
            typeof injectedSelection.game === 'string' ? injectedSelection.game : null;
        const injectedLevel = injectedSelection.level;
        let requestedLevel = null;

        if (Number.isInteger(injectedLevel) && injectedLevel >= 0) {
            requestedLevel = injectedLevel;
        }

        return { requestedGame, requestedLevel };
    }

    const rawParams = window.location.hash ? window.location.hash.slice(1) : window.location.search;
    const params = new URLSearchParams(rawParams);
    const requestedGame = params.get('game');
    const requestedLevel = params.get('level');
    let level = null;

    if (requestedLevel !== null && requestedLevel !== '') {
        const parsedLevel = Number.parseInt(requestedLevel, 10);
        if (Number.isInteger(parsedLevel) && parsedLevel >= 0) {
            level = parsedLevel;
        }
    }

    return { requestedGame, requestedLevel: level };
}

function debugLog(...args) {
    if (DEBUG_LOGS) {
        console.log(...args);
    }
}

function setHtml(id, value) {
    const element = byId(id);
    if (element) {
        element.innerHTML = value;
    }
}

function levelDescriptionHtml(level) {
    let parts = [];
    if (typeof level['description'] === 'string' && level['description'].length > 0) {
        parts.push(level['description']);
    }
    if (Number.isInteger(level['minMoves'])) {
        parts.push(`Min moves: ${level['minMoves']}`);
    }
    return parts.join('<br>');
}

function bindCommand(entry) {
    if (typeof entry === 'string') {
        return entry;
    }
    if (entry && typeof entry === 'object' && typeof entry.command === 'string') {
        return entry.command;
    }
    return null;
}

function bindDescription(entry) {
    if (typeof entry === 'string') {
        return entry;
    }
    if (!entry || typeof entry !== 'object') {
        return '';
    }
    if (typeof entry.description === 'string' && entry.description.length > 0) {
        return entry.description;
    }
    if (typeof entry.command === 'string') {
        return entry.command;
    }
    return '';
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

function initGame(data, options = {}) {
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
    level_number = Number.isInteger(options.level) ? options.level : 0;
    board = null;
    initLevel();
    drawBoard();
    updateLevelDisplay();
    updateDocsDisplay();
    debugLog("initGame done");
}

function setLevel(level) {
    if (!Number.isInteger(level) || level < 0 || level >= levels.length) {
        return false;
    }
    level_number = level;
    initLevel();
    drawBoard();
    updateLevelDisplay();
    return true;
}

function handleGameSelection(gamesDataObj) {
    const selectedGame = gamesDataObj[gamesDropdown.value];
    initGame(selectedGame);
}

function initHub(gamesDataObj) {
    gamesDropdown = byId('games');
    if (!gamesDropdown) {
        return false;
    }
    gamesDropdown.innerHTML = '';
    for (let key in gamesDataObj) {
        let option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        gamesDropdown.appendChild(option);
    }

    if (!dropdownInitialized) {
        gamesDropdown.addEventListener('change', function() {
            gamesDropdown.blur();
        });
        gamesDropdown.addEventListener('change', function() {
            handleGameSelection(gamesDataObj);
        });
        dropdownInitialized = true;
    }

    const startupSelection = getStartupSelection();
    if (startupSelection.requestedGame && gamesDataObj[startupSelection.requestedGame]) {
        gamesDropdown.value = startupSelection.requestedGame;
    }
    gamesDropdown.dispatchEvent(new Event('change'));
    if (startupSelection.requestedLevel !== null) {
        setLevel(startupSelection.requestedLevel);
    }
    return true;
}

function startStandalone(data, options = {}) {
    const startupSelection = getStartupSelection();
    const level = Number.isInteger(options.level) ? options.level : startupSelection.requestedLevel;
    initGame(data, { level: level });
}

// Rendering
function updateLevelDisplay() {
    const levelElem = byId('level');
    if (levelElem) {
        levelElem.textContent = "Level: " + level_number;
    }
}

function updateMovesDisplay() {
    const movesElem = byId('moves');
    if (movesElem) {
        movesElem.textContent = "Moves: " + board_history.length;
    }
}

function updateDocsDisplay() {
    let docsElem = byId('docs');
    if (!docsElem) {
        return;
    }
    docsElem.innerHTML = '';
    for (let key in binds) {
        let textNode = document.createTextNode(key + " : " + bindDescription(binds[key]));
        docsElem.appendChild(textNode);
        let brNode = document.createElement("br");
        docsElem.appendChild(brNode);
    }
    let goalsElem = byId('goals');
    if (goalsElem) {
        goalsElem.innerHTML = '';
        for (let goal of goals) {
            let textNode = document.createTextNode("Goal:" + goal);
            goalsElem.appendChild(textNode);
            let brNode = document.createElement("br");
            goalsElem.appendChild(brNode);
        }
    }
    let voidsElem = byId('voids');
    if (voidsElem) {
        voidsElem.innerHTML = '';
        for (let voidPattern of voids) {
            let textNode = document.createTextNode("Void:" + voidPattern);
            voidsElem.appendChild(textNode);
            let brNode = document.createElement("br");
            voidsElem.appendChild(brNode);
        }
    }
}

function drawBoard() {
    let displayElem = byId('display');
    if (!displayElem) {
        return;
    }
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
    setHtml('description', levelDescriptionHtml(level));
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
        let displayElem = byId('status');
        if (!displayElem) {
            return;
        }
        displayElem.innerHTML = 'Level complete!  Press any key to advance to the next level.';
    }
}

// Input handling
function gameAction(a) {
    debugLog("gameAction: " + a);
    var board_copy = JSON.parse(JSON.stringify(board));
    let cmd = bindCommand(binds[a]);
    if (!cmd) {
        return false;
    }
    debugLog("cmd: " + cmd);
    let rule = rules_dict[cmd];
    if (!rule) {
        return false;
    }
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
        const displayElem = byId('display');
        if (!displayElem) {
            board = null;
            return;
        }
        displayElem.innerHTML = "You have completed all the levels.  Wow!";
        let img = document.createElement('img');
        img.src = 'kitten.jpg';
        displayElem.appendChild(img);
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
        if (newLevel != null) {
            setLevel(Number.parseInt(newLevel, 10));
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
  const touchControls = byId('touchControls');
  if (!touchControls) {
    return;
  }
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
  if (typeof gamesData !== 'undefined') {
    initHub(gamesData);
  }
});

window.UA4K = {
    startHub: initHub,
    startStandalone: startStandalone,
    setLevel: setLevel,
};
