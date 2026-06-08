let playerX = prompt("Nom du joueur X ?") || "Joueur X";
let playerO = prompt("Nom du joueur O ?") || "Joueur O";

const targetScoreInput = document.getElementById("target-score");
let manchesPourGagner = Number(targetScoreInput.value) || 3;

targetScoreInput.addEventListener("input", () => {
  manchesPourGagner = Number(targetScoreInput.value) || 3;
});

const grid = document.getElementById("grid");
const statusText = document.getElementById("status");
const restartButton = document.getElementById("restart");

const overlay = document.getElementById("overlay");
const winnerText = document.getElementById("winner-text");
const playAgainButton = document.getElementById("play-again");
const winLine = document.getElementById("win-line");

const scoreXText = document.getElementById("score-x");
const scoreOText = document.getElementById("score-o");
const scoreDrawText = document.getElementById("score-draw");

const nameXText = document.getElementById("name-x");
const nameOText = document.getElementById("name-o");

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;
let matchFinished = false;

nameXText.textContent = playerX;
nameOText.textContent = playerO;
statusText.textContent = `Au tour de ${playerX}`;

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function drawBoard() {
  grid.innerHTML = "";

  board.forEach((value, index) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = value;
    cell.addEventListener("click", () => play(index));
    grid.appendChild(cell);
  });
}

function play(index) {
  if (board[index] !== "" || gameOver || matchFinished) return;
  targetScoreInput.disabled = true;

  board[index] = currentPlayer;
  drawBoard();

  const winnerPattern = getWinnerPattern();

  if (winnerPattern) {
    gameOver = true;

    const winnerName = currentPlayer === "X" ? playerX : playerO;

    if (currentPlayer === "X") {
      scoreX++;
      scoreXText.textContent = scoreX;
    } else {
      scoreO++;
      scoreOText.textContent = scoreO;
    }

    showWinLine(winnerPattern);
    document.body.classList.add("shake");

    setTimeout(() => {
      document.body.classList.remove("shake");
if (scoreX >= manchesPourGagner || scoreO >= manchesPourGagner) {
  matchFinished = true;

  winnerText.textContent =
    `🏆 ${winnerName} gagne la partie complète !`;

  setTimeout(() => {
    scoreX = 0;
    scoreO = 0;
    scoreDraw = 0;

    scoreXText.textContent = "0";
    scoreOText.textContent = "0";
    scoreDrawText.textContent = "0";

    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameOver = false;
    matchFinished = false;

    targetScoreInput.disabled = false;

    overlay.style.display = "none";

    winLine.style.width = "0";
    winLine.style.transform = "rotate(0deg)";

    statusText.textContent = `Au tour de ${playerX}`;

    drawBoard();
  }, 3000);
} else {
        winnerText.textContent = `🎉 ${winnerName} gagne cette manche !`;
      }

      overlay.style.display = "flex";
    }, 700);

    return;
  }

  if (board.every(cell => cell !== "")) {
    gameOver = true;

    scoreDraw++;
    scoreDrawText.textContent = scoreDraw;

    winnerText.textContent = "😐 Match nul";
    overlay.style.display = "flex";
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Au tour de ${currentPlayer === "X" ? playerX : playerO}`;
}

function getWinnerPattern() {
  for (const pattern of winPatterns) {
    if (
      board[pattern[0]] &&
      board[pattern[0]] === board[pattern[1]] &&
      board[pattern[1]] === board[pattern[2]]
    ) {
      return pattern;
    }
  }

  return null;
}

function showWinLine(pattern) {
  const firstCell = grid.children[pattern[0]];
  const lastCell = grid.children[pattern[2]];

  const gameRect = document.getElementById("game").getBoundingClientRect();
  const firstRect = firstCell.getBoundingClientRect();
  const lastRect = lastCell.getBoundingClientRect();

  const x1 = firstRect.left + firstRect.width / 2 - gameRect.left;
  const y1 = firstRect.top + firstRect.height / 2 - gameRect.top;
  const x2 = lastRect.left + lastRect.width / 2 - gameRect.left;
  const y2 = lastRect.top + lastRect.height / 2 - gameRect.top;

  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

  winLine.style.left = `${x1}px`;
  winLine.style.top = `${y1}px`;
  winLine.style.width = `${length}px`;
  winLine.style.transform = `rotate(${angle}deg)`;
}

function nextRound() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameOver = false;
  targetScoreInput.disabled = false;
  statusText.textContent = `Au tour de ${playerX}`;
  overlay.style.display = "none";

  winLine.style.width = "0";
  winLine.style.transform = "rotate(0deg)";

  drawBoard();
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameOver = false;
  matchFinished = false;

  scoreX = 0;
  scoreO = 0;
  scoreDraw = 0;

  scoreXText.textContent = scoreX;
  scoreOText.textContent = scoreO;
  scoreDrawText.textContent = scoreDraw;

  manchesPourGagner = Number(targetScoreInput.value) || 3;

  statusText.textContent = `Au tour de ${playerX}`;
  overlay.style.display = "none";

  winLine.style.width = "0";
  winLine.style.transform = "rotate(0deg)";

  drawBoard();
}
restartButton.addEventListener("click", restartGame);
playAgainButton.addEventListener("click", nextRound);