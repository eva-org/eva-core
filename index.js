const evaSpace = {}
Object.assign(evaSpace, require('./global'))
global.evaSpace = evaSpace

const {app, globalShortcut, ipcMain} = require('electron')
const {createEvaWindow, createMainWindow} = require('./loaders/windowLoader')
const PluginLoader = require('./loaders/PluginLoader')
const {isMac} = require('./utils')

// 插件加载器
const plugins = PluginLoader()

let evaWindow
let mainWindow
app.on('ready', () => {
  mainWindow = createMainWindow();
  evaWindow = createEvaWindow(mainWindow)
  // 初次启动，隐藏窗口，快捷键呼出即可
  hideWindow()
  // evaWindow.on('blur', () => hideWindow())

  globalShortcut.register('CommandOrControl+Shift+M', () => switchWindowShown())
  globalShortcut.register('CommandOrControl+Shift+Alt+K', () => evaWindow.close())
  globalShortcut.register('CommandOrControl+Shift+Alt+M', grow)

  ipcMain.on('box-input-enter', boxInputEnter)
  ipcMain.on('box-input-esc', () => hideWindow())
  ipcMain.on('hide-main-window', () => hideWindow())
  ipcMain.on('box-input', (event, arg) => console.log(arg))
  ipcMain.on('box-blur', () => hideWindow())
})

const grow = () => {
  const h = 50
  const [width, height] = evaWindow.getSize()
  evaWindow.setSize(width, height + h)
}

const boxInputEnter = (event, arg) => {
  let validTag = false
  const [quickName, value] = arg.split(' ')

  let pluginReturnValue
  for (const plugin of plugins) {
    if (plugin.quick === quickName) {
      pluginReturnValue = plugin.exec({
        query: value
      })
      validTag = true
    }
  }
  event.returnValue = {
    code: validTag,
    result: pluginReturnValue
  }
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
