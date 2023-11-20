let users = {};
let currentUser;

function saveUsersToJSON() {
  localStorage.setItem('users', JSON.stringify(users));
}

function loadUsersFromJSON() {
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    users = JSON.parse(storedUsers);
    console.log("Loaded users from localStorage:", users);
  } else {
    console.log("No users found in localStorage.");
  }
  if (Object.keys(users).length > 0) {
    // Eğer en az bir kullanıcı varsa, currentUser'ı ilk kullanıcı olarak tanımla
    currentUser = Object.keys(users)[0];
  }
}

function loginUser() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('loginPassword').value;

  loadUsersFromJSON();

  if (users[username]) {
    if (users[username].password === password) {
      alert("Login successful!");
      currentUser = username;
      window.location.href = "homepage.html";
    } else {
      alert("Incorrect password!");
    }
  } else {
    alert("User not found. Please register first.");
  }
}

function registerUser() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;

  if (users[username]) {
    alert("This username is already taken!");
  } else {
    users[username] = {
      firstName: firstName,
      lastName: lastName,
      password: password,
      matchHistory: []
    };

    saveUsersToJSON(); // Corrected function name
    alert("Registration successful! You can now log in.");
    window.location.href = "login.html";
  }
}

function logout() {
  currentUser = null;
  window.location.href = "index.html";
}

function goBack() {
  window.location.href = "homepage.html";
}


document.addEventListener('DOMContentLoaded', function () {
  loadUsersFromJSON();
});
