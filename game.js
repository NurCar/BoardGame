let currentPlayer;
let board;
let roundCount;
let matchHistory;



document.addEventListener('DOMContentLoaded', function () {
  updatePlayers();
  startGame();
});

function updatePlayers() {
  const player1Select = document.getElementById("player1");
  const player2Select = document.getElementById("player2");

  // Oyuncu seçeneklerini doldur
  player1Select.innerHTML = "";
  player2Select.innerHTML = "";

  // Kayıtlı kullanıcıları al
  const users = JSON.parse(localStorage.getItem('users')) || {};

  for (const user in users) {
    const option1 = document.createElement("option");
    option1.value = user;
    option1.text = user;
    player1Select.add(option1);

    const option2 = document.createElement("option");
    option2.value = user;
    option2.text = user;
    player2Select.add(option2);
  }
}

function startGame() {
  currentPlayer = "Player 1";
  board = Array(3).fill().map(() => Array(3).fill(null));
  roundCount = 0;
  matchHistory = [];

  updateStatus();
  renderBoard();
}

function updateStatus() {
  document.getElementById("status").innerText = `Sıra: ${currentPlayer} | Tur: ${roundCount}`;
}

function renderBoard() {
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.onclick = () => makeMove(i, j);

      if (board[i][j]) {
        cell.innerText = board[i][j];
      }

      boardElement.appendChild(cell);
    }
  }
}

function makeMove(row, col) {
  if (!board[row][col]) {
    board[row][col] = currentPlayer;
    roundCount++;

    if (checkWinner(row, col)) {
      updateStatus();
      alert(`${currentPlayer} kazandı!`);
      endGame();
    } else if (roundCount === 9) {
      updateStatus();
      alert("Berabere!");
      endGame();
    } else {
      currentPlayer = currentPlayer === "Player 1" ? "Player 2" : "Player 1";
      updateStatus();
      renderBoard();
    }
  }
}

function checkWinner(row, col) {
  // Dikey ve yatay kontrol
  for (let i = 0; i < 3; i++) {
    if (board[row][i] !== currentPlayer || board[i][col] !== currentPlayer) {
      break;
    }
    if (i === 2) {
      saveMatchHistory();
      return true;
    }
  }

  // Çapraz kontrol
  if (row === col || row + col === 2) {
    for (let i = 0; i < 3; i++) {
      if (board[i][i] !== currentPlayer || board[i][2 - i] !== currentPlayer) {
        break;
      }
      if (i === 2) {
        saveMatchHistory();
        return true;
      }
    }
  }

  return false;
}

function endGame() {
  updateMatchHistory();
}

function saveMatchHistory() {
  const winner = currentPlayer;
  const loser = currentPlayer === "Player 1" ? "Player 2" : "Player 1";

  matchHistory.push({
    winner: winner,
    loser: loser,
    rounds: roundCount
  });

  saveMatchHistoryToLocalStorage();
}

function saveMatchHistoryToLocalStorage() {
  // Match history'yi localStorage'a kaydet
  localStorage.setItem('matchHistory', JSON.stringify(matchHistory));
}

function updateMatchHistory() {
  // Match history'yi her iki oyuncunun bilgisine ekle
  const player1 = document.getElementById("player1").value;
  const player2 = document.getElementById("player2").value;

  const users = JSON.parse(localStorage.getItem('users')) || {};

  users[player1].matchHistory.push(...matchHistory);
  users[player2].matchHistory.push(...matchHistory);

  localStorage.setItem('users', JSON.stringify(users));
}

function resetGame() {
  startGame(); // Oyunu sıfırla
}

function goBack() {
  window.location.href = "homepage.html";
}