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
            attachEventListeners(); // Renk seçicilerin ve diğer işlevlerin çalışması için yeniden bağla
        });
    });

    // Sekmeye göre içeriği döndüren fonksiyon
    function getTabContent(tabName) {
        switch (tabName) {
            case "Text":
                return `<div>
                    <label class='block text-gray-700'>Change Text Color:</label>
                    <input type='color' id='textColorPicker' class='mt-2 border p-2 rounded w-full' value='#000000'>
                    
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
                    <input type='color' id='bgColorPicker' class='mt-2 border p-2 rounded w-full' value='#ffffff'>
                </div>`;
            default:
                return `<p class='text-gray-500'>Select an option to customize.</p>`;
        }
    }

    function attachEventListeners() {
        let textColorPicker = document.getElementById("textColorPicker");
        if (textColorPicker) {
            textColorPicker.addEventListener("input", function () {
                document.getElementById("preview-text").style.color = this.value;
            });
        }

        let bgColorPicker = document.getElementById("bgColorPicker");
        if (bgColorPicker) {
            bgColorPicker.addEventListener("input", function () {
                document.getElementById("logo-preview").style.backgroundColor = this.value;
            });
        }
    }

    attachEventListeners(); // İlk yükleme sırasında eventleri bağla

});
