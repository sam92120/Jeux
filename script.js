
const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const bestDisplay = document.getElementById("best");
const restartButton = document.getElementById("restart");
const messageDisplay = document.getElementById("message");

let board;
let score = 0;
let hasWon = false;
let gameEnded = false;

let playerName = localStorage.getItem("2048_playerName") || "Joueur";

let bestScore = Number(
  localStorage.getItem(`bestScore_${playerName.toLowerCase()}`)
) || 0;

function startGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  score = 0;
  hasWon = false;
  gameEnded = false;

  document.getElementById("ranking").style.display = "none";
  restartButton.style.display = "none";
  messageDisplay.style.display = "none";

  addTile();
  addTile();
  drawBoard();
}

function drawBoard() {
  grid.innerHTML = "";

  board.flat().forEach(value => {
    const cell = document.createElement("div");

    cell.className = "cell";

    if (value !== 0) {
      cell.classList.add(`cell-${value}`);
    }

    cell.textContent = value === 0 ? "" : value;

    grid.appendChild(cell);
  });

  scoreDisplay.textContent = `Score : ${score}`;
  bestDisplay.textContent = `Meilleur : ${bestScore}`;

  const playerDisplay = document.getElementById("player");

  if (playerDisplay) {
    playerDisplay.textContent = `Joueur : ${playerName}`;
  }
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

  const randomCell =
    emptyCells[Math.floor(Math.random() * emptyCells.length)];

  board[randomCell.r][randomCell.c] =
    Math.random() < 0.9 ? 2 : 4;
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
  for (let r = 0; r < 4; r++) {
    board[r] = slide(board[r]);
  }
}

function moveRight() {
  for (let r = 0; r < 4; r++) {
    board[r] = slide([...board[r]].reverse()).reverse();
  }
}

function moveUp() {
  for (let c = 0; c < 4; c++) {
    let column = [
      board[0][c],
      board[1][c],
      board[2][c],
      board[3][c]
    ];

    column = slide(column);

    for (let r = 0; r < 4; r++) {
      board[r][c] = column[r];
    }
  }
}

function moveDown() {
  for (let c = 0; c < 4; c++) {
    let column = [
      board[0][c],
      board[1][c],
      board[2][c],
      board[3][c]
    ];

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

    localStorage.setItem(
      `bestScore_${playerName.toLowerCase()}`,
      bestScore
    );
  }
}

function saveScore() {
  let ranking =
    JSON.parse(localStorage.getItem("2048_ranking")) || [];

  const existingPlayer = ranking.find(
    player =>
      player.name.toLowerCase() === playerName.toLowerCase()
  );

  if (existingPlayer) {
    if (score > existingPlayer.score) {
      existingPlayer.score = score;
    }
  } else {
    ranking.push({
      name: playerName,
      score: score
    });
  }

  ranking.sort((a, b) => b.score - a.score);
  ranking = ranking.slice(0, 10);

  localStorage.setItem(
    "2048_ranking",
    JSON.stringify(ranking)
  );

  displayRanking();
}

function displayRanking() {
  const rankingList =
    document.getElementById("rankingList");

  if (!rankingList) return;

  const ranking =
    JSON.parse(localStorage.getItem("2048_ranking")) || [];

  rankingList.innerHTML = "";

  if (ranking.length === 0) {
    rankingList.innerHTML =
      "<li>Aucun score pour le moment</li>";
    return;
  }

  ranking.forEach(player => {
    const li = document.createElement("li");

    li.textContent =
      `${player.name} - ${player.score}`;

    rankingList.appendChild(li);
  });
}

function showRanking() {
  const ranking =
    document.getElementById("ranking");

  if (ranking) {
    ranking.style.display = "block";
  }

  displayRanking();
}

function endGame() {
  if (gameEnded) return;

  gameEnded = true;

  updateBestScore();
  saveScore();
  showRanking();

  restartButton.style.display = "block";
}

function checkWin() {
  if (hasWon) return;

  for (let row of board) {
    if (row.includes(2048)) {
      hasWon = true;

      updateBestScore();
      saveScore();
      showRanking();

      showMessage("🎉 Bravo ! Tu as gagné !");

      restartButton.style.display = "block";
    }
  }
}

function checkGameOver() {
  for (let row of board) {
    if (row.includes(0)) return false;
  }

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[r][c] === board[r][c + 1]) {
        return false;
      }
    }
  }

  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 3; r++) {
      if (board[r][c] === board[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}

function afterMove(oldBoard) {
  if (gameEnded || hasWon) return;

  if (!boardsAreEqual(oldBoard, board)) {
    addTile();

    updateBestScore();

    drawBoard();

    checkWin();

    if (!hasWon && checkGameOver()) {
      endGame();

      showMessage(
        "Allez ! vous pouvez faire mieux que ça 👏👏👏!"
      );
    }
  }
}

/* Clavier PC */
document.addEventListener("keydown", event => {
  if (gameEnded || hasWon) return;

  const key = event.key.toLowerCase();

  if (
    event.key !== "ArrowLeft" &&
    event.key !== "ArrowRight" &&
    event.key !== "ArrowUp" &&
    event.key !== "ArrowDown" &&
    key !== "q" &&
    key !== "d" &&
    key !== "z" &&
    key !== "s"
  ) {
    return;
  }

  event.preventDefault();

  const oldBoard =
    JSON.parse(JSON.stringify(board));

  if (event.key === "ArrowLeft" || key === "q") {
    moveLeft();
  }

  if (event.key === "ArrowRight" || key === "d") {
    moveRight();
  }

  if (event.key === "ArrowUp" || key === "z") {
    moveUp();
  }

  if (event.key === "ArrowDown" || key === "s") {
    moveDown();
  }

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

  if (gameEnded || hasWon) return;

  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const dx = endX - startX;
  const dy = endY - startY;

  if (
    Math.abs(dx) < 30 &&
    Math.abs(dy) < 30
  ) {
    return;
  }

  const oldBoard =
    JSON.parse(JSON.stringify(board));

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      moveRight();
    } else {
      moveLeft();
    }
  } else {
    if (dy > 0) {
      moveDown();
    } else {
      moveUp();
    }
  }

  afterMove(oldBoard);
}, { passive: false });

restartButton.addEventListener(
  "click",
  startGame
);

/********** Mode sombre **********/

const themeToggle =
  document.getElementById("theme-toggle");

if (
  localStorage.getItem("2048_theme") === "dark"
) {
  document.body.classList.add("dark-theme");
  themeToggle.checked = true;
}

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.body.classList.add("dark-theme");

    localStorage.setItem(
      "2048_theme",
      "dark"
    );
  } else {
    document.body.classList.remove("dark-theme");

    localStorage.setItem(
      "2048_theme",
      "light"
    );
  }
});

//message de victoire ou défaite
function showMessage(text) {
  const messageDiv =
    document.getElementById("message");

  messageDiv.textContent = text;

  messageDiv.style.display = "block";

  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 3000);
}

//si le joueur n'a pas encore choisi son nom, on lui demande
if (!localStorage.getItem("2048_playerName")) {
  playerName = prompt(
    "Bienvenue dans le jeu 2048 !\n\nVeuillez entrer votre nom :",
    "Joueur"
  );

  if (playerName) {
    localStorage.setItem(
      "2048_playerName",
      playerName
    );
  } else {
    playerName = "Joueur";
  }
}

//si le jouer a battu son meilleur score , alors on applaudit le joueur
if (score > bestScore) {
  showMessage(
    "Félicitations ! Vous avez battu votre meilleur score ! 🎉"
  );
}
//le jouer a fait pire que son meilleur score, on lui dit wow t'es nul en nommant par son nom
if (score < bestScore) {
  showMessage(
    `Dommage ${playerName}, etes-vous un peu nul ? 😢`
  );
}
startGame();


