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
  },
  path,
  url
} = global

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// global.mainWindow

let input = ''
let query = ''
// TODO 组件加载器
const SearchInBaidu = require('./base_plugin/SearchInBaidu')
const HbmLog = require('./extend_plugin/HbmLog')
const plugins = [SearchInBaidu, HbmLog]
const {createMainWindow, hideWindow, showWindow} = require('./loaders/windowLoader')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  let isShow = false
  global.mainWindow  = createMainWindow()
  const {mainWindow} = global

  isShow = true
  globalShortcut.register('CommandOrControl+Shift+M', () => {
    isShow ? hideWindow(mainWindow) : showWindow(mainWindow)
    isShow = !isShow
  })

  ipcMain.on('box-input', (event, arg) => {
      // TODO 实时校验系统
      console.log(arg) // prints "ping"
  })

  const clearBoxInputWhenEnter = true
  ipcMain.on('box-input-enter', (event, arg) => {
      // TODO 组件调用器
      const [quickName, value] = arg.split(' ')
      for (const plugin of plugins) {
          if (plugin.quick === quickName) plugin.exec({query: value})
      }

      event.sender.send('clear-box-input-event', 'aaaa')
      hideWindow(mainWindow)
  })
  ipcMain.on('box-input-esc', () => hideWindow(mainWindow))
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// app.on('activate', function() {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (global.mainWindow === null) {
//     createMainWindow()
//   }
// })
