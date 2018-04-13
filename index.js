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

const {
  createMainWindow
} = require('./loaders/windowLoader')

const PluginLoader = require('./loaders/PluginLoader')
const plugins = Object.values(PluginLoader())

const {
  hideWindow,
  switchWindowShown
} = require('./utils')

app.on('ready', () => {
  global.mainWindow = createMainWindow()

  globalShortcut.register('CommandOrControl+Shift+M', () => {
    switchWindowShown(mainWindow)
  })

  ipcMain.on('box-input', (event, arg) => {
    console.log(arg) // prints "ping"
  })

  ipcMain.on('box-input-enter', (event, arg) => {
    let vaildTag = false
    const [quickName, value] = arg.split(' ')
    for (const plugin of plugins) {
      if (plugin.quick === quickName) {
        plugin.exec({
          query: value
        })
        vaildTag = true
      }
    }
    if (vaildTag) {
      // 删除input框的内容
      event.returnValue = 'clear'
    }
  })
  ipcMain.on('box-input-esc', () => hideWindow(mainWindow))

  ipcMain.on('hide-main-window',()=> hideWindow(mainWindow))
})

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
