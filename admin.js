import { getDatabase, ref, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { database } from "../functions/firebase-auth.js"; // Firebase bağlantısını içe aktar

const usersTable = document.getElementById("users-table");
const totalUsersSpan = document.getElementById("total-users");
const premiumUsersSpan = document.getElementById("premium-users");
const totalNamesSpan = document.getElementById("total-names");
const totalDownloadsSpan = document.getElementById("total-downloads");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
let usersList = [];

console.log("🔍 Firebase bağlantısı kontrol ediliyor...");
console.log("📡 Kullanıcı verileri çekilmeye çalışılıyor...");

function fetchUsers() {
    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
        if (!snapshot.exists()) {
            console.warn("⚠️ Kullanıcı verisi bulunamadı!");
            return;
        }
        usersList = [];
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            const uid = childSnapshot.key;
            usersList.push({ uid, ...user });
        });
        updateStats();
        renderUsers();
    }, (error) => {
        console.error("❌ Firebase veri çekme hatası:", error);
    });
}

function updateStats() {
    totalUsersSpan.textContent = usersList.length;
    premiumUsersSpan.textContent = usersList.filter(user => user.isPremium).length;
    totalNamesSpan.textContent = usersList.reduce((sum, user) => sum + (user.generatedNames || 0), 0);
    totalDownloadsSpan.textContent = usersList.reduce((sum, user) => sum + (user.downloads || 0), 0);
}

function renderUsers() {
    usersTable.innerHTML = "";
    let filteredUsers = [...usersList];

    if (searchInput.value.trim()) {
        const query = searchInput.value.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
            user.email.toLowerCase().includes(query) || 
            (user.displayName && user.displayName.toLowerCase().includes(query))
        );
    }

    if (sortSelect.value === "premium") {
        filteredUsers.sort((a, b) => b.isPremium - a.isPremium);
    } else if (sortSelect.value === "downloads") {
        filteredUsers.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    }

    filteredUsers.forEach(user => {
        const row = document.createElement("tr");
        row.className = user.isPremium ? "bg-green-100" : "";
        row.innerHTML = `
            <td class='border border-gray-300 p-2'>${user.email}</td>
            <td class='border border-gray-300 p-2'>${user.displayName || "-"}</td>
            <td class='border border-gray-300 p-2 text-center'>${user.generatedNames || 0}</td>
            <td class='border border-gray-300 p-2 text-center'>${user.downloads || 0}</td>
            <td class='border border-gray-300 p-2 text-center'>
                <button class="toggle-premium bg-${user.isPremium ? 'green' : 'gray'}-500 text-white px-3 py-1 rounded" data-uid="${user.uid}">
                    ${user.isPremium ? "✔ Premium" : "Upgrade"}
                </button>
            </td>
            <td class='border border-gray-300 p-2 text-center'>
                <button class="delete-user bg-red-500 text-white px-3 py-1 rounded" data-uid="${user.uid}">Sil</button>
            </td>
        `;
        usersTable.appendChild(row);
    });

    document.querySelectorAll(".toggle-premium").forEach(button => {
        button.addEventListener("click", togglePremium);
    });
    document.querySelectorAll(".delete-user").forEach(button => {
        button.addEventListener("click", deleteUser);
    });
}

function togglePremium(event) {
    const uid = event.target.dataset.uid;
    const userRef = ref(database, `users/${uid}`);
    const isCurrentlyPremium = event.target.textContent.includes("✔");
    update(userRef, { isPremium: !isCurrentlyPremium });
}

function deleteUser(event) {
    const uid = event.target.dataset.uid;
    const userRef = ref(database, `users/${uid}`);
    console.log(`🗑 Kullanıcı siliniyor: ${uid}`);
    remove(userRef)
        .then(() => {
            console.log("✅ Kullanıcı başarıyla silindi.");
        })
        .catch(error => {
            console.error("❌ Kullanıcı silme hatası:", error);
        });
}

searchInput.addEventListener("input", renderUsers);
sortSelect.addEventListener("change", renderUsers);

fetchUsers();
