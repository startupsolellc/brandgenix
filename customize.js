document.addEventListener("DOMContentLoaded", function () {
    const canvas = new fabric.Canvas("canvas");
    
    // Draw grid
    const gridSize = 20;
    for (let i = 0; i < (canvas.width / gridSize); i++) {
        canvas.add(new fabric.Line([i * gridSize, 0, i * gridSize, canvas.height], { stroke: '#ccc', selectable: false }));
        canvas.add(new fabric.Line([0, i * gridSize, canvas.width, i * gridSize], { stroke: '#ccc', selectable: false }));
    }

    // Adding default text
    const text = new fabric.Text("BrandGenix", {
        left: 150,
        top: 150,
        fontSize: 50,
        fontFamily: "Arial",
        fill: "#000000",
        selectable: true
    });
    canvas.add(text);

    // Local fonts
    const localFonts = [
        "Arial", "Verdana", "Tahoma", "Trebuchet MS", "Georgia", "Times New Roman", "Courier New", "Impact", "Comic Sans MS",
        "Lucida Console", "Garamond", "Palatino Linotype", "Book Antiqua", "Century Gothic", "Franklin Gothic Medium",
        "Rockwell", "Copperplate Gothic Light", "Brush Script MT", "Calibri", "Candara", "Cambria", "Consolas", "Monaco",
        "Geneva", "MS Sans Serif", "MS Serif", "Symbol", "Webdings", "Wingdings", "Lucida Sans", "Lucida Sans Unicode",
        "Segoe UI", "Segoe Print", "Segoe Script", "Baskerville", "Big Caslon", "Charcoal", "Futura", "Optima", "Hoefler Text",
        "Papyrus", "Didot", "Copperplate", "Marker Felt", "Noteworthy", "American Typewriter", "Brushstroke", "Snell Roundhand",
        "Chalkboard SE", "Zapfino"
    ];

    // Populate font selector
    function populateFontSelector() {
        const fontSelector = document.getElementById("fontSelector");
        localFonts.forEach(font => {
            const option = document.createElement("option");
            option.value = font;
            option.textContent = font;
            fontSelector.appendChild(option);
        });
    }

    function applyFont(font) {
        text.set("fontFamily", font);
        canvas.renderAll();
    }

    document.getElementById("fontSelector").addEventListener("change", function () {
        applyFont(this.value);
    });

    document.getElementById("textColorPicker").addEventListener("input", function () {
        text.set("fill", this.value);
        canvas.renderAll();
    });

    document.getElementById("boldToggle").addEventListener("click", function () {
        text.set("fontWeight", text.fontWeight === "bold" ? "normal" : "bold");
        canvas.renderAll();
    });

    document.getElementById("shadowToggle").addEventListener("click", function () {
        text.set("shadow", text.shadow ? null : "2px 2px 4px rgba(0, 0, 0, 0.5)");
        canvas.renderAll();
    });

    document.getElementById("bgColorPicker").addEventListener("input", function () {
        canvas.setBackgroundColor(this.value, canvas.renderAll.bind(canvas));
    });

    // Add icon function
    window.addIcon = function(iconText) {
        const icon = new fabric.Text(iconText, {
            left: 100,
            top: 100,
            fontSize: 50,
            fontFamily: "Material Symbols Outlined",
            fill: "#000000",
            selectable: true,
            evented: true
        });
        canvas.add(icon);
        canvas.setActiveObject(icon);
        canvas.renderAll();
    };

    // Enable selection and dragging of all objects
    canvas.on('object:selected', function (e) {
        e.target.set({
            selectable: true,
            evented: true
        });
        canvas.renderAll();
    });

    // PNG Download
    document.getElementById("downloadBtn").addEventListener("click", function () {
        const dataURL = canvas.toDataURL({ format: "png" });
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "brandgenix-design.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // SVG Download
    document.getElementById("downloadSvgBtn").addEventListener("click", function () {
        const dataURL = canvas.toSVG();
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "brandgenix-design.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Save Progress
    document.getElementById("saveProgressBtn").addEventListener("click", function () {
        const json = JSON.stringify(canvas);
        localStorage.setItem("canvasState", json);
        alert("Progress saved!");
    });

    // Load Progress
    window.onload = function () {
        const json = localStorage.getItem("canvasState");
        if (json) {
            canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));
        }
    }

    // Toolbar buttons
    document.getElementById("undoBtn").addEventListener("click", function () {
        // Implement undo functionality
    });

    document.getElementById("redoBtn").addEventListener("click", function () {
        // Implement redo functionality
    });

    document.getElementById("deleteBtn").addEventListener("click", function () {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
        }
    });

    document.getElementById("opacityBtn").addEventListener("click", function () {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.set('opacity', activeObject.opacity === 1 ? 0.5 : 1);
            canvas.renderAll();
        }
    });

    document.getElementById("flipBtn").addEventListener("click", function () {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.set('flipX', !activeObject.flipX);
            canvas.renderAll();
        }
    });

    document.getElementById("duplicateBtn").addEventListener("click", function () {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            const clone = fabric.util.object.clone(activeObject);
            clone.set({ left: activeObject.left + 10, top: activeObject.top + 10 });
            canvas.add(clone);
            canvas.renderAll();
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
