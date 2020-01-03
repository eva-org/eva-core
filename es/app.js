import electron from 'electron'
import { createEvaWindow, createMainWindow } from './loaders/WindowLoader'
// import Shortcut from './module/shortcut'
import { notice } from './module/notice'
import { PAS } from './utils'
import config from './module/config'
const { app, ipcMain, Tray } = electron

const registerGlobalShortcut = () => {
  // logger.trace('注册全局快捷键')
  // Shortcut.registerGlobal('CommandOrControl+Shift+M', () => switchWindowShown())
  // Shortcut.registerGlobal('CommandOrControl+\\', () => switchWindowShown())
  // Shortcut.registerGlobal('CommandOrControl+Shift+Alt+M', () => evaWindow.openDevTools())
  // Shortcut.registerGlobal('CommandOrControl+Shift+Alt+R', () => restart())
  // Shortcut.registerGlobal('CommandOrControl+Alt+P', () => app.quit())
}

let mainWindow
let evaWindow
let tray

const start = (utils) => {
  const { logger } = utils
  const { evaWorkHome } = config

  app.on('ready', () => {
    registerGlobalShortcut()
    // logger.trace('App已经就绪')
    try {
      logger.trace('创建隐藏的主窗口')
      mainWindow = createMainWindow('evaWorkHome')
    } catch (e) {
      logger.error(e)
    }
    logger.trace('创建Eva窗口')
    evaWindow = createEvaWindow(config.width, config.height, config.opacity)
    tray = new Tray(PAS(path.join(__dirname, './logo-1024-16x16@3x.png'), './icon.ico'))
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
    notice({ title: 'Eva', body: '你好人类，我将给予你帮助！' })
  })
}
export default {
  start
}
