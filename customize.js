document.addEventListener("DOMContentLoaded", function () {
    const stage = new Konva.Stage({
        container: 'container',
        width: 600,
        height: 400
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // URL'den parametre okuma fonksiyonu
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // URL'den gelen isim
    const nameFromUrl = getUrlParameter('name') || 'BrandGenix';

    // Varsayılan metin
    const text = new Konva.Text({
        x: 150,
        y: 150,
        text: nameFromUrl,
        fontSize: 50,
        fontFamily: 'Arial',
        fill: '#000000',
        draggable: true
    });
    layer.add(text);

    // Lokal olarak kullanılacak 50 font
    const localFonts = [
        'Arial', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Georgia', 'Times New Roman', 'Courier New', 'Impact', 'Comic Sans MS',
        'Lucida Console', 'Garamond', 'Palatino Linotype', 'Book Antiqua', 'Century Gothic', 'Franklin Gothic Medium',
        'Rockwell', 'Copperplate Gothic Light', 'Brush Script MT', 'Calibri', 'Candara', 'Cambria', 'Consolas', 'Monaco',
        'Geneva', 'MS Sans Serif', 'MS Serif', 'Symbol', 'Webdings', 'Wingdings', 'Lucida Sans', 'Lucida Sans Unicode',
        'Segoe UI', 'Segoe Print', 'Segoe Script', 'Baskerville', 'Big Caslon', 'Charcoal', 'Futura', 'Optima', 'Hoefler Text',
        'Papyrus', 'Didot', 'Copperplate', 'Marker Felt', 'Noteworthy', 'American Typewriter', 'Brushstroke', 'Snell Roundhand',
        'Chalkboard SE', 'Zapfino'
    ];

    // Fontları dropdown'a yükleme
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
        if (text.shadowEnabled()) {
            text.shadowEnabled(false);
        } else {
            text.shadowColor('black');
            text.shadowBlur(10);
            text.shadowOffset({ x: 5, y: 5 });
            text.shadowOpacity(0.6);
            text.shadowEnabled(true);
        }
        layer.draw();
    });

    document.getElementById('bgColorPicker').addEventListener('input', function () {
        stage.container().style.backgroundColor = this.value;
    });

    // İkon ekleme fonksiyonu (sürüklenebilir ikonlar)
    window.addIcon = function(iconText) {
        const icon = new Konva.Text({
            x: 100,
            y: 100,
            text: iconText,
            fontSize: 50,
            fontFamily: 'Material Symbols Outlined',
            fill: '#000000',
            draggable: true
        });
        layer.add(icon);
        layer.draw();
    };

    // PNG İndirme
    document.getElementById('downloadBtn').addEventListener('click', function () {
        const dataURL = stage.toDataURL();
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'brandgenix-design.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // SVG İndirme
    document.getElementById('downloadSvgBtn').addEventListener('click', function () {
        const dataURL = stage.toDataURL({ mimeType: 'image/svg+xml' });
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'brandgenix-design.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // İkonları dinamik olarak ekleme
    const allIcons = [
        'home', 'star', 'favorite', 'settings', 'face', 'build', 'check_circle', 'delete', 'add_circle', 'camera_alt',
        'alarm', 'archive', 'autorenew', 'battery_full', 'block', 'bluetooth', 'book', 'bookmark', 'calendar_today', 'call',
        'chat', 'cloud', 'code', 'credit_card', 'dashboard', 'directions', 'done', 'download', 'email', 'event',
        'exit_to_app', 'explore', 'extension', 'favorite_border', 'file_copy', 'filter_list', 'fingerprint', 'flag', 'flight',
        'folder', 'forum', 'gps_fixed', 'grade', 'group', 'help', 'highlight', 'history', 'home_work', 'hourglass_empty'
    ];

    const initialIcons = allIcons.slice(0, 12);
    const iconContainer = document.getElementById('iconList');

    function populateIcons(icons) {
        iconContainer.innerHTML = '';
        icons.forEach(iconName => {
            const button = document.createElement('button');
            button.classList.add('icon-button', 'p-2', 'border', 'rounded', 'bg-gray-200', 'hover:bg-gray-300');
            button.innerHTML = `<span class="material-symbols-outlined">${iconName}</span>`;
            button.addEventListener('click', function () {
                addIcon(iconName);
            });
            iconContainer.appendChild(button);
        });
    }

    document.getElementById('moreIconsBtn').addEventListener('click', function () {
        populateIcons(allIcons);
        this.style.display = 'none';
    });

    populateIcons(initialIcons);
    populateFontSelector();
    layer.draw();
});
