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
    }

    document.getElementById('fontSelector').addEventListener('change', function () {
        applyFont(this.value);
    });

    document.getElementById('textColorPicker').addEventListener('input', function () {
        text.fill(this.value);
        layer.draw();
    });

    document.getElementById('boldToggle').addEventListener('click', function () {
        text.fontStyle(text.fontStyle() === 'bold' ? 'normal' : 'bold');
        layer.draw();
    });

    document.getElementById('shadowToggle').addEventListener('click', function () {
        text.shadowColor(text.shadowColor() ? '' : 'black');
        text.shadowBlur(text.shadowBlur() ? 0 : 10);
        layer.draw();
    });

    document.getElementById('bgColorPicker').addEventListener('input', function () {
        layer.getStage().container().style.backgroundColor = this.value;
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
    };

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
            const obj = JSON.parse(json);
            stage.destroyChildren();
            Konva.Node.create(obj, stage);
        }
    });

    // Toolbar buttons
    document.getElementById('undoBtn').addEventListener('click', function () {
        // Implement undo functionality
    });

    document.getElementById('redoBtn').addEventListener('click', function () {
        // Implement redo functionality
    });

    document.getElementById('deleteBtn').addEventListener('click', function () {
        const selected = stage.findOne('.selected');
        if (selected) {
            selected.destroy();
            layer.draw();
        }
    });

    document.getElementById('opacityBtn').addEventListener('click', function () {
        const selected = stage.findOne('.selected');
        if (selected) {
            selected.opacity(selected.opacity() === 1 ? 0.5 : 1);
            layer.draw();
        }
    });

    document.getElementById('flipBtn').addEventListener('click', function () {
        const selected = stage.findOne('.selected');
        if (selected) {
            selected.scaleX(selected.scaleX() * -1);
            layer.draw();
        }
    });

    document.getElementById('duplicateBtn').addEventListener('click', function () {
        const selected = stage.findOne('.selected');
        if (selected) {
            const clone = selected.clone();
            clone.x(clone.x() + 20);
            clone.y(clone.y() + 20);
            layer.add(clone);
            layer.draw();
        }
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
