import { app, BrowserWindow } from 'electron'

// 1. How we'll manage the window.
const createWindow = () => {

  const win = new BrowserWindow({
    width:  800,
    height: 600,
    webPreferences: {
      preload: __dirname + '/system/preload.js'
    },
  })

  win.loadFile(__dirname + '/index.html')


}

// 2. Initializng the window.
app.whenReady().then( () => {

  createWindow()

})
