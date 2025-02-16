document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name') || 'BrandGenix';

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

    // Add default text
    const text = new Konva.Text({
        x: 150,
        y: 150,
        text: name,
        fontSize: 50,
        fontFamily: 'Arial',
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

    document.getElementById('undoBtn').addEventListener('click', function () {
        undo();
    });

    document.getElementById('redoBtn').addEventListener('click', function () {
        redo();
    });

    saveHistory(); // initial save

    document.getElementById('opacityBtn').addEventListener('click', function () {
        const selected = stage.find('.selected')[0];
        if (selected) {
            selected.opacity(selected.opacity() === 1 ? 0.5 : 1);
            layer.draw();
            saveHistory();
        }
    });

    document.getElementById('flipBtn').addEventListener('click', function () {
        const selected = stage.find('.selected')[0];
        if (selected) {
            selected.scaleX(selected.scaleX() * -1);
            layer.draw();
            saveHistory();
        }
    });

    document.getElementById('duplicateBtn').addEventListener('click', function () {
        const selected = stage.find('.selected')[0];
        if (selected) {
            const clone = selected.clone();
            clone.x(clone.x() + 20);
            clone.y(clone.y() + 20);
            layer.add(clone);
            layer.draw();
            saveHistory();
        }
    });

    // Populate font selector
    const localFonts = [
        'Arial', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Georgia', 'Times New Roman', 'Courier New', 'Impact', 'Comic Sans MS',
        'Lucida Console', 'Garamond', 'Palatino Linotype', 'Book Antiqua', 'Century Gothic', 'Franklin Gothic Medium',
        'Rockwell', 'Copperplate Gothic Light', 'Brush Script MT', 'Calibri', 'Candara', 'Cambria', 'Consolas', 'Monaco',
        'Geneva', 'MS Sans Serif', 'MS Serif', 'Symbol', 'Webdings', 'Wingdings', 'Lucida Sans', 'Lucida Sans Unicode',
        'Segoe UI', 'Segoe Print', 'Segoe Script', 'Baskerville', 'Big Caslon', 'Charcoal', 'Futura', 'Optima', 'Hoefler Text',
        'Papyrus', 'Didot', 'Copperplate', 'Marker Felt', 'Noteworthy', 'American Typewriter', 'Brushstroke', 'Snell Roundhand',
        'Chalkboard SE', 'Zapfino'
    ];

    function populateFontSelector() {
        const fontSelector = document.getElementById('fontSelector');
        localFonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            fontSelector.appendChild(option);
        });
    }

    function applyFont(font) {
        text.fontFamily(font);
        layer.draw();
        saveHistory();
    }

    document.getElementById('fontSelector').addEventListener('change', function () {
        applyFont(this.value);
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

    populateFontSelector(); // Load fonts
});
