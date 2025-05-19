import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBOdKDj02kCtGJV_998dqYpU--0w9yRYdw",
  authDomain: "aztaotech.firebaseapp.com",
  databaseURL: "https://aztaotech-default-rtdb.firebaseio.com",
  projectId: "aztaotech",
  storageBucket: "aztaotech.firebasestorage.app",
  messagingSenderId: "874796449182",
  appId: "1:874796449182:web:a415e444876c0ec804aa8f",
  measurementId: "G-N4NENT9CP8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const statusRef = ref(db, 'lockStatus');
const overrideRef = ref(db, 'manualOverride');
const connectionRef = ref(db, '.info/connected');

// Update status kunci
onValue(statusRef, (snapshot) => {
  const status = snapshot.val();
  const statusBox = document.getElementById('statusBox');
  const lockStatusText = document.getElementById('lockStatus');

  if (status) {
    lockStatusText.textContent = "TERBUKA";
    statusBox.className = "status-box unlocked";
  } else {
    lockStatusText.textContent = "TERKUNCI";
    statusBox.className = "status-box locked";
  }
});

// Kontrol manual dari admin
document.getElementById('unlockBtn').addEventListener('click', () => {
  set(statusRef, true);
  set(overrideRef, {
    enabled: true,
    by: "admin",
    time: new Date().toLocaleString()
  });
});

document.getElementById('lockBtn').addEventListener('click', () => {
  set(statusRef, false);
  set(overrideRef, {
    enabled: true,
    by: "admin",
    time: new Date().toLocaleString()
  });
});

// Status override terakhir
onValue(overrideRef, (snapshot) => {
  const data = snapshot.val();
  if (data && data.by) {
    document.getElementById('lastAction').textContent = `Terakhir dikendalikan oleh ${data.by} pada ${data.time}`;
  }
});

// Status koneksi Firebase
onValue(connectionRef, (snapshot) => {
  const isConnected = snapshot.val();
  const statusEl = document.getElementById("firebaseStatus");

  if (isConnected === true) {
    statusEl.textContent = "Status Firebase: ONLINE";
    statusEl.style.color = "green";
  } else {
    statusEl.textContent = "Status Firebase: OFFLINE";
    statusEl.style.color = "red";
  }
});

// Logout
window.logout = function () {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}