const evaSpace = {
  ...require('./config.json')
}
Object.assign(evaSpace, require('./global.js'))
global.evaSpace = evaSpace
const electron = require('electron')
const {app, globalShortcut, ipcMain} = electron
const path = require('path')
const {createEvaWindow, createMainWindow} = require('./loaders/WindowLoader/index.js')
const PluginLoader = require('./loaders/PluginLoader/index.js')
const {isMac, isWindows, saveFocus, logger, restoreFocus} = require('./utils/index.js')
const {initEva} = require('./utils/initialize.js')
logger.trace('开始初始化App')
initEva()
logger.trace('App开始启动')
logger.debug(evaSpace)

// 插件加载器
const plugins = PluginLoader()
let evaWindow
let mainWindow
let queryResult

app.on('ready', () => {
  logger.trace('App已经就绪')
  try {
    logger.trace('创建隐藏的主窗口')
    mainWindow = createMainWindow()
  } catch (e) {
    logger.error(e)
  }
  logger.trace('创建Eva窗口')
  evaWindow = createEvaWindow(evaSpace.width, evaSpace.height)

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
  logger.info('欢迎使用Eva!')
})

function changeBoxNum(num) {
  if (num > 5) num = 5
  const h = 50
  evaWindow.setSize(evaSpace.width, +evaSpace.height + h * num)
}

function action(event, index) {
  queryResult[index].action()
  event.sender.send('clear-box-input-event')
  changeBoxNum(0)
}

let latestInput
function boxInput(event, arg) {
  logger.debug(arg)
  let currentInput = arg
  latestInput = arg

  const [quickName, ...value] = arg.split(' ')
  const query = value.join(' ')
  logger.debug(`quickName:[${quickName}],query:[${query}]`)
  if (!query) {
    // TODO * plugins
  }

  if (!quickName || !query) {
    clearQueryResult(event)
    return event.returnValue = []
  }

  let plugin
  for (const p of plugins) {
    if (p.quick === quickName) {
      plugin = p
      break
    }
  }
  if (!plugin) {
    clearQueryResult(event)
    return event.returnValue = []
  }

  const pluginContext = {
    query,
    utils: require('./utils/index.js')
  }

  let queryPromise = plugin.query(pluginContext)
  if (!(queryPromise instanceof Promise)) {
    queryPromise = new Promise(resolve => resolve(queryPromise))
  }
  queryPromise.then(result => {
    if (latestInput !== currentInput) return

    changeBoxNum(result.length)
    event.sender.send('query-result', result)

    // 在主线程保存插件结果，用于执行action，因为基于json的ipc通讯不可序列化function
    queryResult = result
  })
}

function clearQueryResult(event) {
  event.sender.send('clear-query-result')
  changeBoxNum(0)
}

let appIsVisible = false

function hideWindow() {
  evaWindow.hide()
  if (isWindows) restoreFocus()
  if (isMac) app.hide()
  appIsVisible = false
}

function showWindow() {
  evaWindow.show()
  if (isWindows) saveFocus()
  if (isMac) app.show()
  appIsVisible = true
}

function switchWindowShown() {
  appIsVisible ? hideWindow() : showWindow()
}
