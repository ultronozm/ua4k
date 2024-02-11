let boards = [];
let rules_dict = {};
let docs = {};
let goals = [];
let voids = [];
let level = 0;
let board = 0;
let board_history = [];

var gamesDropdown = document.getElementById('games');
for (let key in gamesData) {
    let option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    gamesDropdown.appendChild(option);
}

function initGame(data) {
    boards = data.boards;
    rules_dict = data.rules_dict;
    docs = data.docs;
    goals = data.goals;
    voids = data.voids;
    level = 0;
    board = 0;
    board_history = [];
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

function updateDocsDisplay() {
    let docsElem = document.getElementById('docs');
    docsElem.innerHTML = '';
    for (let key in docs) {
        let textNode = document.createTextNode(key + " : " + docs[key]);
        docsElem.appendChild(textNode);
        let brNode = document.createElement("br");
        docsElem.appendChild(brNode);
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
}

function patternOccurs(pattern) {

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

function patternMatch(fromPattern, subgrid) {
    for (let i = 0; i < fromPattern.length; i++) {
        for (let j = 0; j < fromPattern[0].length; j++) {
            let cell = fromPattern[i][j];
            let subgridCell = subgrid[i][j];
            if (cell != '?' && cell != subgridCell) {
                return false;
            }
        }
    }
    return true;
}

function checkRule(rule, row, col) {
    let fromPattern = rule[0];
    let toPattern = rule[1];
    let patternHeight = fromPattern.length;
    let patternWidth = fromPattern[0].length;
    if (row >= 0 && col >= 0 && row + patternHeight <= board.length && col + patternWidth <= board[0].length) {
        let subgrid = getSubgrid(row, col, patternHeight, patternWidth);
        return patternMatch(fromPattern, subgrid);
    }
    return false;
}

function applyRule(rule, row, col) {
    // console.log("Applying rule " + rule + " at " + row + ", " + col);
    // console.log("Board before applying rule: " + board);
    let fromPattern = rule[0];
    let toPattern = rule[1];
    let sideEffect = rule[2];
    let patternHeight = toPattern.length;
    let patternWidth = toPattern[0].length;
    if (row >= 0 && col >= 0 && row + patternHeight <= board.length && col + patternWidth <= board[0].length) {
        for (let i = 0; i < patternHeight; i++) {
            for (let j = 0; j < patternWidth; j++) {
                let cell = toPattern[i][j];
                if (cell != '?') {
                    let tempRow = board[row + i].split('');
                    tempRow[col + j] = cell;
                    board[row + i] = tempRow.join('');
                    // console.log("Setting cell " + (row + i) + ", " + (col + j) + " to " + cell);
                }
            }
        }
        if (sideEffect) {
            gameAction(sideEffect);
        }
    } else {
        console.log("This should never happen.")
    }
    // console.log("Board after applying rule: " + board);
}

function levelComplete() {
    // check whether all of the "goals" patterns occur, and none of the "voids" patterns occur
    // TODO
}

function gameAction(a, userInput = false) {
    let height = board.length;
    let width = board[0].length;
    let rules = rules_dict[a];
    let ruleApplied = false;
    var board_copy = JSON.parse(JSON.stringify(board));
    if (rules) {
        for (let i = 0; i < height && !ruleApplied; i++) {
            for (let j = 0; j < width && !ruleApplied; j++) {
                for (let k = 0; k < rules.length && !ruleApplied; k++) {
                    if (checkRule(rules[k], i, j)) {
                        applyRule(rules[k], i, j);
                        ruleApplied = true;
                    }
                }
            }
        }
    }
    // console.log("ruleApplied: " + ruleApplied);
    drawBoard();
    board_history.push(board_copy);
    if (ruleApplied) {
        
        if (board.some(row => row.includes("w"))) {
            level++;
            if (level < boards.length) {
                initLevel();
                drawBoard();
                updateLevelDisplay();
            }
            else {
                document.getElementById('display').innerHTML = "You have completed all the levels.  Wow!";
                // display kitten.jpg:
                let img = document.createElement('img');
                img.src = 'kitten.jpg';
                document.getElementById('display').appendChild(img);
            }
        }
    }
    return ruleApplied;
}

document.addEventListener('keypress', function(event) {
    var charCode = event.charCode;
    if (charCode == 'r'.charCodeAt(0)) {
        initLevel();
        drawBoard();
    }
    if (charCode == 'u'.charCodeAt(0)) {
        if (board_history.length > 0) {
            board = board_history.pop();
        }
        drawBoard();
    }
    else if (charCode == 'l'.charCodeAt(0)) {
        var newLevel = prompt("Enter level number");
        if (newLevel != null && newLevel >= 0 && newLevel < boards.length) {
            level = newLevel;
            initLevel();
            drawBoard();
            updateLevelDisplay();
        }
    }
    else if ((charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57)) {
        var action = String.fromCharCode(charCode);
        gameAction(action, true);
    }

});
