let currentPlayer;
let board;
let roundCount;
let matchHistory;
let player1;
let player2;

document.addEventListener('DOMContentLoaded', function () {
  loadUsersFromJSON();
  updatePlayers();
  startGame();
});

function updatePlayers() {
  const player1Select = document.getElementById("player1");
  const player2Select = document.getElementById("player2");

  if (!player1Select || !player2Select) {
    console.error("player1Select or player2Select not found!");
    return;
  }

  // Get registered users
  const users = JSON.parse(localStorage.getItem('users')) || {};

  player1Select.innerHTML = "";
  player2Select.innerHTML = "";

  // List all users
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

  // Listen for the change event of the second player option
  player2Select.addEventListener('change', function () {
    player2 = player2Select.value;
    updateStatus();
  });

  // Listen for the change event of the first player option
  player1Select.addEventListener('change', function () {
    player1 = player1Select.value;
    updateStatus();
  });

  // Check for currentUser
  if (typeof currentUser !== 'undefined' && currentUser !== null) {
    // If a new user is registered, add this user to the options
    if (!users[currentUser]) {
      const option1 = document.createElement("option");
      option1.value = currentUser;
      option1.text = currentUser;
      player1Select.add(option1);

      const option2 = document.createElement("option");
      option2.value = currentUser;
      option2.text = currentUser;
      player2Select.add(option2);

      // Add to registered users
      users[currentUser] = {
        matchHistory: []
      };
      saveUsersToJSON('users');
    }

    player1 = currentUser;
    player2 = player2Select.value; // Update the second player based on the selected value
    updateStatus();

    // Start the game after updating players
    startGame();
    renderBoard(); // Call renderBoard here
  } else {
    console.error("currentUser is not defined.");
  }
}

function getDisplayName(symbol) {
  // Convert player symbol to username
  if (typeof currentUser !== 'undefined' && currentUser !== null) {
    return symbol === "X" ? player1 : player2;
  } else {
    console.error("currentUser is not defined.");
    return "";
  }
}

function startGame() {
  // First player is automatically selected
  currentPlayer = "X"; // First player is X
  board = Array(3).fill().map(() => Array(3).fill(null));
  roundCount = 0;
  matchHistory = [];

  // At the start of the first game, assign default values to both players if not selected
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

  if (boardElement) {
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
  } else {
    console.error("Board element not found on the page.");
  }
}

function makeMove(row, col) {
  if (!board[row][col]) {
    board[row][col] = currentPlayer;

    if (checkWinner(row, col)) {
      updateStatus();
      alert(`${getDisplayName(currentPlayer)} wins Round ${roundCount + 1}!`);

      // Add a point to the winning player
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
    // If the cell is already filled, show an alert
    alert("This cell is already filled! Please choose another cell.");
  }

  // If no winner and the board is full
  if (isBoardFull()) {
    updateStatus();
    alert("Nobody wins. Round is a draw!");
    startNextRound();
  }
}

function checkWinner(row, col) {
  // Check horizontally and vertically
  for (let i = 0; i < 3; i++) {
    if (board[row][i] !== currentPlayer || board[i][col] !== currentPlayer) {
      break;
    }
    if (i === 2) {
      return true;
    }
  }

  // Check diagonally
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
  // Add points to winning players at the end of the game
  const countPlayer1 = matchHistory.filter(winner => winner === "X").length;
  const countPlayer2 = matchHistory.filter(winner => winner === "O").length;

  if (countPlayer1 >= 3) {
    return `Player 1 (${player1}) wins`;
  } else if (countPlayer2 >= 3) {
    return `Player 2 (${player2}) wins`;
  } else {
    return `No winner yet`;
  }
}

function startNextRound() {
  roundCount++;

  if (roundCount > 3) {
    updateStatus();
    alert("Game completed. Winner: " + determineWinner());

    // Update matchInfo
    matchInfo.winner = determineWinner();

    // Update match history and show it
    updateMatchHistory();
    showMatchHistory();

    endGame();
  } else {
    currentPlayer = "X";
    board = Array(3).fill().map(() => Array(3).fill(null));
    player2 = document.getElementById("player2").value;
    updateStatus();
    renderBoard();
  }
}
function endGame() {
  if (checkWinner(0, 0)) {
    alert(`${getDisplayName(currentPlayer)} wins the game!`);
  } else if (isBoardFull()) {
    alert("The game is a draw!");
  } else {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    roundCount++;

    updateStatus();
    renderBoard();
  }

  if (roundCount >= 3) {
    alert(`A total of 3 rounds have been played. The game is over. Winner: ${determineWinner()}`);
    resetGame();
  }
}

function isBoardFull() {
  // Check if the board is completely filled
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (!board[i][j]) {
        return false; // Continue if the cell is not filled
      }
    }
  }
  return true; // Return true if there are no empty cells
}

function resetGame() {
  startGame(); // Reset the game
}

function goToMatchHistory() {
  window.location.href = "history.html"; // Redirect to the Match History page
}

function goBack() {
  window.location.href = "index.html"; // Redirect to the Home page
}

let matchInfo = {
  player1: null,
  player2: null,
  rounds: 0,
  winner: null,
};

function updateMatchHistory() {
  // Add the match info to the current user's match history
  const users = JSON.parse(localStorage.getItem('users')) || {};

  if (users[player1] && users[player2]) {
    users[player1].matchHistory.push({ opponent: player2, rounds: roundCount, winner: matchInfo.winner });
    users[player2].matchHistory.push({ opponent: player1, rounds: roundCount, winner: matchInfo.winner });
    saveUsersToJSON('users');
  }
}

function showMatchHistory() {
  const historyTable = document.getElementById("historyTable");
  const tbody = historyTable.querySelector("tbody");

  // Clear existing rows
  tbody.innerHTML = "";

  // Retrieve match history from the current user's data
  const users = JSON.parse(localStorage.getItem('users')) || {};
  const currentUserHistory = users[currentUser]?.matchHistory || [];

  // Populate the table with match history
  currentUserHistory.forEach((match) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${currentUser}</td><td>${match.opponent}</td><td>${match.rounds}</td><td>${match.winner || 'Draw'}</td>`;
    tbody.appendChild(row);
  });
}