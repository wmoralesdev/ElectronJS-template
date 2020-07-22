const { app, BrowserWindow } = require('electron')

app.on('ready', () => {
    let win = new BrowserWindow({
        width: 400, height: 400,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('src/index.html')
})