const {hideWindow} = require('../../utils')
module.exports = {
  createMainWindow: () => {
    // Create the browser window.
    const {electron: {BrowserWindow}} = global
    const x = (electron.screen.getPrimaryDisplay().workAreaSize.width / 2 - 250).toFixed(0)
    const y = 90

    const mainWindow = new BrowserWindow({
      alwaysOnTop: true,
      x: +x,
      y: +y,
      width: 500,
      height: 76,
      frame: false,
      skipTaskbar: true,
      resizable: false,
      movable: false
    })

    // 全屏代码
    // mainWindow.setAlwaysOnTop(true, 'screen-saver')
    electron.app.dock.hide();
    mainWindow.setAlwaysOnTop(true, "floating");
    mainWindow.setVisibleOnAllWorkspaces(true);
    mainWindow.setFullScreenable(false);

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'views/main.html'),
      protocol: 'file:',
      slashes: true
    }))

    mainWindow.on('blur', () => hideWindow(mainWindow))
    return mainWindow
  }
}
