document.addEventListener("DOMContentLoaded", function () {
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
    
    // Metin rengi değiştirici
    document.getElementById("textColorPicker").addEventListener("input", function () {
        text.set("fill", this.value);
        canvas.renderAll();
    });
    
    // Font değiştirici
    document.getElementById("fontSelector").addEventListener("change", function () {
        text.set("fontFamily", this.value);
        canvas.renderAll();
    });
    
    // Kalınlık toggler
    document.getElementById("boldToggle").addEventListener("click", function () {
        text.set("fontWeight", text.fontWeight === "bold" ? "normal" : "bold");
        canvas.renderAll();
    });
    
    // Gölge toggler
    document.getElementById("shadowToggle").addEventListener("click", function () {
        text.set("shadow", text.shadow ? null : "2px 2px 4px rgba(0, 0, 0, 0.5)");
        canvas.renderAll();
    });
    
    // Arka plan rengi değiştirici
    document.getElementById("bgColorPicker").addEventListener("input", function () {
        canvas.setBackgroundColor(this.value, canvas.renderAll.bind(canvas));
    });
    
    // İkon ekleyici
    window.addIcon = function(icon) {
        const iconText = new fabric.Text(icon, {
            left: text.left - 50,
            top: text.top,
            fontSize: 50
        });
        canvas.add(iconText);
        canvas.renderAll();
    };
    
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
});
