import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { database } from "../functions/firebase-auth.js"; // Firebase bağlantısını içe aktar


const usersTable = document.getElementById("users-table");

function fetchUsers() {
    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
        usersTable.innerHTML = ""; // Önce tabloyu temizle
        
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            const uid = childSnapshot.key;
            
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class='border border-gray-300 p-2'>${user.email}</td>
                <td class='border border-gray-300 p-2'>${user.displayName || "-"}</td>
                <td class='border border-gray-300 p-2 text-center'>${user.generatedNames || 0}</td>
                <td class='border border-gray-300 p-2 text-center'>${user.downloads || 0}</td>
                <td class='border border-gray-300 p-2 text-center'>
                    <button class="toggle-premium bg-${user.isPremium ? 'green' : 'gray'}-500 text-white px-3 py-1 rounded" data-uid="${uid}">
                        ${user.isPremium ? "✔ Premium" : "Upgrade"}
                    </button>
                </td>
                <td class='border border-gray-300 p-2 text-center'>
                    <button class="delete-user bg-red-500 text-white px-3 py-1 rounded" data-uid="${uid}">Sil</button>
                </td>
            `;
            usersTable.appendChild(row);
        });

        // Premium butonları için event listener ekleyelim
        document.querySelectorAll(".toggle-premium").forEach(button => {
            button.addEventListener("click", togglePremium);
        });

        // Kullanıcı silme butonları için event listener ekleyelim
        document.querySelectorAll(".delete-user").forEach(button => {
            button.addEventListener("click", deleteUser);
        });
    });
}

// Premium durumunu değiştirme
function togglePremium(event) {
    const uid = event.target.dataset.uid;
    const userRef = ref(database, `users/${uid}`);
    update(userRef, {
        isPremium: event.target.textContent.includes("✔") ? false : true
    });
}

// Kullanıcıyı silme
function deleteUser(event) {
    const uid = event.target.dataset.uid;
    const userRef = ref(database, `users/${uid}`);
    update(userRef, null); // Kullanıcıyı Firebase'den kaldır
}

// Sayfa yüklendiğinde kullanıcıları getir
fetchUsers();
