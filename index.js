const { app, BrowserWindow, ipcMain } = require('electron')

let win = []

function createWindow() {
    let lastWindow = new BrowserWindow({
        width: 300,
        height: 500,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    })

    lastWindow.loadFile('src/index.html')

    win.push(lastWindow)
}

ipcMain.on('new-note', (e, args) => {
    createWindow()
    e.sender.send('created-window', 'Window created')
})

app.on('ready', createWindow)