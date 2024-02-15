let boards = [];
let rules_dict = {};
let binds = {};
let goals = [];
let voids = [];
let level = 0;
let board = null;
let board_history = [];

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
    boards = data.boards;
    rules_dict = data.rules;
    binds = data.binds;
    goals = data.goals;
    voids = data.voids;
    level = 0;
    board = null;
    initLevel();
    drawBoard();
    updateLevelDisplay();
    updateDocsDisplay();
}

gamesDropdown.addEventListener('change', function(){
    data = gamesData[gamesDropdown.value];
    initGame(data)
});

gamesDropdown.dispatchEvent(new Event('change'));  // Load the first game when the page loads

function updateLevelDisplay() {
    document.getElementById('level').textContent = "Level: " + level;
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
        for (let col = 0; col < board[row].length; col++) {
            boardStr += board[row][col];
        }

        let textNode = document.createTextNode(boardStr);
        displayElem.appendChild(textNode);

        if (row !== board.length - 1) {
            let brNode = document.createElement("br");
            displayElem.appendChild(brNode);
        }
    }
}


function initLevel() {
    board = JSON.parse(JSON.stringify(boards[level]));
    board_history = [];
    updateMovesDisplay();
    let displayElem = document.getElementById('status');
    displayElem.innerHTML = '';
}

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
                        // console.log("Pattern match failed at " + i + ", " + j + " with " + cell + " and " + subgridCell + " due to digitMap");                        
                        return false;
                    }
                } else {
                    digitMap[cell] = subgridCell;
                }
            } else if (cell != subgridCell) {
                // console.log("Pattern match failed at " + i + ", " + j + " with " + cell + " and " + subgridCell + " due to cell");
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
    console.log("Applying rule " + rule + " at " + row + ", " + col);
    console.log("Board before applying rule: " + board);
    let fromPattern = rule.from;
    let toPattern = rule.to;
    let sideEffect = rule.side_effect;
    console.log("fromPattern: " + fromPattern);
    console.log("toPattern: " + toPattern);
    console.log("sideEffect: " + sideEffect);
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
        console.log("Temp board: " + tempBoard);
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
                console.log("Setting cell " + (row + i) + ", " + (col + j) + " to " + cell);
            }
        }
        console.log("Board after applying rule: " + board);
        if (sideEffect && sideEffect.length > 0) {
            console.log("Applying side effect: " + sideEffect);
            if (sideEffect[sideEffect.length - 1] == '!') {
                sideEffect = sideEffect.slice(0, -1);
                if (!applyRule(rules_dict[sideEffect])) {
                    board = JSON.parse(JSON.stringify(tempBoard));
                    console.log("Board after reverting: " + board);
                    return false;
                }
            } else {
                applyRule(rules_dict[sideEffect]);
            }
        }
    } else {
        console.log("This should never happen.")
    }
    console.log("Board after applying rule: " + board);
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

function applyRule(rule) {
    switch (rule.type) {
    case "simple":
        var height = board.length;
        var width = board[0].length;
        var ruleApplied = false;
        for (let i = 0; i < height && !ruleApplied; i++) {
            for (let j = 0; j < width && !ruleApplied; j++) {
                if (patternMatch(rule.from, i, j)) {
                    ruleApplied = applyRuleAt(rule, i, j);
                }
            }
        }
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
    case "atomic":
        var board_copy = JSON.parse(JSON.stringify(board));
        var ruleApplied = true;
        var rules = rule.rules;
        for (let i = 0; i < rules.length; i++) {
            if (!applyRule(rules[i])) {
                ruleApplied = false;
                break;
            }
        }
        if (!ruleApplied) {
            board = board_copy;
        }
        return ruleApplied;
    }
}

function gameAction(a) {
    console.log("gameAction: " + a);
    var board_copy = JSON.parse(JSON.stringify(board));
    let cmd = binds[a];
    console.log("cmd: " + cmd);
    let rule = rules_dict[cmd];
    console.log("rule: " + rule);
    console.log("rule.type: " + rule.type);
    console.log("rule.rules.length: " + rule.rules.length);
    let ruleApplied = applyRule(rule);
    //console.log("ruleApplied: " + ruleApplied);
    drawBoard();
    if (ruleApplied) {
        board_history.push(board_copy);
        updateMovesDisplay();
        if (levelComplete()) {
            let displayElem = document.getElementById('status');
            displayElem.innerHTML = 'Level complete!  Press any key to advance to the next level.';
        }
    }
    return ruleApplied;
}

function nextLevel() {
    level++;
    if (level < boards.length) {
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

document.addEventListener('keypress', function(event) {
    if (board && levelComplete()) {
        nextLevel();
        return;
    }
    var charCode = event.charCode;
    if (charCode == 'l'.charCodeAt(0)) {
        var newLevel = prompt("Enter level number");
        if (newLevel != null && newLevel >= 0 && newLevel < boards.length) {
            level = newLevel;
            initLevel();
            drawBoard();
            updateLevelDisplay();
        }
    } else if (board) {
        if (charCode == 'r'.charCodeAt(0)) {
            initLevel();
            drawBoard();
        }
        if (charCode == 'u'.charCodeAt(0)) {
            if (board_history.length > 0) {
                board = board_history.pop();
                updateMovesDisplay();
            }
            drawBoard();
        }
        else if ((charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57)) {
            var action = String.fromCharCode(charCode);
            gameAction(action);
        }
    }
});
