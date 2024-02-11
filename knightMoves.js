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
function createGraph() {
  const xAxis = [...Array(8).keys()].map(Number);
  const yAxis = [...Array(8).keys()].map(Number);
}

function possibleMoves(tile) {
  const moves = [];
  // Negative x move
  for (let x = -1; x > -2; x -= 1) {
    for (let y = 2; y > -2; y -= 1) {
      if (y === 0) {
        continue;
      }
      const possibleTile = [tile[0] + x, tile[1] + y];
      if (isNotOutOFBounds(possibleTile)) {
        moves.push(possibleTile);
      }
    }
  }

  // Positive x move
  for (let x = 1; x < 2; x += 1) {
    for (let y = 2; y > -2; y -= 1) {
      if (y === 0) {
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

function knightMoves(origin, destination) {
  const output = [origin];
  const checkedMoves = [];

  output.push(destination);
  return output;
}

const start = [3, 3];
const end = [3, 4];

createGraph();
possibleMoves([3, 3]);

const shortestPath = knightMoves(start, end);
