const {hideWindow} = require('../../utils')
module.exports = {
  createEvaWindow: () => {
    // Create the browser window.
    const {electron: {BrowserWindow}} = global
    const x = (electron.screen.getPrimaryDisplay().workAreaSize.width / 2 - 250).toFixed(0)
    const y = 90

    const mainWindow = new BrowserWindow({show: false})
    const evaWindow = new BrowserWindow({
      alwaysOnTop: true,
      x: +x,
      y: +y,
      width: 500,
      height: 76,
      frame: false,
      skipTaskbar: true,
      resizable: false,
      movable: false,
      parent: mainWindow
    })

    // mainWindow.setAlwaysOnTop(true, 'screen-saver')
    // 全屏代码
    if (process.platform === 'darwin') electron.app.dock.hide()
    evaWindow.setAlwaysOnTop(true, "floating")
    evaWindow.setVisibleOnAllWorkspaces(true)
    evaWindow.setFullScreenable(false)

    // and load the index.html of the app.
    evaWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'views/main.html'),
      protocol: 'file:',
      slashes: true
    }))

    evaWindow.on('blur', () => hideWindow(evaWindow))
    return evaWindow
  }
}
