const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron')
const fs = require('fs')

let win = [],
    jsonSave = [],
    tray, trayMenu, defaultX = 0,
    defaultY = 0

trayMenu = Menu.buildFromTemplate([
    { label: 'Salir', click: app.quit },
    { label: 'Guardar y salir', click: onAppExitSaveHandler }
])

function createTray() {
    tray = new Tray('src/img/trayTemplate.png')
    tray.setContextMenu(trayMenu)
}

function createWindow() {
    var { screen } = require('electron')

    if (win.length == 0) {
        defaultX = screen.getPrimaryDisplay().bounds.width - 300
        console.log(defaultX);
    }

    if (defaultX < 0) {
        defaultX = screen.getPrimaryDisplay().bounds.width - 300
        defaultY += 500
    }

    let lastWindow = new BrowserWindow({
        width: 300,
        height: 500,
        x: defaultX,
        y: defaultY,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    })

    defaultX -= 300

    lastWindow.once('close', () => {
        win.splice(win.indexOf(lastWindow), 1)
    })

    lastWindow.loadFile('src/index.html')

    win.push(lastWindow)
}

async function fileSave() {
    var path = app.getPath('userData')

    if (process.platform == 'win32')
        path += '\\config.json'
    else
        path += '/config.json'

    console.log(path);

    fs.writeFile(path, JSON.stringify(jsonSave), err => {
        if (err)
            new Notification('Error', {
                body: 'Algo salio mal',
                icon: 'src/img/trayTemplate.png'
            })
        else {
            app.quit()
        }
    })
}

function onAppExitSaveHandler() {
    win.forEach(w => {
        w.webContents.send('saveRequested')
    })
}

ipcMain.on('saveResponse', (e, args) => {
    if (!jsonSave.includes(args))
        jsonSave.push(args)

    if (jsonSave.length == BrowserWindow.getAllWindows().length)
        fileSave()
})

ipcMain.on('new-note', (e, args) => {
    createWindow()
    e.sender.send('created-window', 'Window created')
})

app.on('ready', () => {
    createTray()
    createWindow()
})