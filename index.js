// 全局绑定
global.electron = require('electron')
global.path = require('path')
global.url = require('url')
global.__ROOTPATH = __dirname

const {
  electron: {
    app,
    globalShortcut,
    ipcMain
  }
} = global

const {createMainWindow} = require('./loaders/windowLoader')

const PluginLoader = require('./loaders/PluginLoader')
const plugins = Object.values(PluginLoader())

const {hideWindow, switchWindowShown} = require('./utils')

app.on('ready', () => {
  global.mainWindow = createMainWindow()

  globalShortcut.register('CommandOrControl+Shift+M', hide)
  globalShortcut.register('CommandOrControl+Shift+Alt+M', grow)

  ipcMain.on('box-input', boxInput)
  ipcMain.on('box-input-enter', boxInputEnter)
  ipcMain.on('box-input-esc', boxInputEsc)
  ipcMain.on('hide-main-window', hideMainWindow)
})

const hide = () => switchWindowShown(mainWindow)
const grow = () => {
  const h = 50
  const [width, height] = mainWindow.getSize()
  mainWindow.setSize(width, height + h)
}

const hideMainWindow = () => hideWindow(mainWindow)
const boxInputEsc = () => hideWindow(mainWindow)
const boxInput = (event, arg) => console.log(arg)
const boxInputEnter = (event, arg) => {
  let validTag = false
  const [quickName, value] = arg.split(' ')
  for (const plugin of plugins) {
    if (plugin.quick === quickName) {
      plugin.exec({
        query: value
      })
      validTag = true
    }
  }
  const returnData = {
    code: validTag,
    result: ['one', 'two', 'three']
  }
  event.returnValue = returnData
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
