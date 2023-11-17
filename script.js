let users = {};

function saveUsersToJSON() {
  localStorage.setItem('users', JSON.stringify(users));
}

function loadUsersFromJSON() {
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    users = JSON.parse(storedUsers);
  }
}

function loginUser() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  loadUsersFromJSON(); // JSON dosyasından kullanıcı bilgilerini yükle

  if (users[username]) {
    if (users[username].password === password) {
      alert("Giriş başarılı!");
      currentUser = username;
      window.location.href = "homepage.html";
    } else {
      alert("Şifre hatalı!");
    }
  } else {
    alert("Kullanıcı bulunamadı. Lütfen önce kayıt olun.");
  }
}

function registerUser() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;

  if (users[username]) {
    alert("Bu kullanıcı adı zaten alınmış!");
  } else {
    users[username] = {
      firstName: firstName,
      lastName: lastName,
      password: password,
      matchHistory: []
    };

    saveUsersToJSON(); // Kullanıcıları JSON dosyasına kaydet
    alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
    window.location.href = "login.html"; // Kayıt olduktan sonra otomatik olarak login sayfasına yönlendir
  }
}

function logout() {
  currentUser = null;
  window.location.href = "index.html";
}

function goBack() {
  window.location.href = "homepage.html";
}

// Sayfa yüklendiğinde local storage'dan kullanıcıları yükle
document.addEventListener('DOMContentLoaded', function () {
  loadUsersFromJSON();
});