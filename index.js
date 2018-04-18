const evaSpace = {
  returnValue: {}
}
Object.assign(evaSpace, require('./global'))
global.evaSpace = evaSpace

const electron = require('electron')
const {app, globalShortcut, ipcMain} = electron
const {createEvaWindow, createMainWindow} = require('./loaders/windowLoader')
const PluginLoader = require('./loaders/PluginLoader')
const {isMac, logger} = require('./utils')
logger.info('APP START !')
// 插件加载器
const plugins = PluginLoader()
let evaWindow
let mainWindow
let evaWidth
let evaHeight
let queryResult
app.on('ready', () => {
  mainWindow = createMainWindow();
  evaWindow = createEvaWindow(mainWindow)
  const sizeArr = evaWindow.getSize()
  evaWidth = sizeArr[0]
  evaHeight = sizeArr[1]

  // 初次启动，隐藏窗口，快捷键呼出即可
  hideWindow()

  globalShortcut.register('CommandOrControl+Shift+M', () => switchWindowShown())
  globalShortcut.register('CommandOrControl+Shift+Alt+K', () => evaWindow.close())
  globalShortcut.register('CommandOrControl+Shift+Alt+M', () => evaWindow.openDevTools())

  ipcMain.on('box-input-esc', () => hideWindow())
  ipcMain.on('hide-main-window', () => hideWindow())
  ipcMain.on('box-input', boxInput)
  ipcMain.on('box-blur', () => hideWindow())
  ipcMain.on('action', action)
  ipcMain.on('restore-box-height', () => changeBoxNum(0))
})

function changeBoxNum (num) {
  if (num > 5) num = 5
  const h = 50
  evaWindow.setSize(evaWidth, +evaHeight + h * num)
}

function action (event, index) {
  queryResult[index].action()
  event.sender.send('clear-box-input-event')
  changeBoxNum(0)
}

function boxInput (event, arg) {
  console.log(arg)

  const [quickName, value] = arg.split(' ')
  if (!quickName || !value) return event.returnValue = []

  let plugin
  for (const p of plugins) {
    if (p.quick === quickName) {
      plugin = p
      break
    }
  }
  if (!plugin) return event.returnValue = []
  const pluginContext = {
    query: value,
    utils: require('./utils')
  }
  queryResult = plugin.query(pluginContext)
  // changeBoxNum(queryResult.length)
  event.returnValue = []
  // queryResult.then(ret => event.returnValue = ret)
}

let appIsVisible = true

function hideWindow () {
  evaWindow.hide()
  if (isMac()) app.hide()
  appIsVisible = false
}

function showWindow () {
  evaWindow.show()
  if (isMac()) app.show()
  appIsVisible = true
}

function switchWindowShown () {
  appIsVisible ? hideWindow() : showWindow()
}
