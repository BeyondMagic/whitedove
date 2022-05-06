const { app, BrowserWindow } = require('electron')

// 1. How we'll manage the window.
const createWindow = () => {

  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('./layout/index.html')

}

// 2. Initializng the window.
app.whenReady().then( () => {

  createWindow()

})
