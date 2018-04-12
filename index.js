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

// Module to create native browser window.
const {createMainWindow} = require('./loaders/windowLoader')
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  let isShow = false
  global.mainWindow  = createMainWindow()
  const {mainWindow} = global

  isShow = true
  globalShortcut.register('CommandOrControl+Shift+M', () => {
    isShow ? mainWindow.hide() : mainWindow.show()
    isShow = !isShow
  })

  ipcMain.on('box-input', (event, arg) => {
    // TODO 实时校验系统
    console.log(arg) // prints "ping"
  })

  ipcMain.on('box-input-enter', (event, arg) => {
    // TODO 组件调用器
    const inputArr = arg.split(' ')
    if (inputArr[0] === 'bd') {
      SearchInBaidu({
        query: inputArr[1]
      })
      mainWindow.hide()
      isShow = !isShow
    } else if (inputArr[0] === 'log') {
      HbmLog({
        query: inputArr[1]
      })
    }
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (global.mainWindow === null) {
    createMainWindow()
  }
})
