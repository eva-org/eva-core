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
logger.info('APP START')
// 插件加载器
const plugins = PluginLoader()
let evaWindow
let mainWindow
let evaWidth
let evaHeight
let queryResult
// noinspection JSAnnotator
app.on('ready', () => {
  logger.info('APP IS READY')
  try {
    mainWindow = createMainWindow()
  } catch (e) {
    logger(e)
  }

  logger.trace('创建隐藏的主窗口')
  logger.trace('创建Eva窗口')
  evaWindow = createEvaWindow(mainWindow)
  const sizeArr = evaWindow.getSize()
  evaWidth = sizeArr[0]
  evaHeight = sizeArr[1]

  // 初次启动，隐藏窗口，快捷键呼出即可
  hideWindow()
  logger.trace('注册全局快捷键')
  globalShortcut.register('CommandOrControl+Shift+M', () => switchWindowShown())
  globalShortcut.register('CommandOrControl+Shift+Alt+K', () => evaWindow.close())
  globalShortcut.register('CommandOrControl+Shift+Alt+M', () => evaWindow.openDevTools())
  ipcMain.on('box-input-esc', () => hideWindow())
  ipcMain.on('hide-main-window', () => hideWindow())
  ipcMain.on('box-input', boxInput)
  ipcMain.on('box-blur', () => hideWindow())
  ipcMain.on('action', action)
  ipcMain.on('restore-box-height', () => changeBoxNum(0))
  logger.info('欢迎使用Eva !')
})

function changeBoxNum(num) {
  if (num > 5) num = 5
  const h = 50
  evaWindow.setSize(evaWidth, +evaHeight + h * num)
}

function action(event, index) {
  queryResult[index].action()
  event.sender.send('clear-box-input-event')
  changeBoxNum(0)
}

function boxInput(event, arg) {
  console.log(arg)

  // 当有新的输入产生，清除之前的query result
  event.sender.send('clear-query-result')
  changeBoxNum(0)

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
  const queryPromise = plugin.query(pluginContext)
  queryPromise.then(result => {
    changeBoxNum(result.length)
    event.sender.send('query-result', result)
  })
}

let appIsVisible = true

function hideWindow() {
  evaWindow.hide()
  if (isMac()) app.hide()
  appIsVisible = false
}

function showWindow() {
  evaWindow.show()
  if (isMac()) app.show()
  appIsVisible = true
}

function switchWindowShown() {
  appIsVisible ? hideWindow() : showWindow()
}
