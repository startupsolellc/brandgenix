document.addEventListener("DOMContentLoaded", function () {
    const canvas = new fabric.Canvas("canvas");
    
    // Varsayılan metin
    const text = new fabric.Text("BrandGenix", {
        left: 150,
        top: 150,
        fontSize: 50,
        fontFamily: "Arial",
        fill: "#000000",
        selectable: true
    });
    canvas.add(text);

    // Lokal olarak kullanılacak 50 font
    const localFonts = [
        "Arial", "Verdana", "Tahoma", "Trebuchet MS", "Georgia", "Times New Roman", "Courier New", "Impact", "Comic Sans MS",
        "Lucida Console", "Garamond", "Palatino Linotype", "Book Antiqua", "Century Gothic", "Franklin Gothic Medium",
        "Rockwell", "Copperplate Gothic Light", "Brush Script MT", "Calibri", "Candara", "Cambria", "Consolas", "Monaco",
        "Geneva", "MS Sans Serif", "MS Serif", "Symbol", "Webdings", "Wingdings", "Lucida Sans", "Lucida Sans Unicode",
        "Segoe UI", "Segoe Print", "Segoe Script", "Baskerville", "Big Caslon", "Charcoal", "Futura", "Optima", "Hoefler Text",
        "Papyrus", "Didot", "Copperplate", "Marker Felt", "Noteworthy", "American Typewriter", "Brushstroke", "Snell Roundhand",
        "Chalkboard SE", "Zapfino"
    ];

    // Fontları dropdown'a yükleme
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
    
    // İkon ekleme fonksiyonu (sürüklenebilir ikonlar)
    window.addIcon = function(iconText) {
        const icon = new fabric.Text(iconText, {
            left: 100,
            top: 100,
            fontSize: 50,
            fontFamily: "Arial",
            fill: "#000000",
            selectable: true,
            evented: true
        });
        canvas.add(icon);
        canvas.setActiveObject(icon);
        canvas.renderAll();
    };

    // Tüm objelerin seçilebilir ve sürüklenebilir olmasını sağla
    canvas.on('object:selected', function (e) {
        e.target.set({
            selectable: true,
            evented: true
        });
        canvas.renderAll();
    });

    // PNG İndirme
    document.getElementById("downloadBtn").addEventListener("click", function () {
        const dataURL = canvas.toDataURL({ format: "png" });
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "brandgenix-design.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    populateFontSelector(); // Fontları yükle
});
