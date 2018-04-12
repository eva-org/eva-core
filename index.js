// 全局绑定
global.electron = require('electron')
global.path = require('path')
global.url = require('url')

// Module to control application life.
const {
  electron: {
    app,
    globalShortcut,
    ipcMain
  }
} = global

const SearchInBaidu = require('./base_plugin/SearchInBaidu')
const HbmLog = require('./extend_plugin/HbmLog')
const plugins = [SearchInBaidu, HbmLog]

const {
  createMainWindow
} = require('./loaders/windowLoader')

const {
  hideWindow,
  switchWindowShown
} = require('./utils')

app.on('ready', () => {
  global.mainWindow = createMainWindow()
  const {
    mainWindow
  } = global

  globalShortcut.register('CommandOrControl+Shift+M', () => {
    switchWindowShown(mainWindow)
  })

  ipcMain.on('box-input', (event, arg) => {
    console.log(arg) // prints "ping"
  })

  ipcMain.on('box-input-enter', (event, arg) => {
    const [quickName, value] = arg.split(' ')
    for (const plugin of plugins) {
      if (plugin.quick === quickName) plugin.exec({
        query: value
      })
    }
    // 删除input框的内容
    event.sender.send('clear-box-input-event', true)

    hideWindow(mainWindow)
  })
  ipcMain.on('box-input-esc', () => hideWindow(mainWindow))
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
