const imgInput = document.querySelector("#imgInput");
const visualizador = document.querySelector("#showImg");
const dropZone = document.querySelector("#dropZone"); // Área de arraste

function resizeImage(file, maxWidth, maxHeight, quality, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function() {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');

            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            callback(canvas.toDataURL('image/jpeg', quality));
        };
    };
}

function handleImage(file) {
    if (file && file.type.includes('image')) {
        resizeImage(file, 800, 800, 0.8, (base64) => {
            visualizador.src = base64;
            document.querySelector("#result").value = base64;
            document.querySelector("#dropZoneBox").style.display = "none"
            document.querySelector("#resultadoArea").style.display = "block"
        });
    } else {
        alert("Arquivo inválido, escolha, cole ou arraste uma imagem");
    }
}

// Upload via input
imgInput.addEventListener('change', () => {
    handleImage(imgInput.files[0]);
});

// Upload via Ctrl+V
document.addEventListener('paste', (event) => {
    const items = event.clipboardData.items;
    for (let item of items) {
        if (item.type.indexOf("image") !== -1) {
            const file = item.getAsFile();
            handleImage(file);
        }
    }
});

// Upload via arrastar e soltar
dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add("hover");
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove("hover");
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove("hover");

    if (event.dataTransfer.files.length > 0) {
        handleImage(event.dataTransfer.files[0]);
    }
});

function copy() {
    let texto = document.querySelector("#result");
    texto.select();
    texto.setSelectionRange(0, 999999);
    navigator.clipboard.writeText(texto.value)
        .then(() => alert("Texto copiado"));
}
