const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const bestDisplay = document.getElementById("best");
const messageDisplay = document.getElementById("message");
const restartButton = document.getElementById("restart");
const themeToggle = document.getElementById("theme-toggle");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake;
let food;
let velocity;
let score;
let bestScore = Number(localStorage.getItem("snakeBestScore")) || 0;
let gameOver;
let gameStarted;
let gameInterval;

function startGame() {
  snake = [{ x: 10, y: 10 }];
  food = { x: 15, y: 15 };
  velocity = { x: 0, y: 0 };
  score = 0;
  gameOver = false;
  gameStarted = false;
  messageDisplay.textContent = "";

  updateScore();
  draw();

  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 100);
}

function updateScore() {
  scoreDisplay.textContent = `Score : ${score}`;
  bestDisplay.textContent = `Meilleur : ${bestScore}`;
}

function showMessage(text) {
  messageDisplay.textContent = text;

  setTimeout(() => {
    messageDisplay.textContent = "";
  }, 2500);
}

function gameLoop() {
  if (gameOver) {
    drawGameOver();
    clearInterval(gameInterval);
    return;
  }

  if (!gameStarted) {
    draw();
    return;
  }

  update();
  draw();
}

function update() {
  const head = {
    x: snake[0].x + velocity.x,
    y: snake[0].y + velocity.y
  };

  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount
  ) {
    gameOver = true;
    return;
  }

  for (let part of snake) {
    if (head.x === part.x && head.y === part.y) {
      gameOver = true;
      return;
    }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    updateBestScore();
    updateScore();
    placeFood();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Corps
  for (let i = snake.length - 1; i >= 0; i--) {
    const x = snake[i].x * gridSize + gridSize / 2;
    const y = snake[i].y * gridSize + gridSize / 2;

    ctx.fillStyle = i === 0 ? "#32cd32" : "#228b22";

    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tête
  const headX = snake[0].x * gridSize + gridSize / 2;
  const headY = snake[0].y * gridSize + gridSize / 2;

  ctx.fillStyle = "white";

  ctx.beginPath();
  ctx.arc(headX - 3, headY - 3, 2, 0, Math.PI * 2);
  ctx.arc(headX + 3, headY - 3, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "black";

  ctx.beginPath();
  ctx.arc(headX - 3, headY - 3, 1, 0, Math.PI * 2);
  ctx.arc(headX + 3, headY - 3, 1, 0, Math.PI * 2);
  ctx.fill();

  // Nourriture
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(
    food.x * gridSize + gridSize / 2,
    food.y * gridSize + gridSize / 2,
    8,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function drawGameOver() {
  draw();

  ctx.fillStyle = "red";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over", 125, 200);
}

function placeFood() {
  let newFood;

  do {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (
    snake.some(part => part.x === newFood.x && part.y === newFood.y)
  );

  food = newFood;
}

function updateBestScore() {
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("snakeBestScore", bestScore);
    showMessage("🎉 Bravo ! Nouveau meilleur score !");
  }
}

window.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && velocity.y === 0) {
    velocity = { x: 0, y: -1 };
    gameStarted = true;
  }

  if (e.key === "ArrowDown" && velocity.y === 0) {
    velocity = { x: 0, y: 1 };
    gameStarted = true;
  }

  if (e.key === "ArrowLeft" && velocity.x === 0) {
    velocity = { x: -1, y: 0 };
    gameStarted = true;
  }

  if (e.key === "ArrowRight" && velocity.x === 0) {
    velocity = { x: 1, y: 0 };
    gameStarted = true;
  }
});

restartButton.addEventListener("click", startGame);

if (localStorage.getItem("snakeTheme") === "dark") {
  document.body.classList.add("dark-theme");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  if (document.body.classList.contains("dark-theme")) {
    localStorage.setItem("snakeTheme", "dark");
  } else {
    localStorage.setItem("snakeTheme", "light");
  }
});

startGame();

// Amélioration : Ajouter des animations de transition pour les changements de direction du serpent et les effets de nourriture.

const originalUpdate = update;
update = function() {
  originalUpdate(); 
    // Ajouter une animation de transition pour les changements de direction
    if (velocity.x !== 0 || velocity.y !== 0) { 
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize, gridSize);
    }
};

//vitesse du serpent qui augmente progressivement
let speed = 100;
function gameLoop() {
  if (gameOver) {
    drawGameOver();
    clearInterval(gameInterval);
    return;
  }

    if (!gameStarted) {
    draw();
    return;
  }
    update();
    draw();

    // Augmenter la vitesse du serpent tous les 5 points
    if (score > 0 && score % 20 === 0) {
        speed = Math.max(50, speed - 10); // Réduire le délai pour augmenter la vitesse
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
    }


}


