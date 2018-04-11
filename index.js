const electron = require('electron')
// Module to control application life.
const {
  app,
  globalShortcut,
  ipcMain,
  BrowserWindow
} = electron
// Module to create native browser window.

const path = require('path')
const url = require('url')
const mainFun = require('./main')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let isShow = false
let input = ''
let query = ''
// TODO 组件加载器
const SearchInBaidu = require('./base_plugin/SearchInBaidu')
const HbmLog = require('./extend_plugin/HbmLog')

function createWindow(x, y) {

  // Create the browser window.
  console.log(x + ',' + y)
  console.log(11)
  mainWindow = new BrowserWindow({
    alwaysOnTop:true,
    x: +x,
    y: +y,
    width: 500,
    height: 76,
    frame: false
  })
  console.log(mainWindow)
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
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
    mainWindow = null
  })
}

ipcMain.on('box-input', (event, arg) => {
  // TODO 实时校验系统
  console.log(arg) // prints "ping"
})

ipcMain.on('box-input-enter', (event, arg) => {
  console.log(arg) // prints "ping"
  // TODO 组件调用器
  const inputArr = arg.split(' ')
  if (inputArr[0] === 'bd') {
    SearchInBaidu({
      query: inputArr[1]
    })
    mainWindow.hide()
  } else if (inputArr[0] === 'log') {
    HbmLog({
      query: inputArr[1]
    })
  }
})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  const winW = electron.screen.getPrimaryDisplay().workAreaSize.width
  const winH = electron.screen.getPrimaryDisplay().workAreaSize.height
  const x = (winW / 2 - 250).toFixed(0)
  const y = 90
  createWindow(x, 90)
  isShow = true
  globalShortcut.register('CommandOrControl+Shift+M', () => {
    console.log(isShow)
    isShow ? mainWindow.hide() : mainWindow.showInactive()
    isShow = !isShow
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
  if (mainWindow === null) {
    const winW = electron.screen.getPrimaryDisplay().workAreaSize.width
    const winH = electron.screen.getPrimaryDisplay().workAreaSize.height
    createWindow((winW / 2 - 250).toFixed(0), 90)
  }
})
