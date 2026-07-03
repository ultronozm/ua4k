#!/usr/bin/env node
// BFS shortest-solution solver for one level, driven through the real
// browser runtime. Also used as a library by verify_minmoves.js.

const harness = require('./node_harness.js');

function boardKey(board) {
  return board.join('\n');
}

function runAction(context, board, key) {
  harness.setBoard(context, board);
  harness.gameAction(context, key);
  const nextBoard = harness.getBoard(context);
  const complete = harness.levelComplete(context);
  return { nextBoard, complete };
}

function solveLevel(context, actions, maxDepth, maxStates) {
  const startBoard = harness.getBoard(context);
  if (harness.levelComplete(context)) {
    return { sequence: '', explored: 0 };
  }

  const startKey = boardKey(startBoard);
  const queue = [{ board: startBoard, sequence: '', key: startKey }];
  let queueHead = 0;
  const visited = new Set([startKey]);
  let explored = 0;

  while (queueHead < queue.length) {
    const current = queue[queueHead];
    queueHead += 1;
    explored += 1;
    if (explored > maxStates) {
      return { sequence: null, explored, reason: 'state_limit' };
    }

    if (current.sequence.length >= maxDepth) {
      continue;
    }

    for (const key of actions) {
      const { nextBoard, complete } = runAction(context, current.board, key);
      const keyStr = boardKey(nextBoard);
      if (keyStr === current.key) {
        continue;
      }
      if (visited.has(keyStr)) {
        continue;
      }

      const nextSequence = current.sequence + key;
      if (complete) {
        return { sequence: nextSequence, explored };
      }

      visited.add(keyStr);
      queue.push({ board: nextBoard, sequence: nextSequence, key: keyStr });
    }
  }

  return { sequence: null, explored, reason: 'no_solution' };
}

function main() {
  const gameArg = process.argv[2];
  const levelIndex = Number(process.argv[3] || 0);
  const maxDepth = Number(process.argv[4] || 50);
  const maxStates = Number(process.argv[5] || 200000);
  if (!gameArg) {
    console.error('usage: node solve_level.js <game-name-or-file> [level-index] [max-depth] [max-states]');
    process.exit(2);
  }
  if (!Number.isInteger(levelIndex) || levelIndex < 0) {
    console.error('level-index must be a non-negative integer');
    process.exit(2);
  }

  const root = process.cwd();
  const { gameName, data } = harness.compileGameJson(root, gameArg);
  const { context } = harness.createRuntime(root, data, {
    userAgent: 'Node Solver',
    level: levelIndex,
  });
  const actions = harness.boundActions(context);
  const result = solveLevel(context, actions, maxDepth, maxStates);
  if (result.sequence == null) {
    console.log(
      JSON.stringify(
        {
          solved: false,
          game: gameName,
          level: levelIndex,
          explored: result.explored,
          reason: result.reason,
          actions,
        },
        null,
        2
      )
    );
    process.exit(1);
  }

  console.log(
    JSON.stringify(
      {
        solved: true,
        game: gameName,
        level: levelIndex,
        sequence: result.sequence,
        length: result.sequence.length,
        explored: result.explored,
        actions,
      },
      null,
      2
    )
  );
}

module.exports = { solveLevel, runAction, boardKey };

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error(`error: ${err.message}`);
    process.exit(2);
  }
}
