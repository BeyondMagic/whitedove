import { app, globalShortcut, BrowserWindow } from 'electron'

// 1. How we'll manage the window.
const createWindow = () => {

  const win = new BrowserWindow({
    width:  800,
    height: 600,
    webPreferences: {
      preload: __dirname + '/system/preload.js',
    },
    show: false,
    frame: false
  })

  win.loadFile(__dirname + '/index.html')

  win.on( 'ready-to-show', win.show )

}

// 2. Initializng the window.
app.whenReady().then( () => {

  createWindow()

})

// To disable the CTRL + Q and CTRL + W shortcuts.
const shortcuts = ['CommandOrControl+W', 'CommandOrControl+Q']

app.on( 'browser-window-blur', () => {

  shortcuts.forEach( item => globalShortcut.unregister( item ) )

})

app.on( 'browser-window-focus' , () => {

  shortcuts.forEach( item => globalShortcut.register( item, () => true ) )

})
