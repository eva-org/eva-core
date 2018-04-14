const evaSpace = {}
Object.assign(evaSpace, require('./global'))
global.evaSpace = evaSpace

const {app, globalShortcut, ipcMain} = require('electron')
const {createEvaWindow, createMainWindow} = require('./loaders/windowLoader')
const PluginLoader = require('./loaders/PluginLoader')

// 插件加载器
const plugins = PluginLoader()
console.log(plugins);

let evaWindow
let mainWindow
app.on('ready', () => {
  mainWindow = createMainWindow();
  evaWindow = createEvaWindow(mainWindow)
  evaWindow.on('blur', () => hideWindow())

  globalShortcut.register('CommandOrControl+Shift+M', () => switchWindowShown())
  globalShortcut.register('CommandOrControl+Shift+Alt+K', () => evaWindow.close())
  globalShortcut.register('CommandOrControl+Shift+Alt+M', grow)

  ipcMain.on('box-input-enter', boxInputEnter)
  ipcMain.on('box-input-esc', () => hideWindow())
  ipcMain.on('hide-main-window', () => hideWindow())
  ipcMain.on('box-input', (event, arg) => console.log(arg))
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

function hideWindow() {
  evaWindow.hide()
}

function showWindow() {
  evaWindow.show()
}

function switchWindowShown() {
  const isVisible = evaWindow.isVisible()
  isVisible ? hideWindow() : showWindow()
}
