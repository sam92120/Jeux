const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const bestDisplay = document.getElementById("best");
const restartButton = document.getElementById("restart");
const messageDisplay = document.getElementById("message");

let board;
let score = 0;
let bestScore = Number(localStorage.getItem("bestScore")) || 0;
let hasWon = false;

function startGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  score = 0;
  hasWon = false;

  addTile();
  addTile();
  drawBoard();
}

function drawBoard() {
  grid.innerHTML = "";

  board.flat().forEach(value => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = value === 0 ? "" : value;
    cell.style.background = getColor(value);
    cell.style.color = value <= 4 ? "#776e65" : "#f9f6f2";
    grid.appendChild(cell);
  });

  scoreDisplay.textContent = `Score : ${score}`;
  bestDisplay.textContent = `Meilleur : ${bestScore}`;
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
  const emptyCells = [];

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) {
        emptyCells.push({ r, c });
      }
    }
  }

  if (emptyCells.length === 0) return;

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
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

  while (row.length < 4) {
    row.push(0);
  }

  return row;
}

function moveLeft() {
  for (let r = 0; r < 4; r++) board[r] = slide(board[r]);
}

function moveRight() {
  for (let r = 0; r < 4; r++) {
    board[r] = slide([...board[r]].reverse()).reverse();
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

function updateBestScore() {
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }
}

function checkWin() {
  if (hasWon) return;

  for (let row of board) {
    if (row.includes(2048)) {
      hasWon = true;
      showMessage("🎉 Bravo ! Tu as gagné !");
    }
  }
}

function checkGameOver() {
  for (let row of board) {
    if (row.includes(0)) return false;
  }

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[r][c] === board[r][c + 1]) return false;
    }
  }

  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 3; r++) {
      if (board[r][c] === board[r + 1][c]) return false;
    }
  }

  return true;
}

function afterMove(oldBoard) {
  if (!boardsAreEqual(oldBoard, board)) {
    addTile();
    updateBestScore();
    drawBoard();
    checkWin();

    if (checkGameOver()) {
      showMessage("💀 partie terminée !");
    }
  }
}

/* Clavier PC */
document.addEventListener("keydown", event => {
  if (
    event.key !== "ArrowLeft" &&
    event.key !== "ArrowRight" &&
    event.key !== "ArrowUp" &&
    event.key !== "ArrowDown"
  ) {
    return;
  }

  event.preventDefault();

  const oldBoard = JSON.parse(JSON.stringify(board));

  if (event.key === "ArrowLeft") moveLeft();
  if (event.key === "ArrowRight") moveRight();
  if (event.key === "ArrowUp") moveUp();
  if (event.key === "ArrowDown") moveDown();

  afterMove(oldBoard);
});

/* Tactile téléphone */
let startX = 0;
let startY = 0;

grid.addEventListener("touchstart", e => {
  e.preventDefault();
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: false });

grid.addEventListener("touchmove", e => {
  e.preventDefault();
}, { passive: false });

grid.addEventListener("touchend", e => {
  e.preventDefault();

  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const dx = endX - startX;
  const dy = endY - startY;

  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

  const oldBoard = JSON.parse(JSON.stringify(board));

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) moveRight();
    else moveLeft();
  } else {
    if (dy > 0) moveDown();
    else moveUp();
  }

  afterMove(oldBoard);
}, { passive: false });

restartButton.addEventListener("click", startGame);

startGame();

/********** Mode sombre **********/
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

//message de victoire ou défaite
function showMessage(text) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = text;
  messageDiv.style.display = "block"; 
  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 3000);
}

function checkWin() {
  if (hasWon) return; 

  for (let row of board) {
    if (row.includes(2048)) {
      hasWon = true;
      showMessage("🎉 Bravo ! Tu as gagné !");
    } 
  }
}

function checkGameOver() {
  for (let row of board) {
    if (row.includes(0)) return false; 
  }

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[r][c] === board[r][c + 1]) return false; 
    }
  }

  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 3; r++) {
      if (board[r][c] === board[r + 1][c]) return false; 
    }
  }

  showMessage("💀 partie terminée !");
  return true;
} 

