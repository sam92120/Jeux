
const playerName = document.getElementById("playerName");
const startButton = document.getElementById("startButton");
const rankingList = document.getElementById("rankingList");
const themeToggle = document.getElementById("theme-toggle");

function getRanking() {
  return JSON.parse(localStorage.getItem("2048_ranking")) || [];
}

function displayRanking() {
  const ranking = getRanking();

  rankingList.innerHTML = "";

  if (ranking.length === 0) {
    rankingList.innerHTML = "<li>Aucun score pour le moment</li>";
    return;
  }

  ranking.forEach(player => {
    const li = document.createElement("li");
    li.textContent = `${player.name} - ${player.score}`;
    rankingList.appendChild(li);
  });
}

if (localStorage.getItem("2048_theme") === "dark") {
  document.body.classList.add("dark-theme");
  themeToggle.checked = true;
}

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.body.classList.add("dark-theme");
    localStorage.setItem("2048_theme", "dark");
  } else {
    document.body.classList.remove("dark-theme");
    localStorage.setItem("2048_theme", "light");
  }
});

startButton.addEventListener("click", () => {
  const name = playerName.value.trim();

  if (name === "") {
    alert("Entre ton nom avant de commencer !");
    playerName.focus();
    return;
  }

  localStorage.setItem("2048_playerName", name);

  window.location.href = "jeu.html";
});

playerName.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    startButton.click();
  }
});

displayRanking();
