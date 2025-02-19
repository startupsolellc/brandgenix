import { ref, get, set, update, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// UUID oluşturma fonksiyonu
function generateBrowserId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Misafir kullanıcı yönetimi
class GuestManager {
    constructor(database) {
        this.database = database;
        this.browserId = this.getBrowserId();
        this.guestPath = `browserGuests/${this.browserId}`;
    }

    getBrowserId() {
        let id = localStorage.getItem('brandgenix_browser_id');
        if (!id) {
            id = generateBrowserId();
            localStorage.setItem('brandgenix_browser_id', id);
        }
        return id;
    }

    async checkUsageLimit() {
        try {
            const guestRef = ref(this.database, this.guestPath);
            const snapshot = await get(guestRef);
            
            if (!snapshot.exists()) {
                // İlk kullanım
                await set(guestRef, {
                    firstAccess: serverTimestamp(),
                    lastAccess: serverTimestamp(),
                    generationCount: 0
                });
                return true;
            }

            const data = snapshot.val();
            return (data.generationCount || 0) < 5;
        } catch (error) {
            console.error("Kullanım limiti kontrolünde hata:", error);
            return false;
        }
    }

    async incrementUsage() {
        try {
            const guestRef = ref(this.database, this.guestPath);
            const snapshot = await get(guestRef);
            
            if (snapshot.exists()) {
                const data = snapshot.val();
                await update(guestRef, {
                    lastAccess: serverTimestamp(),
                    generationCount: (data.generationCount || 0) + 1
                });
            }
        } catch (error) {
            console.error("Kullanım artırma hatası:", error);
        }
    }

    async getRemainingGenerations() {
        try {
            const guestRef = ref(this.database, this.guestPath);
            const snapshot = await get(guestRef);
            
            if (!snapshot.exists()) {
                return 5;
            }

            const data = snapshot.val();
            return Math.max(0, 5 - (data.generationCount || 0));
        } catch (error) {
            console.error("Kalan hak kontrolünde hata:", error);
            return 0;
        }
    }
}

export { GuestManager };
