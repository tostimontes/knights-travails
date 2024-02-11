// * Data Structures
// Use undirected unweighted graph (or weighted?)
// ! graph where each vertex is a tile, and has edges that strecth towards the other vertices?
// * Algorithm instructions
// Pacman style. Call a function possiblePathsFromTile(tile) that return an array of all the tiles (max 8)
// ! Use memoization to record possible moves in each call, and check if any move (or the inverse, has already been discovered)
// check if one of the tiles is origin
// if not, call function on all tiles
// exit loop/recursion when one of the result tiles === origin
// * Extra credit: create UI representation with animated horse, so that anyone can click in two tiles to know the shortest path

function isNotOutOFBounds(tile) {
  if (tile[0] < 0 || tile[0] > 7 || tile[1] < 0 || tile[1] > 7) {
    return false;
  }
  return true;
}
function getPossibleMovesFrom(tile) {
  const moves = [];
  // Negative x move
  for (let x = -1; x >= -2; x -= 1) {
    for (let y = 2; y >= -2; y -= 1) {
      if (y === 0 || Math.abs(Math.abs(x) - Math.abs(y)) !== 1) {
        continue;
      }
      const possibleTile = [tile[0] + x, tile[1] + y];
      if (isNotOutOFBounds(possibleTile)) {
        moves.push(possibleTile);
      }
    }
  }

  // Positive x move
  for (let x = 1; x <= 2; x += 1) {
    for (let y = 2; y >= -2; y -= 1) {
      if (y === 0 || Math.abs(Math.abs(x) - Math.abs(y)) !== 1) {
        continue;
      }
      const possibleTile = [tile[0] + x, tile[1] + y];
      if (isNotOutOFBounds(possibleTile)) {
        moves.push(possibleTile);
      }
    }
  }

  return moves;
}

function createGraph() {
  let board = [...Array(64).keys()];
  board = board.map((number, index) => {
    const xCoordinate = number % 8;
    const yCoordinate = Math.floor(number / 8);
    board[index] = [xCoordinate, yCoordinate];
    return board[index];
  });
  const moves = [];

  for (let i = 0; i < board.length; i++) {
    moves.push(getPossibleMovesFrom(board[i]));
  }

  return moves;
}
const graph = createGraph();

function knightMoves(origin, destination) {
  function getTileNumber(tile) {
    return tile[0] + tile[1] * 8;
  }

  if (origin === destination) {
    return null;
  }

  const shortestPath = [];
  const queue = [origin];
  const visited = [getTileNumber(origin)];
  const paths = [];

  function checkShortest(start, end, predecessor) {
    const currentNode = queue.shift();

    // Check if destination
    if (currentNode === end) {
      const finalNode = { predecessor, tile: end };
      paths.push(finalNode);
      // Reconstruct and return path
      let node = finalNode;
      while (node.predecessor) {
        shortestPath.unshift(node.tile);
        node = node.predecessor;
      }
      return shortestPath;
    }

    const tileIndex = getTileNumber(currentNode);
    const possibleMoves = graph[tileIndex];

    // Check possible moves
    for (let i = 0; i < possibleMoves.length; i++) {
      if (!visited.includes(getTileNumber(possibleMoves[i]))) {
        visited.push(getTileNumber(possibleMoves[i]));
      } else {
        continue;
      }
      queue.push(possibleMoves[i]);
      paths.push({ predecessor, tile: possibleMoves[i] });
    }

    checkShortest(start, end, currentNode);
    return shortestPath;
  }

  checkShortest(origin, destination);

  return `The shortest path takes ${shortestPath.length} move(s): ${shortestPath
    .map((move) => `[${move.join(', ')}]`)
    .join(', ')}`;
}

const start = [3, 3];
const end = [5, 7];

const solution = knightMoves(start, end); // Should output [[3,3], [4,5]]

console.log(solution);
