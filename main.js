const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        transparent: false,
        frame: true,
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // Enable window dragging
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.insertCSS(`
            .draggable {
                -webkit-app-region: drag;
            }
            #window-controls {
                -webkit-app-region: no-drag;
            }
        `);
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

let transparencyLevel = 1.0;

ipcMain.on('set-transparency', (event, level) => {
    transparencyLevel = level;
    mainWindow.setOpacity(transparencyLevel);
});

ipcMain.on('window-control', (event, control) => {
    if (control === 'minimize') {
        mainWindow.minimize();
    } else if (control === 'close') {
        app.quit();
    }
});

