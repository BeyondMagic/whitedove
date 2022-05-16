import { app, BrowserWindow } from 'electron'

// 1. How we'll manage the window.
const createWindow = () => {

  const win = new BrowserWindow({
    width:  800,
    height: 600,
    webPreferences: {
      preload: __dirname + '/system/preload.js',
    },
    autoHideMenuBar: true,
    show: false,
  })

  win.loadFile(__dirname + '/index.html')

  win.on( 'ready-to-show', win.show )


}

// 2. Initializng the window.
app.whenReady().then( () => {

  createWindow()

})
