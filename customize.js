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
            attachColorPickers(); // Ensure event listeners are re-attached
        });
    });

    function getTabContent(tabName) {
        switch (tabName) {
            case "Text":
                return `<div>
                    <label class='block text-gray-700'>Change Text Color:</label>
                    <input type='color' id='textColorPicker' class='mt-2 border p-2 rounded w-full' value='#000000'>
                    <label class='block text-gray-700 mt-4'>Text Effects:</label>
                    <div class='mt-2'>
                        <input type='checkbox' id='boldToggle'> Bold
                        <input type='checkbox' id='shadowToggle'> Shadow
                    </div>
                    <label class='block text-gray-700 mt-4'>Letter Spacing:</label>
                    <input type='range' id='letterSpacingSlider' class='mt-2 w-full' min='0' max='10' value='0'>
                    <label class='block text-gray-700 mt-4'>Stroke Width:</label>
                    <input type='range' id='strokeWidthSlider' class='mt-2 w-full' min='0' max='5' value='0'>
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
                    <input type='color' id='iconColorPicker' class='mt-2 border p-2 rounded w-full' value='#000000'>
                    <label class='block text-gray-700 mt-4'>Change Icon Size:</label>
                    <input type='range' id='iconSizeSlider' class='mt-2 w-full' min='16' max='100' value='40'>
                </div>`;
            case "Background":
                return `<div>
                    <label class='block text-gray-700'>Change Background Color:</label>
                    <input type='color' id='bgColorPicker' class='mt-2 border p-2 rounded w-full' value='#ffffff'>
                </div>`;
            default:
                return `<p class='text-gray-500'>Select an option to customize.</p>`;
        }
    }

    function attachColorPickers() {
        document.getElementById("textColorPicker")?.addEventListener("input", function () {
            updateTextColor(this.value);
        });
        document.getElementById("bgColorPicker")?.addEventListener("input", function () {
            updateBgColor(this.value);
        });
        document.getElementById("iconColorPicker")?.addEventListener("input", function () {
            updateIconColor(this.value);
        });
    }

    window.updateTextColor = function (color) {
        document.getElementById("preview-text").style.color = color;
    };

    window.updateBgColor = function (color) {
        document.getElementById("logo-preview").style.backgroundColor = color;
    };

    window.updateIconColor = function (color) {
        let iconElement = document.getElementById("preview-icon");
        if (iconElement) {
            iconElement.style.color = color;
        }
    };

    attachColorPickers();
});
