document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const fontFamily = urlParams.get('font');

    if (!name || !fontFamily) {
        alert("No name or font selected. Redirecting to results page.");
        window.location.href = "results.html";
        return;
    }

    const stage = new Konva.Stage({
        container: 'canvas', // HTML element id
        width: window.innerWidth,
        height: window.innerHeight - 8 * 16, // Subtract header and footer height (8rem)
    });

    const layer = new Konva.Layer();
    const gridLayer = new Konva.Layer();
    const backgroundLayer = new Konva.Layer();
    stage.add(backgroundLayer);
    stage.add(gridLayer);
    stage.add(layer);

    const gridSize = 20;
    function drawGrid() {
        gridLayer.destroyChildren();
        const width = stage.width();
        const height = stage.height();
        for (let i = 0; i < width / gridSize; i++) {
            gridLayer.add(new Konva.Line({
                points: [i * gridSize, 0, i * gridSize, height],
                stroke: '#ccc',
                strokeWidth: 0.5,
            }));
            gridLayer.add(new Konva.Line({
                points: [0, i * gridSize, width, i * gridSize],
                stroke: '#ccc',
                strokeWidth: 0.5,
            }));
        }
        gridLayer.draw();
    }
    drawGrid();

    if (fontFamily) {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    const text = new Konva.Text({
        x: stage.width() / 2,
        y: stage.height() / 2,
        text: name,
        fontSize: 50,
        fontFamily: fontFamily,
        fill: '#000',
        draggable: true,
    });
    layer.add(text);
    layer.draw();

    const backgroundRect = new Konva.Rect({
        x: 0,
        y: 0,
        width: stage.width(),
        height: stage.height(),
        fill: '#ffffff',
    });
    backgroundLayer.add(backgroundRect);
    backgroundLayer.draw();

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

    saveHistory();

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

        if (fontFamily) {
            document.getElementById('fontSelector').value = fontFamily;
            applyFont(fontFamily);
        }
    }

    function applyFont(font) {
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

    document.getElementById('applyFontBtn').addEventListener('click', function () {
        const selectedFont = document.getElementById('fontSelector').value;
        applyFont(selectedFont);
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
        backgroundRect.fill(this.value);
        backgroundLayer.draw();
        saveHistory();
    });

    document.getElementById('fontSizeInput').addEventListener('input', function () {
        text.fontSize(this.value);
        layer.draw();
        saveHistory();
    });

    document.getElementById('lineHeightInput').addEventListener('input', function () {
        text.lineHeight(this.value);
        layer.draw();
        saveHistory();
    });

    document.getElementById('rotationInput').addEventListener('input', function () {
        text.rotation(this.value);
        layer.draw();
        saveHistory();
    });

    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function () {
            const tab = this.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(`${tab}Tab`).classList.remove('hidden');
        });
    });

    loadGoogleFonts();

    function resizeCanvas() {
        stage.width(window.innerWidth);
        stage.height(window.innerHeight - 8 * 16); 
        backgroundRect.width(stage.width());
        backgroundRect.height(stage.height());
        layer.draw();
        drawGrid();
    }

    window.addEventListener('resize', resizeCanvas);

    document.getElementById('downloadBtn').addEventListener('click', function () {
        const scaleFactor = 2;
        gridLayer.hide();
        stage.toDataURL({
            width: stage.width() * scaleFactor,
            height: stage.height() * scaleFactor,
            pixelRatio: scaleFactor,
            callback: function(dataURL) {
                const link = document.createElement('a');
                link.href = dataURL;
                link.download = 'brandgenix-design.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                gridLayer.show();
            }
        });
    });

    document.getElementById('downloadWebpBtn').addEventListener('click', function () {
        const scaleFactor = 2;
        gridLayer.hide();
        stage.toDataURL({
            mimeType: 'image/webp',
            width: stage.width() * scaleFactor,
            height: stage.height() * scaleFactor,
            pixelRatio: scaleFactor,
            callback: function(dataURL) {
                const link = document.createElement('a');
                link.href = dataURL;
                link.download = 'brandgenix-design.webp';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                gridLayer.show();
            }
        });
    });

    document.getElementById('saveProgressBtn').addEventListener('click', function () {
        const json = stage.toJSON();
        localStorage.setItem('canvasState', json);
        alert('Progress saved!');
    });

    window.addEventListener('load', function () {
        const json = localStorage.getItem('canvasState');
        if (json) {
            stage.destroyChildren();
            Konva.Node.create(JSON.parse(json), stage);
        }
    });
});
