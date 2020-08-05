const { remote, ipcRenderer } = require('electron')
const { Menu } = remote

var closeButton = document.getElementById('close')
var minimizeButton = document.getElementById('minimize')
var optionsButton = document.getElementById('options')

var optionsButtonMenu = Menu.buildFromTemplate([{
    label: 'Crear nueva nota',
    click: () => {
        new Notification('Notas', {
            body: 'Se creó una nueva nota',
            icon: 'img/trayTemplate.png'
        })
        ipcRenderer.send('new-note', 'New window')
    }
}])

closeButton.onclick = e => {
    console.log('close');
    e.preventDefault()
    remote.getCurrentWindow().close()
}

minimizeButton.onclick = e => {
    console.log('minmiize');
    e.preventDefault()
    remote.getCurrentWindow().minimize()
}

optionsButton.onclick = e => {
    e.preventDefault()
    optionsButtonMenu.popup()
}

ipcRenderer.on('created-window', (e, args) => {
    console.log(args);
})