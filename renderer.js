
const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    let transparencyLevel = 1.0;
    let fontSize = 16;

    const increaseTransparencyBtn = document.getElementById('increaseTransparency');
    const decreaseTransparencyBtn = document.getElementById('decreaseTransparency');
    const increaseFontSizeBtn = document.getElementById('increaseFontSize');
    const decreaseFontSizeBtn = document.getElementById('decreaseFontSize');
    const minimizeBtn = document.getElementById('minimize');
    const closeBtn = document.getElementById('close');
    const contentInput = document.getElementById('contentInput');

    increaseTransparencyBtn.addEventListener('click', () => {
        transparencyLevel = Math.min(transparencyLevel + 0.1, 1.0);
        ipcRenderer.send('set-transparency', transparencyLevel);
    });

    decreaseTransparencyBtn.addEventListener('click', () => {
        transparencyLevel = Math.max(transparencyLevel - 0.1, 0.1);
        ipcRenderer.send('set-transparency', transparencyLevel);
    });

    increaseFontSizeBtn.addEventListener('click', () => {
        fontSize += 2;
        contentInput.style.fontSize = `${fontSize}px`;
    });

    decreaseFontSizeBtn.addEventListener('click', () => {
        fontSize = Math.max(fontSize - 2, 12);
        contentInput.style.fontSize = `${fontSize}px`;
    });

    minimizeBtn.addEventListener('click', () => {
        ipcRenderer.send('window-control', 'minimize');
    });

    closeBtn.addEventListener('click', () => {
        ipcRenderer.send('window-control', 'close');
    });

    contentInput.addEventListener('input', (event) => {
        ipcRenderer.send('update-content', event.target.value);
    });

    document.ondragover = document.ondrop = (event) => {
        event.preventDefault();
    };

    document.body.ondrop = (event) => {
        const filePath = event.dataTransfer.files[0].path;
        contentInput.value = filePath;
        ipcRenderer.send('update-content', filePath);
        event.preventDefault();
    };
});

