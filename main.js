const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    // Abre las DevTools solo en modo de desarrollo
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadURL("http://localhost:3000");

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Manejar el evento 'closed'
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Evento 'ready' de la aplicación
app.whenReady().then(() => {
    // Crear la ventana cuando la aplicación esté lista
    createWindow();

    // Manejar eventos 'activate' en macOS
    app.on('activate', function () {
        if (mainWindow === null) createWindow();
    });
});

// Evento 'window-all-closed' en macOS
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Escuchar el evento 'request-mainprocess-action'
ipcMain.on("request-mainprocess-action", (event, args) => {
    console.log("Args ", args);
});

// Cerrar la aplicación cuando todas las ventanas estén cerradas
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Asegurarse de cerrar la aplicación en macOS cuando la última ventana está cerrada
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});