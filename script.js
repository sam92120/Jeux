const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const bestDisplay = document.getElementById("best");
const restartButton = document.getElementById("restart");
const messageDisplay = document.getElementById("message");
const themeToggle = document.getElementById("theme-toggle");
const ranking = document.getElementById("ranking");
const rankingList = document.getElementById("rankingList");
const playerDisplay = document.getElementById("player");

let board;
let score = 0;
let hasWon = false;
let gameEnded = false;


// ==========================================
// JOUEUR
// ==========================================

let playerName = localStorage.getItem("2048_playerName");

if (!playerName) {
  playerName = prompt(
    "Bienvenue dans le jeu 2048 !\n\nVeuillez entrer votre nom :",
    "Joueur"
  );

  if (!playerName || playerName.trim() === "") {
    playerName = "Joueur";
  }

  playerName = playerName.trim();

  localStorage.setItem(
    "2048_playerName",
    playerName
  );
}


// ==========================================
// MEILLEUR SCORE
// ==========================================

const bestScoreKey =
  `bestScore_${playerName.toLowerCase()}`;

let bestScore =
  Number(localStorage.getItem(bestScoreKey)) || 0;


// ==========================================
// THÈME SOMBRE
// ==========================================

if (localStorage.getItem("2048_theme") === "dark") {
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


// ==========================================
// MESSAGE
// ==========================================

function showMessage(text) {

  messageDisplay.textContent = text;
  messageDisplay.style.display = "block";

  setTimeout(() => {
    messageDisplay.style.display = "none";
  }, 3000);
}


// ==========================================
// DÉMARRER UNE PARTIE
// ==========================================

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

  ranking.style.display = "none";
  restartButton.style.display = "none";
  messageDisplay.style.display = "none";

  addTile();
  addTile();

  drawBoard();
}


// ==========================================
// AFFICHER LE PLATEAU
// ==========================================

function drawBoard() {

  grid.innerHTML = "";

  board.flat().forEach(value => {

    const cell = document.createElement("div");

    cell.className = "cell";

    if (value !== 0) {
      cell.classList.add(`cell-${value}`);
    }

    cell.textContent =
      value === 0 ? "" : value;

    grid.appendChild(cell);
  });

  scoreDisplay.textContent =
    `Score : ${score}`;

  bestDisplay.textContent =
    `Meilleur : ${bestScore}`;

  playerDisplay.textContent =
    `Joueur : ${playerName}`;
}


// ==========================================
// AJOUTER UNE CASE
// ==========================================

function addTile() {

  const emptyCells = [];

  for (let r = 0; r < 4; r++) {

    for (let c = 0; c < 4; c++) {

      if (board[r][c] === 0) {

        emptyCells.push({
          r,
          c
        });
      }
    }
  }

  if (emptyCells.length === 0) {
    return;
  }

  const randomCell =
    emptyCells[
      Math.floor(
        Math.random() * emptyCells.length
      )
    ];

  board[randomCell.r][randomCell.c] =
    Math.random() < 0.9 ? 2 : 4;
}


// ==========================================
// FUSIONNER UNE LIGNE
// ==========================================

function slide(row) {

  row = row.filter(
    value => value !== 0
  );

  for (
    let i = 0;
    i < row.length - 1;
    i++
  ) {

    if (row[i] === row[i + 1]) {

      row[i] *= 2;

      score += row[i];

      row[i + 1] = 0;
    }
  }

  row = row.filter(
    value => value !== 0
  );

  while (row.length < 4) {
    row.push(0);
  }

  return row;
}


// ==========================================
// DÉPLACEMENTS
// ==========================================

function moveLeft() {

  for (let r = 0; r < 4; r++) {
    board[r] = slide(board[r]);
  }
}


function moveRight() {

  for (let r = 0; r < 4; r++) {

    board[r] =
      slide(
        [...board[r]].reverse()
      ).reverse();
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

    column =
      slide(
        column.reverse()
      ).reverse();

    for (let r = 0; r < 4; r++) {
      board[r][c] = column[r];
    }
  }
}


// ==========================================
// COMPARER DEUX PLATEAUX
// ==========================================

function boardsAreEqual(a, b) {

  return JSON.stringify(a) ===
         JSON.stringify(b);
}


// ==========================================
// MEILLEUR SCORE
// ==========================================

function updateBestScore() {

  if (score > bestScore) {

    const oldBest = bestScore;

    bestScore = score;

    localStorage.setItem(
      bestScoreKey,
      bestScore
    );

    if (oldBest > 0) {
      showMessage(
        "🎉 Félicitations ! " +
        "Vous avez battu votre meilleur score !"
      );
    }
  }
}


// ==========================================
// CLASSEMENT
// ==========================================

function saveScore() {

  let rankingData =
    JSON.parse(
      localStorage.getItem("2048_ranking")
    ) || [];

  const existingPlayer =
    rankingData.find(
      player =>
        player.name.toLowerCase() ===
        playerName.toLowerCase()
    );

  if (existingPlayer) {

    if (score > existingPlayer.score) {
      existingPlayer.score = score;
    }

  } else {

    rankingData.push({
      name: playerName,
      score: score
    });
  }

  rankingData.sort(
    (a, b) => b.score - a.score
  );

  rankingData =
    rankingData.slice(0, 10);

  localStorage.setItem(
    "2048_ranking",
    JSON.stringify(rankingData)
  );

  displayRanking();
}


function displayRanking() {

  rankingList.innerHTML = "";

  const rankingData =
    JSON.parse(
      localStorage.getItem("2048_ranking")
    ) || [];

  if (rankingData.length === 0) {

    rankingList.innerHTML =
      "<li>Aucun score pour le moment</li>";

    return;
  }

  rankingData.forEach(player => {

    const li =
      document.createElement("li");

    li.textContent =
      `${player.name} - ${player.score}`;

    rankingList.appendChild(li);
  });
}


function showRanking() {

  ranking.style.display = "block";

  displayRanking();
}


// ==========================================
// FIN DE PARTIE
// ==========================================

function endGame() {

  if (gameEnded) {
    return;
  }

  gameEnded = true;

  updateBestScore();

  saveScore();

  showRanking();

  restartButton.style.display = "block";

  showMessage(
    "Allez ! Vous pouvez faire mieux que ça 👏👏👏 !"
  );
}


// ==========================================
// VICTOIRE
// ==========================================

function checkWin() {

  if (hasWon) {
    return;
  }

  for (const row of board) {

    if (row.includes(2048)) {

      hasWon = true;

      updateBestScore();

      saveScore();

      showRanking();

      showMessage(
        "🎉 Bravo ! Tu as gagné !"
      );

      restartButton.style.display =
        "block";

      return;
    }
  }
}


// ==========================================
// GAME OVER
// ==========================================

function checkGameOver() {

  // Cases vides
  for (const row of board) {

    if (row.includes(0)) {
      return false;
    }
  }

  // Vérification horizontale
  for (let r = 0; r < 4; r++) {

    for (let c = 0; c < 3; c++) {

      if (
        board[r][c] ===
        board[r][c + 1]
      ) {
        return false;
      }
    }
  }

  // Vérification verticale
  for (let c = 0; c < 4; c++) {

    for (let r = 0; r < 3; r++) {

      if (
        board[r][c] ===
        board[r + 1][c]
      ) {
        return false;
      }
    }
  }

  return true;
}


// ==========================================
// APRÈS UN DÉPLACEMENT
// ==========================================

function afterMove(oldBoard) {

  if (gameEnded || hasWon) {
    return;
  }

  if (!boardsAreEqual(oldBoard, board)) {

    addTile();

    updateBestScore();

    drawBoard();

    checkWin();

    if (
      !hasWon &&
      checkGameOver()
    ) {
      endGame();
    }
  }
}


// ==========================================
// CLAVIER
// ==========================================

document.addEventListener(
  "keydown",
  event => {

    if (gameEnded || hasWon) {
      return;
    }

    const key =
      event.key.toLowerCase();

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
      JSON.parse(
        JSON.stringify(board)
      );

    if (
      event.key === "ArrowLeft" ||
      key === "q"
    ) {
      moveLeft();
    }

    if (
      event.key === "ArrowRight" ||
      key === "d"
    ) {
      moveRight();
    }

    if (
      event.key === "ArrowUp" ||
      key === "z"
    ) {
      moveUp();
    }

    if (
      event.key === "ArrowDown" ||
      key === "s"
    ) {
      moveDown();
    }

    afterMove(oldBoard);
  }
);


// ==========================================
// TACTILE
// ==========================================

let startX = 0;
let startY = 0;


grid.addEventListener(
  "touchstart",
  event => {

    event.preventDefault();

    startX =
      event.touches[0].clientX;

    startY =
      event.touches[0].clientY;

  },
  { passive: false }
);


grid.addEventListener(
  "touchmove",
  event => {

    event.preventDefault();

  },
  { passive: false }
);


grid.addEventListener(
  "touchend",
  event => {

    event.preventDefault();

    if (gameEnded || hasWon) {
      return;
    }

    const endX =
      event.changedTouches[0].clientX;

    const endY =
      event.changedTouches[0].clientY;

    const dx = endX - startX;
    const dy = endY - startY;

    if (
      Math.abs(dx) < 30 &&
      Math.abs(dy) < 30
    ) {
      return;
    }

    const oldBoard =
      JSON.parse(
        JSON.stringify(board)
      );

    if (
      Math.abs(dx) > Math.abs(dy)
    ) {

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

  },
  { passive: false }
);

// Si une case est égale à 2048,
// le joueur gagne, le jeu s'arrête,
// le message de victoire s'affiche
// et le score est sauvegardé.

function checkWin() {

  if (hasWon) {
    return;
  }

  for (let i = 0; i < board.length; i++) {

    for (let j = 0; j < board[i].length; j++) {

      if (board[i][j] === 2048) {

        hasWon = true;
        gameEnded = true;

        // Sauvegarder le meilleur score
        updateBestScore();

        // Sauvegarder le score dans le classement
        saveScore();

        // Afficher le classement
        showRanking();

        // Afficher le message de victoire
        showMessage("🎉 Bravo ! Tu as gagné !");

        // Afficher le bouton nouvelle partie
        restartButton.style.display = "block";

        return;
      }
    }
  }
}




// ==========================================
// NOUVELLE PARTIE
// ==========================================

restartButton.addEventListener(
  "click",
  startGame
);


// ==========================================
// LANCEMENT
// ==========================================

startGame();