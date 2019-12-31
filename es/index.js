import os from 'os'
import { sep, join } from 'path'
import electron from 'electron'
import utils, { isMac, isWindows, logger, PAS, restoreFocus, saveFocus } from './utils/index.js'
import { initEva } from './utils/initialize.js'
import PluginLoader from './loaders/PluginLoader/index.js'
import { createEvaWindow, createMainWindow } from './loaders/WindowLoader/index.js'
import { notice } from './module/notice'
import Shortcut from './module/shortcut'
import cfg from './config.json'
import gbl from './global.js'

global.evaSpace = {
  config: {
    ...cfg
  },
  ...gbl,
  evaWorkHome: `${os.homedir()}${sep}.eva${sep}`
}
console.log(global)

const { app, globalShortcut, ipcMain, Tray, clipboard } = electron

logger.trace('开始初始化App')
initEva()

// 插件加载器
const plugins = PluginLoader(utils)
const commonPlugins = plugins.filter(plugin => plugin.quick === '*')

let evaWindow
let mainWindow
let tray
let queryResult = []

const registerGlobalShortcut = () => {
  logger.trace('注册全局快捷键')
  Shortcut.registerGlobal('CommandOrControl+Shift+M', () => switchWindowShown())
  Shortcut.registerGlobal('CommandOrControl+\\', () => switchWindowShown())
  Shortcut.registerGlobal('CommandOrControl+Shift+Alt+M', () => evaWindow.openDevTools())
  Shortcut.registerGlobal('CommandOrControl+Shift+Alt+R', () => restart())
  Shortcut.registerGlobal('CommandOrControl+Alt+P', () => app.quit())
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
  evaWindow = createEvaWindow(global.evaSpace.config.width, global.evaSpace.config.height, global.evaSpace.config.opacity)
  tray = new Tray(PAS(join(global.evaSpace.ROOT_DIR, './logo-1024-16x16@3x.png'), './icon.ico'))
  tray.setToolTip('Eva')

  evaWindow.on('blur', () => hideWindow())

  registerGlobalShortcut()
  ipcMain.on('box-input-esc', () => hideWindow())
  ipcMain.on('hide-main-window', () => hideWindow())
  ipcMain.on('box-input', boxInput)
  ipcMain.on('box-blur', () => hideWindow())
  ipcMain.on('action', action)
  ipcMain.on('restore-box-height', () => changeBoxNum(0))
  logger.info('欢迎使用Eva!')
  notice({
    title: 'Eva',
    body: '你好人类，我将给予你帮助！'
  })
})

function changeBoxNum (num) {
  if (num > 5) num = 5
  const h = 50
  evaWindow.setSize(global.evaSpace.config.width, +global.evaSpace.config.height + h * num)
}

function action (event, index) {
  logger.info(event)
  if (queryResult.length <= 0) return
  new Promise((resolve) => {
    queryResult[index].action()
    resolve()
  }).then(() => {
    event.sender.send('action-exec-success')
  }).catch(reason => {
    logger.error(reason)
  })
}

async function executeCommonPlugin (input) {
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

function findSuitablePlugin (quickName) {
  return plugins.find(plugin => plugin.quick === quickName)
}

async function executeExactPlugin (suitablePlugin, pluginQuery) {
  if (!pluginQuery) return []
  return await suitablePlugin.query({
    query: pluginQuery,
    clipboard,
    utils: {
      ...utils,
      notice
    }
  })
}

let lastedInput

function boxInput (event, input) {
  lastedInput = input
  if (!input) return clearQueryResult(event)

  // 如果不包含空格则执行通用插件（*插件）
  const blankIndex = input.indexOf(' ')
  if (blankIndex === -1) {
    return returnValue(event, input, executeCommonPlugin(input))
  }

  const [quickName, ...values] = input.split(' ')
  // 匹配插件
  const suitablePlugin = findSuitablePlugin(quickName)
  // 未匹配到
  if (!suitablePlugin) {
    return returnValue(event, input, executeCommonPlugin(input))
  }
  // 处理执行匹配的插件
  const pluginQuery = values.join(' ')
  return returnValue(event, input, executeExactPlugin(suitablePlugin, pluginQuery))
}

function returnValue (event, input, resultPromise) {
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

function clearQueryResult (event) {
  event.sender.send('clear-query-result')
  changeBoxNum(0)
}

let appIsVisible = false

function hideWindow () {
  evaWindow.hide()
  if (isWindows) restoreFocus()
  if (isMac) app.hide()
  appIsVisible = false
}

function showWindow () {
  evaWindow.show()
  if (isWindows) saveFocus()
  if (isMac) app.show()
  appIsVisible = true
}

function switchWindowShown () {
  appIsVisible ? hideWindow() : showWindow()
}

function restart () {
  app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
  app.exit(0)
}


