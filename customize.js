document.addEventListener("DOMContentLoaded", async function () {
    const canvas = new fabric.Canvas("canvas");
    
    // Varsayılan metin
    const text = new fabric.Text("BrandGenix", {
        left: 150,
        top: 150,
        fontSize: 50,
        fontFamily: "Arial",
        fill: "#000000"
    });
    canvas.add(text);
    
    const netlifyFontsApiUrl = "/.netlify/functions/get-fonts";

    // Netlify Functions üzerinden rastgele font çekme
    async function getFonts() {
        try {
            const response = await fetch(netlifyFontsApiUrl);
            const data = await response.json();

            if (data.fonts && data.fonts.length > 0) {
                return data.fonts;
            }
        } catch (error) {
            console.error("Netlify Fonts API request failed:", error);
        }
        return ["Arial"]; // Hata olursa varsayılan font
    }

    // Google Fonts'ı yükleme ve Fabric.js'e entegre etme
    async function applyFont(font) {
        const fontUrl = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}&display=swap`;
        const link = document.createElement("link");
        link.href = fontUrl;
        link.rel = "stylesheet";
        document.head.appendChild(link);

        text.set("fontFamily", font);
        canvas.renderAll();
    }

    // Fontları dropdown'a yükleme
    async function populateFontSelector() {
        const fonts = await getFonts();
        const fontSelector = document.getElementById("fontSelector");
        fonts.forEach(font => {
            const option = document.createElement("option");
            option.value = font;
            option.textContent = font;
            fontSelector.appendChild(option);
        });
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
    
    // İkon ekleme fonksiyonu (Material Symbols desteği)
    window.addIcon = function(iconName) {
        const icon = new fabric.Text(iconName, {
            fontFamily: "Material Symbols Outlined",
            fontSize: 60,
            left: 100,
            top: 100,
            fill: "#000000",
            selectable: true // Sürükleme ve düzenleme için aktif
        });
        canvas.add(icon);
        canvas.renderAll();
    };

    // İkon rengi değiştirme
    document.getElementById("iconColorPicker").addEventListener("input", function () {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === "text") {
            activeObject.set("fill", this.value);
            canvas.renderAll();
        }
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

    await populateFontSelector(); // Fontları yükle
});
