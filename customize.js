document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab-button");
    const customizationOptions = document.getElementById("customization-options");

    const defaultTab = tabs[0];
    defaultTab.classList.add("active");
    customizationOptions.innerHTML = getTabContent("Text");

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            const selectedTab = this.innerText.trim();
            customizationOptions.innerHTML = getTabContent(selectedTab);
        });
    });

    function getTabContent(tabName) {
        switch (tabName) {
            case "Text":
                return `<div>
                    <label class='block text-gray-700'>Change Text Color:</label>
                    <input type='color' id='textColorPicker' class='mt-2 border p-2 rounded w-full' value='#000000' onchange='updateTextColor(this.value)'>
                    <label class='block text-gray-700 mt-4'>Text Effects:</label>
                    <div class='mt-2'>
                        <input type='checkbox' id='boldToggle' onchange='toggleBold()'> Bold
                        <input type='checkbox' id='shadowToggle' onchange='toggleShadow()'> Shadow
                    </div>
                    <label class='block text-gray-700 mt-4'>Letter Spacing:</label>
                    <input type='range' id='letterSpacingSlider' class='mt-2 w-full' min='0' max='10' value='0' oninput='updateLetterSpacing(this.value)'>
                    <label class='block text-gray-700 mt-4'>Stroke Width:</label>
                    <input type='range' id='strokeWidthSlider' class='mt-2 w-full' min='0' max='5' value='0' oninput='updateStrokeWidth(this.value)'>
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
                    <label class='block text-gray-700 mt-4'>Change Icon Size:</label>
                    <input type='range' id='iconSizeSlider' class='mt-2 w-full' min='16' max='100' value='40' oninput='updateIconSize(this.value)'>
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
            case "Background":
                return `<div>
                    <label class='block text-gray-700'>Change Background Color:</label>
                    <input type='color' id='bgColorPicker' class='mt-2 border p-2 rounded w-full' value='#ffffff' onchange='updateBgColor(this.value)'>
                </div>`;
            default:
                return `<p class='text-gray-500'>Select an option to customize.</p>`;
        }
    }

    window.updateTextColor = function (color) {
        document.getElementById("preview-text").style.color = color;
    };

    window.updateBgColor = function (color) {
        document.getElementById("logo-preview").style.backgroundColor = color;
    };

    window.updateFont = function (font) {
        document.getElementById("preview-text").style.fontFamily = font;
    };

    window.toggleBold = function () {
        let textElement = document.getElementById("preview-text");
        textElement.style.fontWeight = document.getElementById("boldToggle").checked ? "bold" : "normal";
    };

    window.toggleShadow = function () {
        let textElement = document.getElementById("preview-text");
        textElement.style.textShadow = document.getElementById("shadowToggle").checked ? "2px 2px 4px rgba(0, 0, 0, 0.3)" : "none";
    };

    window.updateLetterSpacing = function (spacing) {
        document.getElementById("preview-text").style.letterSpacing = spacing + "px";
    };

    window.updateStrokeWidth = function (width) {
        document.getElementById("preview-text").style.webkitTextStroke = width + "px black";
    };
});
