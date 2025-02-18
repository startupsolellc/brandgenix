import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
        const adminEmail = "mdikyurt@gmail.com"; // 🔥 Admin e-postası
        if (user.email === adminEmail) {
            console.log("✅ Admin giriş yaptı:", user.email);
        } else {
            console.warn("❌ Yetkisiz giriş tespit edildi! Ana sayfaya yönlendiriliyor...");
            window.location.href = "/";
        }
    } else {
        console.warn("❌ Giriş yapılmamış! Ana sayfaya yönlendiriliyor...");
        window.location.href = "/";
    }
});
