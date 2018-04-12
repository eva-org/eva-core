const {
  hideWindow
} = require('../../utils')
module.exports = {
  createMainWindow: () => {
    // Create the browser window.
    const {
      electron: {
        BrowserWindow
      }
    } = global
    const x = (electron.screen.getPrimaryDisplay().workAreaSize.width / 2 - 250).toFixed(0)
    const y = 90

    let mainWindow = new BrowserWindow({
      alwaysOnTop: true,
      x: +x,
      y: +y,
      width: 500,
      height: 76,
      frame: false,
      skipTaskbar: true
    })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'views/main.html'),
      protocol: 'file:',
      slashes: true
    }))

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      // mainWindow = null
    })

    mainWindow.on('blur', function() {
      hideWindow(mainWindow)
    })
    return mainWindow
  }
}
