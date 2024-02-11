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
function getNumberFromTile(tile) {
  return tile[0] + tile[1] * 8;
}
function getTileFromNumber(number) {
  return [number % 8, Math.floor(number / 8)];
}
function createGraph() {
  let board = [...Array(64).keys()];
  board = board.map((number) => getTileFromNumber(number));
  const moves = [];

  for (let i = 0; i < board.length; i++) {
    moves.push(getPossibleMovesFrom(board[i]));
  }

  return moves;
}
const graph = createGraph();

function knightMoves(origin, destination) {
  origin = getNumberFromTile(origin);
  destination = getNumberFromTile(destination);
  if (origin === destination) {
    return null;
  }

  let shortestPath = [];
  const queue = [origin];
  const visited = [origin];
  const paths = [];

  function checkShortest(start, end) {
    const currentNode = queue.shift();

    // Check if destination
    if (currentNode === end) {
      const finalNode = paths.find((path) => path.tile === currentNode);
      // Reconstruct and return path
      let node = finalNode;
      while (node) {
        shortestPath.unshift(node.tile);
        node = paths.find((path) => path.tile === node.predecessor);
      }
      return shortestPath;
    }

    const possibleMoves = graph[currentNode];

    // Check possible moves
    for (let i = 0; i < possibleMoves.length; i++) {
      if (!visited.includes(getNumberFromTile(possibleMoves[i]))) {
        visited.push(getNumberFromTile(possibleMoves[i]));
      } else {
        continue;
      }
      queue.push(getNumberFromTile(possibleMoves[i]));
      paths.push({
        predecessor: currentNode,
        tile: getNumberFromTile(possibleMoves[i]),
      });
    }

    checkShortest(start, end);

    return shortestPath;
  }

  checkShortest(origin, destination);

  shortestPath = shortestPath.map((number) => getTileFromNumber(number));

  return `The shortest path from [${getTileFromNumber(
    origin
  )}] to [${getTileFromNumber(destination)}] takes ${
    shortestPath.length
  } move(s): ${shortestPath.map((move) => `[${move.join(', ')}]`).join(', ')}`;
}

const start = [3, 3];
const end = [5, 7];

const solution = knightMoves(start, end);