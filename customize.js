document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab-button");
    const customizationOptions = document.getElementById("customization-options");

    // Varsayılan olarak "Text" sekmesini aktif yap
    const defaultTab = tabs[0];
    defaultTab.classList.add("active");
    customizationOptions.innerHTML = getTabContent("Text");

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            // Önce tüm tablardan "active" sınıfını kaldır
            tabs.forEach(t => t.classList.remove("active"));
            
            // Seçilen tabı aktif yap
            this.classList.add("active");
            
            // İçeriği güncelle
            const selectedTab = this.innerText.trim();
            customizationOptions.innerHTML = getTabContent(selectedTab);
        });
    });

    // Sekmeye göre içeriği döndüren fonksiyon
    function getTabContent(tabName) {
        switch (tabName) {
            case "Text":
                return `<div>
                    <label class='block text-gray-700'>Change Text Color:</label>
                    <input type='color' id='textColorPicker' class='mt-2 border p-2 rounded w-full' value='#000000' onchange='updateTextColor(this.value)'>
                </div>`;
            case "Icons":
                return `<p class='text-gray-500'>Icon selection will be added here.</p>`;
            case "Fonts":
                return `<div>
                    <label class='block text-gray-700'>Select Font:</label>
                    <select id='fontSelector' class='mt-2 border p-2 rounded w-full' onchange='updateFont(this.value)'>
                        <option value='Montserrat'>Montserrat</option>
                        <option value='Jost'>Jost</option>
                        <option value='Poppins'>Poppins</option>
                        <option value='Roboto'>Roboto</option>
                        <option value='Lora'>Lora</option>
                    </select>
                </div>`;
            case "Layout":
                return `<p class='text-gray-500'>Layout options will be added here.</p>`;
            case "Background":
                return `<div>
                    <label class='block text-gray-700'>Change Background Color:</label>
                    <input type='color' id='bgColorPicker' class='mt-2 border p-2 rounded w-full' value='#ffffff' onchange='updateBgColor(this.value)'>
                </div>`;
            default:
                return `<p class='text-gray-500'>Select an option to customize.</p>`;
        }
    }

    // Metin rengini değiştirme fonksiyonu
    window.updateTextColor = function (color) {
        document.getElementById("preview-text").style.color = color;
    };

    // Arka plan rengini değiştirme fonksiyonu
    window.updateBgColor = function (color) {
        document.getElementById("logo-preview").style.backgroundColor = color;
    };

    // Font değiştirme fonksiyonu
    window.updateFont = function (font) {
        document.getElementById("preview-text").style.fontFamily = font;
    };
});
