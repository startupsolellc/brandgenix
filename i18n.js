// i18n.js - Çoklu dil desteği yönetimi

const supportedLanguages = ['en', 'tr'];
let currentLanguage = localStorage.getItem('language') || 'en';

// Dil dosyalarını yükleme fonksiyonu
async function loadLanguage(lang) {
    if (!supportedLanguages.includes(lang)) lang = 'en';
    const response = await fetch(`/locales/${lang}.json`);
    const translations = await response.json();

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });

    // Dil değiştirici butonunu güncelle
    const langSwitcher = document.getElementById('lang-switcher');
    const mobileLangSwitcher = document.getElementById('mobile-lang-switcher');
    if (langSwitcher) langSwitcher.textContent = translations['language'];
    if (mobileLangSwitcher) mobileLangSwitcher.textContent = translations['language'];

    localStorage.setItem('language', lang);
}

// Dil değiştirici butonuna tıklama
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('lang-switcher').addEventListener('click', () => {
        currentLanguage = currentLanguage === 'en' ? 'tr' : 'en';
        loadLanguage(currentLanguage);
    });

    document.getElementById('mobile-lang-switcher').addEventListener('click', () => {
        currentLanguage = currentLanguage === 'en' ? 'tr' : 'en';
        loadLanguage(currentLanguage);
    });

    loadLanguage(currentLanguage);
});
