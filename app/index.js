const os = require('os')
global.evaSpace = {
  config: {
    ...require('./config.json')
  },
  ...require('./global.js'),
  evaWorkHome: `${os.homedir()}/.eva/`
}

const electron = require('electron')
const utils = require('./utils/index.js')
const {initEva} = require('./utils/initialize.js')
const PluginLoader = require('./loaders/PluginLoader/index.js')
const {isMac, isWindows, saveFocus, logger, restoreFocus} = require('./utils/index.js')
const {app, globalShortcut, ipcMain} = electron
const {createEvaWindow, createMainWindow} = require('./loaders/WindowLoader/index.js')

logger.trace('开始初始化App')
initEva()

// 插件加载器
const plugins = PluginLoader(utils)
const commonPlugins = plugins.filter(plugin => plugin.quick === '*')

let evaWindow
let mainWindow
let queryResult

function registerGlobalShortcut() {
  logger.trace('注册全局快捷键')
  let registerSuccess = globalShortcut.register('CommandOrControl+Shift+M', () => switchWindowShown())
  if (!registerSuccess) logger.error('注册快捷键CommandOrControl+Shift+M失败')
  registerSuccess = globalShortcut.register('CommandOrControl+\\', () => switchWindowShown())
  if (!registerSuccess) logger.error('注册快捷键CommandOrControl+\\失败')
  registerSuccess = globalShortcut.register('CommandOrControl+Shift+Alt+M', () => evaWindow.openDevTools())
  if (!registerSuccess) logger.error('注册快捷键CommandOrControl+Shift+Alt+M失败')
  // registerSuccess = globalShortcut.register('CommandOrControl+C',()=>{
  //   const {clipboard} = require('electron')
  //   clipboard.writeText('Example String', 'selection')
  //   console.log(clipboard.readText('selection'))
  // })
  // if(!registerSuccess) logger.error()
}

app.on('ready', () => {
  logger.trace('App已经就绪')
  try {
    logger.trace('创建隐藏的主窗口')
    mainWindow = createMainWindow()
  } catch (e) {
    logger.error(e)
  }
  logger.trace('创建Eva窗口')
  evaWindow = createEvaWindow(evaSpace.config.width, evaSpace.config.height, evaSpace.config.opacity)

  // evaWindow.on('blur', () => hideWindow())

  registerGlobalShortcut()
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
  evaWindow.setSize(evaSpace.config.width, +evaSpace.config.height + h * num)
}

function action(event, index) {
  queryResult[index].action()
  event.sender.send('clear-box-input-event')
  changeBoxNum(0)
}

async function executeCommonPlugin(input) {
  const queryPromises = commonPlugins.map(plugin => plugin.query({
    query: input,
    utils
  }))
  let queryResult = []
  const resultArr = await Promise.all(queryPromises)
  for (const result of resultArr) {
    queryResult = queryResult.concat(result)
  }
  return queryResult
}

function findSuitablePlugin(quickName) {
  return plugins.find(plugin => plugin.quick === quickName)
}

async function executeExactPlugin(suitablePlugin, pluginQuery) {
  if (!pluginQuery) return []
  return await suitablePlugin.query({
    query: pluginQuery,
    utils
  })
}

let lastedInput

function boxInput(event, input) {
  lastedInput = input
  if (!input) return clearQueryResult(event)

  // 如果不包含空格则执行通用插件（*插件）
  const blankIndex = input.indexOf(' ')
  if (blankIndex === -1) {
    return returnValue(event, input, executeCommonPlugin(input))
  }

  const [quickName, ...values] = input.split(' ')
  const suitablePlugin = findSuitablePlugin(quickName)
  if (!suitablePlugin) {
    return returnValue(event, input, executeCommonPlugin(input))
  }

  const pluginQuery = values.join(' ')
  return returnValue(event, input, executeExactPlugin(suitablePlugin, pluginQuery))
}

function returnValue(event, input, resultPromise) {
  resultPromise
      .then(result => {
        // 如果本次回调对应的input不是最新输入，则忽略
        if (input !== lastedInput) return clearQueryResult(event)

        if (result.length) clearQueryResult(event)
        changeBoxNum(result.length)
        event.sender.send('query-result', result)
        // 在主线程保存插件结果，用于执行action，因为基于json的ipc通讯不可序列化function
        queryResult = result
      })
      .catch(reason => logger.error(reason))
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
