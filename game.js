let currentPlayer;
let board;
let roundCount;
let matchHistory;
let player1;
let player2;

document.addEventListener('DOMContentLoaded', function () {
  updatePlayers();
  startGame();
});

function updatePlayers() {
  const player1Select = document.getElementById("player1");
  const player2Select = document.getElementById("player2");

  // Oturum açan kullanıcının adını al
  player1 = getCurrentUsername();
  player1Select.innerText = player1;

  // Kayıtlı kullanıcıları al
  const users = JSON.parse(localStorage.getItem('users')) || {};

  // İkinci oyuncunun seçeneklerini doldur
  for (const user in users) {
    // İlk oyuncu zaten seçili olduğu için ikinci oyuncu, ilk oyuncu olmayan diğer kullanıcılardan seçilebilir
    if (user !== player1) {
      const option2 = document.createElement("option");
      option2.value = user;
      option2.text = user;
      player2Select.add(option2);
    }
  }

  // İkinci oyuncu seçeneğinin değişiklik olayını dinle
  player2Select.addEventListener('change', function () {
    player2 = player2Select.value;
    updateStatus();
  });
}

function getCurrentUsername() {
  // Burada oturum açan kullanıcının adını almak için uygun bir yöntemi kullanın
  // Örneğin, localStorage, bir global değişken veya başka bir mekanizma kullanabilirsiniz
  return localStorage.getItem('username') || "Oyuncu 1";
}

function startGame() {
  // İlk oyuncu otomatik olarak seçildi
  currentPlayer = "X"; // İlk oyuncu X
  board = Array(3).fill().map(() => Array(3).fill(null));
  roundCount = 0;
  matchHistory = [];

  updateStatus();
  renderBoard();
}

function updateStatus() {
  document.getElementById("status").innerText = `${currentPlayer}'s Turn | Round: ${roundCount + 1}`;
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

  if (roundCount >= 2) {
    // Oyunu bitir
    updateStatus();
    alert("Oyun tamamlandı. Kazanan: " + determineWinner());
    endGame();
  } else {
    currentPlayer = "X"; // Her tur başında ilk oyuncuya geri dön
    board = Array(3).fill().map(() => Array(3).fill(null));
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
    resetGame();
  }
}

function updateMatchHistory() {
  // Match history'yi her iki oyuncunun bilgisine ekle
  const users = JSON.parse(localStorage.getItem('users')) || {};

  users[player1].matchHistory.push(...matchHistory.filter(winner => winner === "X"));
  users[player2].matchHistory.push(...matchHistory.filter(winner => winner === "O"));

  localStorage.setItem('users', JSON.stringify(users));
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

function goBack() {
  window.location.href = "index.html"; // Ana sayfaya yönlendir
}

function goToMatchHistory() {
  window.location.href = "history.html"; // Match history sayfasına yönlendir
}