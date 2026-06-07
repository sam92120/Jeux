let startX = 0;
let startY = 0;

function handleMove() {
  if (!boardsAreEqual(oldBoardGlobal, board)) {
    addTile();
    updateBestScore();
    drawBoard();
    checkWin();

    if (checkGameOver()) {
      document.getElementById("game-over").style.display = "block";
    }
  }
}

let oldBoardGlobal;

grid.addEventListener("touchstart", (e) => {
  e.preventDefault();

  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  oldBoardGlobal = JSON.parse(JSON.stringify(board));
}, { passive: false });

grid.addEventListener("touchmove", (e) => {
  e.preventDefault();
}, { passive: false });

grid.addEventListener("touchend", (e) => {
  e.preventDefault();

  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const dx = endX - startX;
  const dy = endY - startY;

  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) moveRight();
    else moveLeft();
  } else {
    if (dy > 30) moveDown();
    else moveUp();
  }

  handleMove();
}, { passive: false });