let currentPlayer;
let board;
let roundCount;
let matchHistory;
let player1;
let player2;

document.addEventListener('DOMContentLoaded', function () {
  loadUsersFromJSON();
  showMatchHistory(); // Ekle
  updatePlayers();
  startGame();
});

function updatePlayers() {
  const player1Select = document.getElementById("player1");
  const player2Select = document.getElementById("player2");

  // Kayıtlı kullanıcıları al
  const users = JSON.parse(localStorage.getItem('users')) || {};

  player1Select.innerHTML = "";

  // player2Select'e null kontrolü ekleyelim
  if (player2Select) {
    player2Select.innerHTML = "";

    // Tüm kullanıcıları listele
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

    // İkinci oyuncu seçeneğinin değişiklik olayını dinle
    player2Select.addEventListener('change', function () {
      player2 = player2Select.value;
      updateStatus();
    });
  }

  // İlk oyuncu seçeneğinin değişiklik olayını dinle
  player1Select.addEventListener('change', function () {
    player1 = player1Select.value;
    updateStatus();
  });

  // currentUser kontrolü
  if (typeof currentUser !== 'undefined' && currentUser !== null) {
    player1 = currentUser;
    // player2Select varsa ve değeri null değilse güncelle
    if (player2Select && player2Select.value !== null) {
      player2 = player2Select.value;
    }
    updateStatus();
  } else {
    console.error("currentUser is not defined.");
  }
}

function startGame() {
  // İlk oyuncu otomatik olarak seçildi
  currentPlayer = "X"; // İlk oyuncu X
  board = Array(3).fill().map(() => Array(3).fill(null));
  roundCount = 0;
  matchHistory = [];

  // İlk oyun başlangıcında her iki oyuncuyu da seçili değilse varsayılan bir değer ata
  const player1Select = document.getElementById("player1");
  const player2Select = document.getElementById("player2");

  if (!player1) {
    player1 = player1Select.value;
  }

  if (!player2) {
    player2 = player2Select.value;
  }

  updateStatus();
  renderBoard();
}

function updateStatus() {
  const statusElement = document.getElementById("status");

  if (statusElement) {
    statusElement.innerText = `${getDisplayName(currentPlayer)}'s Turn | Round: ${roundCount + 1}`;
  } else {
    console.error("Status element not found on the page.");
  }
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
        const symbol = document.createElement("span");
        symbol.innerText = board[i][j];
        cell.appendChild(symbol);
      }

      boardElement.appendChild(cell);
    }
  }
}

function makeMove(row, col) {
  if (!board[row][col]) {
    board[row][col] = currentPlayer;

    if (checkWinner(row, col)) {
      updateStatus();
      alert(`${getDisplayName(currentPlayer)} wins Round ${roundCount + 1}!`);

      // Oyunu kazanan oyuncuya puan ekle
      matchHistory.push(currentPlayer);
      startNextRound();
    } else if (roundCount >= 3) {
      updateStatus();
      alert("Game completed. Winner: " + determineWinner());
      endGame();
    } else {
      currentPlayer = (currentPlayer === "X") ? "O" : "X";
      updateStatus();
      renderBoard();
    }
  } else {
    // Eğer hücre zaten doluysa uyarı ver
    alert("This cell is already filled! Please choose another cell.");
  }

  // Eğer hiç kazanan olmazsa ve board doluysa
  if (isBoardFull()) {
    updateStatus();
    alert("Nobody wins. Round is a draw!");
    startNextRound();
  }
}

function checkWinner(row, col) {
  // Dikey ve yatay kontrol
  for (let i = 0; i < 3; i++) {
    if (board[row][i] !== currentPlayer || board[i][col] !== currentPlayer) {
      break;
    }
    if (i === 2) {
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
        return true;
      }
    }
  }

  return false;
}

function determineWinner() {
  // Oyun sonunda kazanan oyunculara puan ekle
  const countPlayer1 = matchHistory.filter(winner => winner === "X").length;
  const countPlayer2 = matchHistory.filter(winner => winner === "O").length;

  if (countPlayer1 > countPlayer2) {
    return `Oyuncu 1 (${player1}) kazanıyor`;
  } else if (countPlayer2 > countPlayer1) {
    return `Oyuncu 2 (${player2}) kazanıyor`;
  } else {
    return "Berabere";
  }
}

function startNextRound() {
  // Bir sonraki turu başlat
  roundCount++;

  if (roundCount > 3) {
    // Oyunu bitir
    updateStatus();
    alert("Oyun tamamlandı. Kazanan: " + determineWinner());
    endGame();
  } else {
    currentPlayer = "X"; // Her tur başında ilk oyuncuya geri dön
    board = Array(3).fill().map(() => Array(3).fill(null));
    player2 = document.getElementById("player2").value; // İkinci oyuncuyu seçilen değere göre güncelle
    updateStatus();
    renderBoard();
  }
}

function endGame() {
  // Her tur sonunda kazananı kontrol et
  if (checkWinner()) {
    updateMatchHistory();
    alert(`${getDisplayName(currentPlayer)} oyunu kazandı!`);
  } else if (isBoardFull()) {
    // Eğer berabere bittiğinde, round sayısını azalt
    matchHistory.push("Berabere");
    alert("Oyun berabere bitti!");
  } else {
    // Eğer kazanan yoksa bir sonraki turu başlat
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    roundCount++;

    updateStatus();
    renderBoard();
  }

  // Toplam 3 tur oynandığında oyunu bitir
  if (roundCount >= 3) {
    alert(`Toplam 3 tur oynandı. Oyun bitti. Kazanan: ${getDisplayName(currentPlayer)}`);
    updateMatchHistory();
    showMatchHistory();
    resetGame();
  }
}

function isBoardFull() {
  // Board'un tamamen dolup dolmadığını kontrol et
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (!board[i][j]) {
        return false; // Hücre dolu değilse devam et
      }
    }
  }
  return true; // Hiç boş hücre kalmadıysa true döndür
}

function getDisplayName(symbol) {
  // Oyuncu simgesini kullanıcı adına dönüştür
  return symbol === "X" ? player1 : player2;
}

function resetGame() {
  startGame(); // Oyunu sıfırla
}

function goToMatchHistory() {
  window.location.href = "history.html"; // Match history sayfasına yönlendir
}

function goBack() {
  window.location.href = "index.html"; // Ana sayfaya yönlendir
}

function updateMatchHistory() {
  const users = JSON.parse(localStorage.getItem('users')) || {};

  const player1History = {
    opponent: player2,
    rounds: roundCount,
    winner: currentPlayer
  };

  const player2History = {
    opponent: player1,
    rounds: roundCount,
    winner: (currentPlayer === "X") ? "O" : "X"
  };

  users[player1].matchHistory.push(player1History);
  users[player2].matchHistory.push(player2History);

  localStorage.setItem('users', JSON.stringify(users));
  showMatchHistory(); // Güncellendikten sonra geçmişi göster
}

function showMatchHistory() {
  const historyTable = document.getElementById("historyTable");

  if (!historyTable) {
    console.error("historyTable not found on the page.");
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || {};
  historyTable.innerHTML = ""; // Önceki içeriği temizle

  for (const playerName in users) {
    const player = users[playerName];

    if (player.matchHistory) {
      for (const match of player.matchHistory) {
        if (match) {
          const { opponent, rounds, winner } = match;

          const row = historyTable.insertRow();
          const cell1 = row.insertCell(0);
          const cell2 = row.insertCell(1);
          const cell3 = row.insertCell(2);
          const cell4 = row.insertCell(3);

          cell1.innerText = playerName;
          cell2.innerText = opponent;
          cell3.innerText = rounds;
          cell4.innerText = (winner) ? `Winner: ${getDisplayName(winner)}` : "Draw";
        } else {
          console.error("Match is null for player:", playerName);
        }
      }
    } else {
      console.error("matchHistory is null for player:", playerName);
    }
  }
}