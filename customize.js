document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const fontFamily = urlParams.get('font');

    if (!name || !fontFamily) {
        alert("No name or font selected. Redirecting to results page.");
        window.location.href = "results.html";
        return;
    }

    const width = 800;
    const height = 600;
    const stage = new Konva.Stage({
        container: 'canvas', // HTML element id
        width: width,
        height: height,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // Draw grid
    const gridSize = 20;
    for (let i = 0; i < width / gridSize; i++) {
        layer.add(new Konva.Line({
            points: [i * gridSize, 0, i * gridSize, height],
            stroke: '#ccc',
            strokeWidth: 0.5,
        }));
        layer.add(new Konva.Line({
            points: [0, i * gridSize, width, i * gridSize],
            stroke: '#ccc',
            strokeWidth: 0.5,
        }));
    }

    // Load selected font from URL parameters
    if (fontFamily) {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    // Add selected text
    const text = new Konva.Text({
        x: 150,
        y: 150,
        text: name,
        fontSize: 50,
        fontFamily: fontFamily,
        fill: '#000',
        draggable: true,
    });
    layer.add(text);
    layer.draw();

    // Track history for undo and redo
    let history = [];
    let historyStep = -1;

    function saveHistory() {
        history = history.slice(0, historyStep + 1);
        history.push(stage.toJSON());
        historyStep++;
    }

    function undo() {
        if (historyStep > 0) {
            historyStep--;
            stage.destroyChildren();
            Konva.Node.create(JSON.parse(history[historyStep]), stage);
        }
    }

    function redo() {
        if (historyStep < history.length - 1) {
            historyStep++;
            stage.destroyChildren();
            Konva.Node.create(JSON.parse(history[historyStep]), stage);
        }
    }

    // Removed event listeners for Undo, Redo, Opacity, Flip, Duplicate

    saveHistory(); // initial save

    // Removed opacity button event listener

    // Removed flip button event listener

    // Removed duplicate button event listener

    // Populate font selector with Google Fonts
    async function loadGoogleFonts() {
        const response = await fetch('/.netlify/functions/get-fonts');
        const data = await response.json();
        const fonts = data.fonts;

        const fontSelector = document.getElementById('fontSelector');
        fonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            fontSelector.appendChild(option);
        });

        // Load selected font from URL parameters
        if (fontFamily) {
            document.getElementById('fontSelector').value = fontFamily;
            applyFont(fontFamily);
        }
    }

    function applyFont(font) {
        // Remove existing font link if any
        const existingLink = document.querySelector('link[rel="stylesheet"][href*="fonts.googleapis.com"]');
        if (existingLink) {
            document.head.removeChild(existingLink);
        }

        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        link.onload = () => {
            text.fontFamily(font);
            layer.batchDraw();
            saveHistory();
        };
    }

    document.getElementById('fontSelector').addEventListener('change', function () {
        const selectedFont = this.value;
        document.getElementById('applyFontBtn').onclick = function () {
            applyFont(selectedFont);
        };
    });

    document.getElementById('textColorPicker').addEventListener('input', function () {
        text.fill(this.value);
        layer.draw();
        saveHistory();
    });

    document.getElementById('boldToggle').addEventListener('click', function () {
        text.fontStyle(text.fontStyle() === 'bold' ? 'normal' : 'bold');
        layer.draw();
        saveHistory();
    });

    document.getElementById('shadowToggle').addEventListener('click', function () {
        text.shadowColor(text.shadowColor() ? '' : 'black');
        text.shadowBlur(text.shadowBlur() ? 0 : 10);
        layer.draw();
        saveHistory();
    });

    document.getElementById('bgColorPicker').addEventListener('input', function () {
        layer.getStage().container().style.backgroundColor = this.value;
        saveHistory();
    });

    // Add icon function
    window.addIcon = function (iconText) {
        const icon = new Konva.Text({
            x: 100,
            y: 100,
            text: iconText,
            fontSize: 50,
            fontFamily: 'Material Symbols Outlined',
            fill: '#000',
            draggable: true,
        });
        layer.add(icon);
        layer.draw();
        saveHistory();
    };

    // Load Google Material Icons
    function loadMaterialIcons() {
        const iconList = document.getElementById('iconList');
        iconList.innerHTML = ''; // Clear existing icons

        const materialIcons = [
            'home', 'star', 'favorite', 'search', 'settings', 'info', 'warning', 'help', 'check', 'close'
            // Add more icons as needed
        ];

        materialIcons.forEach(icon => {
            const iconElement = document.createElement('span');
            iconElement.className = 'material-symbols-outlined cursor-pointer';
            iconElement.textContent = icon;
            iconElement.addEventListener('click', function () {
                window.addIcon(icon);
            });
            iconList.appendChild(iconElement);
        });
    }

    document.getElementById('moreIconsBtn').addEventListener('click', function () {
        loadMaterialIcons();
    });

    // PNG Download
    document.getElementById('downloadBtn').addEventListener('click', function () {
        const dataURL = stage.toDataURL();
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'brandgenix-design.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // SVG Download
    document.getElementById('downloadSvgBtn').addEventListener('click', function () {
        const dataURL = stage.toDataURL({ mimeType: 'image/svg+xml' });
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'brandgenix-design.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Save Progress
    document.getElementById('saveProgressBtn').addEventListener('click', function () {
        const json = stage.toJSON();
        localStorage.setItem('canvasState', json);
        alert('Progress saved!');
    });

    // Load Progress
    window.addEventListener('load', function () {
        const json = localStorage.getItem('canvasState');
        if (json) {
            stage.destroyChildren();
            Konva.Node.create(JSON.parse(json), stage);
        }
    });

    // Filters
    document.getElementById('applyGrayscale').addEventListener('click', function () {
        text.filters([Konva.Filters.Grayscale]);
        text.cache();
        layer.draw();
        saveHistory();
    });

    document.getElementById('applySepia').addEventListener('click', function () {
        text.filters([Konva.Filters.Sepia]);
        text.cache();
        layer.draw();
        saveHistory();
    });

    document.getElementById('applyInvert').addEventListener('click', function () {
        text.filters([Konva.Filters.Invert]);
        text.cache();
        layer.draw();
        saveHistory();
    });

    // Tab functionality
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function () {
            const tab = this.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(`${tab}Tab`).classList.remove('hidden');
        });
    });

    loadGoogleFonts(); // Load Google Fonts
});
