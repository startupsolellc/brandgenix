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
                    
                    <label class='block text-gray-700 mt-4'>Text Effects:</label>
                    <div class='flex flex-wrap gap-2 mt-2'>
                        <button class='effect-button bg-gray-200 px-4 py-2 rounded' onclick='toggleBold()'>Bold</button>
                        <button class='effect-button bg-gray-200 px-4 py-2 rounded' onclick='toggleItalic()'>Italic</button>
                        <button class='effect-button bg-gray-200 px-4 py-2 rounded' onclick='toggleUppercase()'>Uppercase</button>
                        <button class='effect-button bg-gray-200 px-4 py-2 rounded' onclick='toggleShadow()'>Shadow</button>
                        <button class='effect-button bg-gray-200 px-4 py-2 rounded' onclick='increaseSpacing()'>Increase Spacing</button>
                        <button class='effect-button bg-gray-200 px-4 py-2 rounded' onclick='decreaseSpacing()'>Decrease Spacing</button>
                    </div>
                </div>`;
            case "Icons":
                return `<div>
                    <label class='block text-gray-700'>Select an Icon:</label>
                    <div class='grid grid-cols-5 gap-2 mt-2' id='iconList'>
                        <button class='icon-button' onclick='updateIcon("⭐")'>⭐</button>
                        <button class='icon-button' onclick='updateIcon("🔥")'>🔥</button>
                        <button class='icon-button' onclick='updateIcon("💡")'>💡</button>
                        <button class='icon-button' onclick='updateIcon("🚀")'>🚀</button>
                        <button class='icon-button' onclick='updateIcon("💎")'>💎</button>
                    </div>
                    <label class='block text-gray-700 mt-4'>Change Icon Color:</label>
                    <input type='color' id='iconColorPicker' class='mt-2 border p-2 rounded w-full' value='#000000' onchange='updateIconColor(this.value)'>
                </div>`;
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

    // Metin Efektleri
    window.toggleBold = function () {
        let textElement = document.getElementById("preview-text");
        textElement.style.fontWeight = textElement.style.fontWeight === "bold" ? "normal" : "bold";
    };

    window.toggleItalic = function () {
        let textElement = document.getElementById("preview-text");
        textElement.style.fontStyle = textElement.style.fontStyle === "italic" ? "normal" : "italic";
    };

    window.toggleUppercase = function () {
        let textElement = document.getElementById("preview-text");
        textElement.style.textTransform = textElement.style.textTransform === "uppercase" ? "none" : "uppercase";
    };

    window.toggleShadow = function () {
        let textElement = document.getElementById("preview-text");
        textElement.style.textShadow = textElement.style.textShadow ? "" : "2px 2px 4px rgba(0,0,0,0.3)";
    };

    window.increaseSpacing = function () {
        let textElement = document.getElementById("preview-text");
        let spacing = parseFloat(window.getComputedStyle(textElement).letterSpacing);
        textElement.style.letterSpacing = (spacing + 1) + "px";
    };

    window.decreaseSpacing = function () {
        let textElement = document.getElementById("preview-text");
        let spacing = parseFloat(window.getComputedStyle(textElement).letterSpacing);
        textElement.style.letterSpacing = (spacing - 1) + "px";
    };
});
