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

getNumberFromTile([7, 0]);
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
  shortestPath.unshift(getTileFromNumber(origin));

  // const consoleMessage = `The shortest path from [${getTileFromNumber(
  //   origin
  // )}] to [${getTileFromNumber(destination)}] takes ${
  //   shortestPath.length
  // } move(s): ${shortestPath.map((move) => `[${move.join(', ')}]`).join(', ')}`;

  return shortestPath;
}

document.addEventListener('DOMContentLoaded', function () {
  const tiles = document.querySelectorAll('.tile');
  let isFirstClick = true;
  let originTile;
  let destinationTile;
  let chessPath;
  let isPathInProgress = false;
  const messageElement = document.getElementById('message');

  const knightSvg = `<svg class="knight-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M96 48L82.7 61.3C70.7 73.3 64 89.5 64 106.5V238.9c0 10.7 5.3 20.7 14.2 26.6l10.6 7c14.3 9.6 32.7 10.7 48.1 3l3.2-1.6c2.6-1.3 5-2.8 7.3-4.5l49.4-37c6.6-5 15.7-5 22.3 0c10.2 7.7 9.9 23.1-.7 30.3L90.4 350C73.9 361.3 64 380 64 400H384l28.9-159c2.1-11.3 3.1-22.8 3.1-34.3V192C416 86 330 0 224 0H83.8C72.9 0 64 8.9 64 19.8c0 7.5 4.2 14.3 10.9 17.7L96 48zm24 68a20 20 0 1 1 40 0 20 20 0 1 1 -40 0zM22.6 473.4c-4.2 4.2-6.6 10-6.6 16C16 501.9 26.1 512 38.6 512H409.4c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16L384 432H64L22.6 473.4z"/></svg>`;

  tiles.forEach((tile) => {
    tile.addEventListener('click', function () {
      if (!isFirstClick && !isPathInProgress) {
        // Ignore the click
        return;
      }

      if (isFirstClick) {
        this.innerHTML = knightSvg;
        originTile = this.classList[1]; // Assuming second class is the tile's position (e.g., 'a1')
        isFirstClick = false;
        isPathInProgress = true;
        this.classList.add('red-highlight-animation'); // Highlight origin
      } else if (!isFirstClick && isPathInProgress) {
        isPathInProgress = false;
        destinationTile = this.classList[1];
        this.classList.add('green-highlight-animation'); // Highlight origin
        const path = knightMoves(
          originToIndex(originTile),
          originToIndex(destinationTile)
        );
        chessPath = path.map(indexToChessNotation);
        animateKnightMovement(chessPath);
      }
    });
  });

  function animateKnightMovement(path) {
    let currentStep = 0;
    let totalX = 0; // Total translation in X
    let totalY = 0; // Total translation in Y
    const transitionDuration = 1500; // Duration in milliseconds

    const interval = setInterval(() => {
      const knightElement = document.querySelector('.knight-svg');
      if (currentStep > 0 && knightElement) {
        const prevTile = document.querySelector(`.${path[currentStep - 1]}`);
        const currTile = document.querySelector(`.${path[currentStep]}`);
        const prevRect = prevTile.getBoundingClientRect();
        const currRect = currTile.getBoundingClientRect();

        // Calculate the translation needed
        const newX = currRect.left - prevRect.left;
        const newY = currRect.top - prevRect.top;

        // Accumulate total translation
        totalX += newX;
        totalY += newY;

        // Apply the accumulated translation
        knightElement.style.transform = `translate(calc(${totalX}px - 50%), calc(${totalY}px - 50%)) scale(1.5)`;

        // Halfway through the transition, scale back down
        setTimeout(() => {
          knightElement.style.transform = `translate(calc(${totalX}px - 50%), calc(${totalY}px - 50%)) scale(1)`;
        }, transitionDuration / 2);

        // Highlight previous tile in yellow
        if (currentStep > 1) {
          document
            .querySelector(`.${path[currentStep - 1]}`)
            .classList.add('yellow-highlight-animation');
        }
      }

      if (currentStep < path.length) {
        // Mark the step number on the previous tile
        if (currentStep > 1) {
          const stepMarker = document.createElement('span');
          stepMarker.textContent = currentStep - 1;
          stepMarker.style.position = 'absolute';
          stepMarker.style.left = '50%';
          stepMarker.style.top = '50%';
          stepMarker.style.transform = 'translate(-50%, -50%)';
          stepMarker.style.fontSize = '20px'; // Adjust as needed
          document
            .querySelector(`.${path[currentStep - 1]}`)
            .appendChild(stepMarker);
        }

        displayPathMessage(path.slice(0, currentStep + 1));
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, transitionDuration); // Adjust delay as needed
  }

  function displayPathMessage(path) {
    const message = `The shortest path from ${path[0]} to ${
      chessPath[chessPath.length - 1]
    } is: ${path.join(' -> ')}`;
    messageElement.textContent = message;
  }

  function resetBoard() {
    // Clear all tiles
    tiles.forEach((tile) => {
      tile.innerHTML = ''; // Clear knight and step numbers
      tile.classList.remove(
        'red-highlight-animation',
        'yellow-highlight-animation',
        'green-highlight-animation'
      ); // Remove any highlights
    });
    isPathInProgress = false;
    // Reset the state of the game
    isFirstClick = true;
  }
  const resetButton = document.getElementById('resetButton');
  resetButton.addEventListener('click', resetBoard);
});

function originToIndex(tile) {
  const file = tile.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = Math.abs(1 - parseInt(tile[1], 10));
  return [rank, file];
}

const files = 'abcdefgh';
function indexToChessNotation(index) {
  const file = files.charAt(index[1]);
  const rank = index[0] + 1;
  return `${file}${rank}`;
}
