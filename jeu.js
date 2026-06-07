const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

let score = 0;

function drawBoard() {
  grid.innerHTML = "";

  board.flat().forEach(value => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = value === 0 ? "" : value;
    cell.style.background = getColor(value);
    grid.appendChild(cell);
  });

  scoreDisplay.textContent = `Score : ${score}`;
}

function getColor(value) {
  const colors = {
    0: "#cdc1b4",
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e"
  };

  return colors[value] || "#3c3a32";
}

function addTile() {
  const empty = [];

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) empty.push({ r, c });
    }
  }

  if (empty.length === 0) return;

  const spot = empty[Math.floor(Math.random() * empty.length)];
  board[spot.r][spot.c] = Math.random() < 0.9 ? 2 : 4;
}

function slide(row) {
  row = row.filter(value => value !== 0);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }

  row = row.filter(value => value !== 0);

  while (row.length < 4) row.push(0);

  return row;
}

function moveLeft() {
  for (let r = 0; r < 4; r++) {
    board[r] = slide(board[r]);
  }
}

function moveRight() {
  for (let r = 0; r < 4; r++) {
    board[r] = slide(board[r].reverse()).reverse();
  }
}

function moveUp() {
  for (let c = 0; c < 4; c++) {
    let column = [board[0][c], board[1][c], board[2][c], board[3][c]];
    column = slide(column);

    for (let r = 0; r < 4; r++) {
      board[r][c] = column[r];
    }
  }
}

function moveDown() {
  for (let c = 0; c < 4; c++) {
    let column = [board[0][c], board[1][c], board[2][c], board[3][c]];
    column = slide(column.reverse()).reverse();

    for (let r = 0; r < 4; r++) {
      board[r][c] = column[r];
    }
  }
}

function boardsAreEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

document.addEventListener("keydown", event => {
  const oldBoard = JSON.parse(JSON.stringify(board));

  if (event.key === "ArrowLeft") moveLeft();
  else if (event.key === "ArrowRight") moveRight();
  else if (event.key === "ArrowUp") moveUp();
  else if (event.key === "ArrowDown") moveDown();
  else return;

  if (!boardsAreEqual(oldBoard, board)) {
    addTile();
    drawBoard();
  }
});

addTile();
addTile();
drawBoard();