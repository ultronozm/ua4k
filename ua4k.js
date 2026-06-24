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
let currentGameAlphabet = new Set();
let scratchInitialBoard = null;

const DEBUG_LOGS = false;

function byId(id) {
    return document.getElementById(id);
}

function clearElement(element) {
    if (!element) {
        return;
    }
    element.innerHTML = '';
    element.textContent = '';
}

function appendText(element, value) {
    element.appendChild(document.createTextNode(String(value)));
}

function appendBreak(element) {
    element.appendChild(document.createElement('br'));
}

function setText(id, value) {
    const element = byId(id);
    if (!element) {
        return;
    }
    clearElement(element);
    if (value !== null && value !== undefined && String(value).length > 0) {
        appendText(element, value);
    }
}

function setTextLines(id, values) {
    const element = byId(id);
    if (!element) {
        return;
    }
    clearElement(element);
    values.forEach(function(value, index) {
        if (index > 0) {
            appendBreak(element);
        }
        appendText(element, value);
    });
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

function levelDescriptionLines(level) {
    let parts = [];
    if (typeof level['description'] === 'string' && level['description'].length > 0) {
        parts.push(level['description']);
    }
    if (Number.isInteger(level['minMoves'])) {
        parts.push(`Min moves: ${level['minMoves']}`);
    }
    return parts;
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

function commandWords(command) {
    if (typeof command !== 'string') {
        return '';
    }
    return command.replace(/[$#]/g, '').replace(/_/g, ' ').trim();
}

function directionFromText(text) {
    const normalized = String(text || '').toLowerCase().trim();
    const directionalPhrase = '(move|walk|slide|turn|face|look|step)';

    if (/^(north|up)$/.test(normalized) || new RegExp(`^${directionalPhrase}\\b.*\\b(north|up)$`).test(normalized)) {
        return '↑';
    }
    if (/^(south|down)$/.test(normalized) || new RegExp(`^${directionalPhrase}\\b.*\\b(south|down)$`).test(normalized)) {
        return '↓';
    }
    if (/^(west|left)$/.test(normalized) || new RegExp(`^${directionalPhrase}\\b.*\\b(west|left)$`).test(normalized)) {
        return '←';
    }
    if (/^(east|right)$/.test(normalized) || new RegExp(`^${directionalPhrase}\\b.*\\b(east|right)$`).test(normalized)) {
        return '→';
    }
    return null;
}

function directionFromCommand(command) {
    const normalized = String(command || '').toLowerCase();
    const directCommands = {
        north: '↑',
        up: '↑',
        south: '↓',
        down: '↓',
        west: '←',
        left: '←',
        east: '→',
        right: '→',
    };
    if (directCommands[normalized]) {
        return directCommands[normalized];
    }

    const match = normalized.match(/^(.*)_(n|north|up|s|south|down|w|west|left|e|east|right)$/);
    if (!match) {
        return null;
    }

    const stem = match[1];
    const suffix = match[2];
    const directionalStems = new Set([
        'move',
        'walk',
        'step',
        'slide',
        'turn',
        'look',
        'swarm_step',
        'cursor_step',
        'player_move',
    ]);
    if (!directionalStems.has(stem)) {
        return null;
    }

    if (suffix === 'n' || suffix === 'north' || suffix === 'up') {
        return '↑';
    }
    if (suffix === 's' || suffix === 'south' || suffix === 'down') {
        return '↓';
    }
    if (suffix === 'w' || suffix === 'west' || suffix === 'left') {
        return '←';
    }
    return '→';
}

function touchDirectionForBinding(key, entry) {
    const description = bindDescription(entry).toLowerCase();
    const command = bindCommand(entry) || '';
    const normalizedCommand = command.toLowerCase();
    const isFacing = /^look_/.test(normalizedCommand) || /^(face|look)\b/.test(description);
    const direction = directionFromText(description) || directionFromCommand(normalizedCommand);
    if (!direction) {
        return null;
    }
    const prefix = isFacing ? 'Face ' : '';
    return `${prefix}${direction}`;
}

function touchLabelForBinding(key, entry) {
    const direction = touchDirectionForBinding(key, entry);
    if (direction) {
        return direction;
    }

    const description = (
        entry &&
        typeof entry === 'object' &&
        typeof entry.description === 'string'
    ) ? entry.description : '';
    const command = commandWords(bindCommand(entry));
    let label = description || command || key;
    label = label
        .replace(/^build\s+/i, '')
        .replace(/^move\s+/i, '')
        .replace(/^turn\s+/i, '')
        .replace(/\s*\/.*$/, '')
        .trim();

    if (!label) {
        label = key;
    }
    if (label.length > 12) {
        const firstWord = label.split(/\s+/)[0];
        label = firstWord.length <= 12 ? firstWord : key;
    }

    return label.slice(0, 1).toUpperCase() + label.slice(1);
}

function touchTitleForBinding(key, entry) {
    const description = bindDescription(entry);
    const command = bindCommand(entry);
    return `${key}: ${description || command || key}`;
}

function appendTouchButtonLabel(button, action) {
    const keyLabel = document.createElement('span');
    keyLabel.className = 'controlBtn-key';
    appendText(keyLabel, action.key);

    const commandLabel = document.createElement('span');
    commandLabel.className = 'controlBtn-label';
    appendText(commandLabel, action.label);

    button.appendChild(keyLabel);
    button.appendChild(commandLabel);
}

function currentTouchActions() {
    const actions = [];
    const seenCommands = new Set();

    for (let key in binds) {
        const entry = binds[key];
        const command = bindCommand(entry);
        if (command && seenCommands.has(command)) {
            continue;
        }
        if (command) {
            seenCommands.add(command);
        }
        actions.push({
            key,
            label: touchLabelForBinding(key, entry),
            title: touchTitleForBinding(key, entry),
            kind: touchDirectionForBinding(key, entry) ? 'direction' : 'action',
        });
    }

    actions.push(
        { key: 'u', label: 'Undo', title: 'u: undo', kind: 'system' },
        { key: 'U', label: 'Restart', title: 'U: restart level', kind: 'system' },
    );
    return actions;
}

const TOUCH_KEYBOARD_ROWS = [
    '1234567890',
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm',
];

function touchKeyboardPosition(key) {
    if (typeof key !== 'string' || key.length !== 1) {
        return null;
    }
    const normalizedKey = key.toLowerCase();
    for (let row = 0; row < TOUCH_KEYBOARD_ROWS.length; row++) {
        const column = TOUCH_KEYBOARD_ROWS[row].indexOf(normalizedKey);
        if (column >= 0) {
            return { row, column };
        }
    }
    return null;
}

function compareTouchActions(a, b) {
    const aPosition = touchKeyboardPosition(a.key);
    const bPosition = touchKeyboardPosition(b.key);
    if (!aPosition && !bPosition) {
        return a.key.localeCompare(b.key);
    }
    if (!aPosition) {
        return 1;
    }
    if (!bPosition) {
        return -1;
    }
    return (
        aPosition.row - bPosition.row ||
        aPosition.column - bPosition.column ||
        a.key.localeCompare(b.key)
    );
}

function isUppercaseLetterKey(key) {
    return typeof key === 'string' && /^[A-Z]$/.test(key);
}

function createTouchButton(action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `controlBtn controlBtn-${action.kind}`;
    button.setAttribute('data-key', action.key);
    button.setAttribute('title', action.title);
    button.setAttribute('aria-label', action.title);
    appendTouchButtonLabel(button, action);

    const press = function(e) {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        simulateKeyPress(action.key);
        if (typeof button.blur === 'function') {
            button.blur();
        }
    };

    if (window.PointerEvent) {
        button.addEventListener('pointerdown', press);
    } else {
        button.addEventListener('touchstart', press);
        button.addEventListener('click', press);
    }

    return button;
}

function appendKeyboardSection(container, actions, className) {
    if (actions.length === 0) {
        return;
    }

    const rows = TOUCH_KEYBOARD_ROWS.map(function() {
        return new Map();
    });

    for (let action of actions.sort(compareTouchActions)) {
        const position = touchKeyboardPosition(action.key);
        const cellKey = action.key.toLowerCase();
        if (!rows[position.row].has(cellKey)) {
            rows[position.row].set(cellKey, []);
        }
        rows[position.row].get(cellKey).push(action);
    }

    const keyboard = document.createElement('div');
    keyboard.className = className;

    for (let rowIndex = 0; rowIndex < TOUCH_KEYBOARD_ROWS.length; rowIndex++) {
        const rowActions = rows[rowIndex];
        if (rowActions.size === 0) {
            continue;
        }

        const rowKeys = TOUCH_KEYBOARD_ROWS[rowIndex].split('');
        const occupiedColumns = Array.from(rowActions.keys()).map(function(key) {
            return rowKeys.indexOf(key);
        });
        const minColumn = Math.min(...occupiedColumns);
        const maxColumn = Math.max(...occupiedColumns);

        const row = document.createElement('div');
        row.className = 'controlKeyboardRow';
        row.setAttribute(
            'style',
            `--key-count: ${maxColumn - minColumn + 1}; grid-template-columns: repeat(${maxColumn - minColumn + 1}, minmax(0, 1fr));`
        );

        for (let column = minColumn; column <= maxColumn; column++) {
            const key = rowKeys[column];
            const slot = document.createElement('div');
            const actionsForKey = rowActions.get(key) || [];
            slot.className = actionsForKey.length > 0
                ? 'controlKeySlot'
                : 'controlKeySlot controlKeySlot-empty';

            for (let action of actionsForKey) {
                slot.appendChild(createTouchButton(action));
            }
            row.appendChild(slot);
        }

        keyboard.appendChild(row);
    }

    if (keyboard.children.length > 0) {
        container.appendChild(keyboard);
    }
}

function appendKeyboardTouchControls(container, actions) {
    const baseActions = [];
    const shiftedActions = [];
    const extraActions = [];

    for (let action of actions) {
        const position = touchKeyboardPosition(action.key);
        if (!position) {
            extraActions.push(action);
        } else if (isUppercaseLetterKey(action.key)) {
            shiftedActions.push(action);
        } else {
            baseActions.push(action);
        }
    }

    appendKeyboardSection(container, baseActions, 'controlKeyboard controlKeyboard-base');
    appendKeyboardSection(container, shiftedActions, 'controlKeyboard controlKeyboard-shifted');

    if (extraActions.length > 0) {
        appendTouchButtonRow(container, extraActions, 'controlExtraRow');
    }
}

function appendTouchButtonRow(container, actions, className) {
    const row = document.createElement('div');
    row.className = className;
    for (let action of actions) {
        row.appendChild(createTouchButton(action));
    }
    container.appendChild(row);
}

function collectPatternChars(rows, alphabet) {
    if (!Array.isArray(rows)) {
        return;
    }
    for (let row of rows) {
        if (typeof row !== 'string') {
            continue;
        }
        for (let char of row) {
            if (char !== '?') {
                alphabet.add(char);
            }
        }
    }
}

function collectRuleChars(rule, alphabet) {
    if (!rule || typeof rule !== 'object') {
        return;
    }
    if (rule.type === 'simple') {
        collectPatternChars(rule.from, alphabet);
        collectPatternChars(rule.to, alphabet);
        return;
    }
    if (Array.isArray(rule.rules)) {
        for (let child of rule.rules) {
            collectRuleChars(child, alphabet);
        }
    }
}

function collectGameAlphabet(data) {
    const alphabet = new Set();
    for (let level of data.levels || []) {
        collectPatternChars(level.board, alphabet);
    }
    for (let goal of data.goals || []) {
        collectPatternChars(goal, alphabet);
    }
    for (let voidPattern of data.voids || []) {
        collectPatternChars(voidPattern, alphabet);
    }
    for (let key of Object.keys(data.charMap || {})) {
        for (let char of key) {
            alphabet.add(char);
        }
    }
    for (let key of Object.keys(data.colorMap || {})) {
        for (let char of key) {
            alphabet.add(char);
        }
    }
    for (let char of data.whitespaceChars || []) {
        alphabet.add(char);
    }
    for (let char of data.hiddenLineChars || []) {
        alphabet.add(char);
    }
    for (let rule of Object.values(data.rules || {})) {
        collectRuleChars(rule, alphabet);
    }
    return alphabet;
}

function boardRowsToText(rows) {
    return (rows || []).join('\n');
}

function parseBoardText(text) {
    const normalized = String(text || '').replace(/\r\n?/g, '\n').replace(/\n+$/g, '');
    if (normalized.length === 0) {
        return [];
    }
    return normalized.split('\n').map((row) => row.trimEnd());
}

function validateBoardRows(rows, options = {}) {
    const errors = [];
    const maxRows = options.maxRows || 80;
    const maxCols = options.maxCols || 120;
    const maxCells = options.maxCells || 6000;
    const allowedChars = options.allowedChars || currentGameAlphabet;

    if (!Array.isArray(rows) || rows.length === 0) {
        errors.push('Board must contain at least one row.');
        return { ok: false, errors, rows: [] };
    }

    if (rows.length > maxRows) {
        errors.push(`Board has ${rows.length} rows; maximum is ${maxRows}.`);
    }

    const width = typeof rows[0] === 'string' ? rows[0].length : 0;
    if (width === 0) {
        errors.push('Board rows must not be empty.');
    }
    if (width > maxCols) {
        errors.push(`Board has ${width} columns; maximum is ${maxCols}.`);
    }
    if (rows.length * width > maxCells) {
        errors.push(`Board has ${rows.length * width} cells; maximum is ${maxCells}.`);
    }

    rows.forEach(function(row, index) {
        if (typeof row !== 'string') {
            errors.push(`Row ${index + 1} is not text.`);
            return;
        }
        if (row.length === 0) {
            errors.push(`Row ${index + 1} is empty.`);
        }
        if (row.length !== width) {
            errors.push(`Row ${index + 1} has width ${row.length}; expected ${width}.`);
        }
        for (let char of row) {
            if (allowedChars && allowedChars.size > 0 && !allowedChars.has(char)) {
                errors.push(`Row ${index + 1} contains character ${JSON.stringify(char)}, which is not used by this game.`);
                break;
            }
        }
    });

    return { ok: errors.length === 0, errors, rows };
}

function parseAndValidateBoardText(text, options = {}) {
    const rows = parseBoardText(text);
    return validateBoardRows(rows, options);
}

function currentLevelNumber() {
    return level_number;
}

function notifyLevelChanged() {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new Event('ua4k:levelchange'));
    }
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
    currentGameAlphabet = collectGameAlphabet(data);
    level_number = Number.isInteger(options.level) ? options.level : 0;
    scratchInitialBoard = null;
    board = null;
    initLevel();
    drawBoard();
    updateLevelDisplay();
    updateDocsDisplay();
    initTouchControls();
    notifyLevelChanged();
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
    notifyLevelChanged();
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

function handleLocationChange() {
    const startupSelection = getStartupSelection();

    if (
        startupSelection.requestedGame &&
        gamesDropdown &&
        typeof gamesData !== 'undefined' &&
        gamesData[startupSelection.requestedGame] &&
        gamesDropdown.value !== startupSelection.requestedGame
    ) {
        gamesDropdown.value = startupSelection.requestedGame;
        handleGameSelection(gamesData);
    }

    if (startupSelection.requestedLevel !== null) {
        setLevel(startupSelection.requestedLevel);
    }
}

// Rendering
function updateLevelDisplay() {
    const levelElem = byId('level');
    if (levelElem) {
        levelElem.textContent = (scratchInitialBoard ? "Scratch Level: " : "Level: ") + level_number;
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
    clearElement(displayElem);

    const visibleRows = [];
    for (let row = 0; row < board.length; row++) {
        if (Array.from(board[row]).some((char) => hiddenLineChars.includes(char))) {
            continue;
        }
        visibleRows.push(board[row]);
    }

    for (let row = 0; row < visibleRows.length; row++) {
        for (let col = 0; col < visibleRows[row].length; col++) {
            let baseChar = visibleRows[row][col];
            let newChar = baseChar;
            if (whitespaceChars.includes(newChar)) {
                newChar = '\u00a0';
            }
            else if (charMap[newChar]) {
                newChar = charMap[newChar];
            }
            if (colorMap[baseChar]) {
                let span = document.createElement('span');
                span.setAttribute('style', `color: ${colorMap[baseChar]}`);
                span.textContent = newChar;
                displayElem.appendChild(span);
            } else {
                appendText(displayElem, newChar);
            }
        }
        if (row !== visibleRows.length - 1) {
            appendBreak(displayElem);
        }
    }
}



function loadBoardRows(rows, level) {
    board = JSON.parse(JSON.stringify(rows));
    board_history = [];
    updateMovesDisplay();
    setText('status', '');
    setText('title', level['title'] ? level['title'] : '');
    setText('author', level['author'] ? ('by ' + level['author']) : '');
    setTextLines('description', levelDescriptionLines(level));
    if (timerId) {
        debugLog("Clearing timer");
        clearInterval(timerId);
        timerId = null;
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

function initLevel() {
    let level = levels[level_number];
    scratchInitialBoard = null;
    loadBoardRows(level['board'], level);
}

function restartLevel() {
    if (scratchInitialBoard) {
        loadBoardRows(scratchInitialBoard, levels[level_number]);
    } else {
        initLevel();
    }
    drawBoard();
    updateLevelDisplay();
}

function currentBoardText() {
    return boardRowsToText(board || []);
}

function originalLevelText() {
    let level = levels[level_number];
    return boardRowsToText(level ? level.board : []);
}

function startScratchLevel(rows) {
    const validation = validateBoardRows(rows);
    if (!validation.ok) {
        return validation;
    }
    scratchInitialBoard = JSON.parse(JSON.stringify(validation.rows));
    loadBoardRows(scratchInitialBoard, levels[level_number]);
    drawBoard();
    updateLevelDisplay();
    checkEndLevel();
    return { ok: true, errors: [], rows: validation.rows };
}

function startScratchLevelFromText(text) {
    const validation = parseAndValidateBoardText(text);
    if (!validation.ok) {
        return validation;
    }
    return startScratchLevel(validation.rows);
}

function restoreOriginalLevel() {
    initLevel();
    drawBoard();
    updateLevelDisplay();
    checkEndLevel();
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
        if (scratchInitialBoard) {
            setText('status', 'Scratch level complete.');
        } else {
            setText('status', 'Level complete!  Press any key to advance to the next level.');
        }
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
        notifyLevelChanged();
    } else {
        const displayElem = byId('display');
        if (!displayElem) {
            board = null;
            return;
        }
        clearElement(displayElem);
        appendText(displayElem, "You have completed all the levels.  Wow!");
        let img = document.createElement('img');
        img.src = 'kitten.jpg';
        displayElem.appendChild(img);
        board = null;
    }
}

function handleKeyPress(event) {
    if (board && levelComplete() && !scratchInitialBoard) {
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
            restartLevel();
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
window.addEventListener('hashchange', handleLocationChange);

function initTouchControls() {
    const touchControls = byId('touchControls');
    if (!touchControls) {
        return;
    }

    clearElement(touchControls);
    touchControls.setAttribute('aria-label', 'Touch controls');
    if (touchControls.getAttribute('data-selection-guarded') !== 'true') {
        const preventSelection = function(e) {
            if (e && typeof e.preventDefault === 'function') {
                e.preventDefault();
            }
        };
        touchControls.addEventListener('selectstart', preventSelection);
        touchControls.addEventListener('contextmenu', preventSelection);
        touchControls.setAttribute('data-selection-guarded', 'true');
    }

    const actions = currentTouchActions();
    const gameActions = actions.filter((action) => action.kind !== 'system');
    const systemActions = actions.filter((action) => action.kind === 'system');

    appendKeyboardTouchControls(touchControls, gameActions);
    appendTouchButtonRow(touchControls, systemActions, 'controlSystemRow');
}

function simulateKeyPress(key) {
    handleKeyPress({
        key: key,
        charCode: key.charCodeAt(0),
    });
}

// Call this function when the page loads
window.addEventListener('load', function() {
  if (typeof gamesData !== 'undefined') {
    initHub(gamesData);
  }
});

window.UA4K = {
    startHub: initHub,
    startStandalone: startStandalone,
    initTouchControls: initTouchControls,
    setLevel: setLevel,
    currentLevelNumber: currentLevelNumber,
    parseBoardText: parseBoardText,
    validateBoardRows: validateBoardRows,
    parseAndValidateBoardText: parseAndValidateBoardText,
    boardRowsToText: boardRowsToText,
    currentBoardText: currentBoardText,
    originalLevelText: originalLevelText,
    startScratchLevel: startScratchLevel,
    startScratchLevelFromText: startScratchLevelFromText,
    restoreOriginalLevel: restoreOriginalLevel,
    restartLevel: restartLevel,
};
