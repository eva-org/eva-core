const electron = require('electron')
const {BrowserWindow} = electron

const path = require('path')
const url = require('url')
import { app, BrowserWindow, Menu } from 'electron'
var template = [{
  label: "Application",
  submenu: [
    { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
    { type: "separator" },
    { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
  ]}, {
  label: "Edit",
  submenu: [
    { label: "Undo", accelerator: "CommandOrControl+Z", selector: "undo:" },
    { label: "Redo", accelerator: "Shift+CommandOrControl+Z", selector: "redo:" },
    { type: "separator" },
    { label: "Cut", accelerator: "CommandOrControl+X", selector: "cut:" },
    { label: "Copy", accelerator: "CommandOrControl+C", selector: "copy:" },
    { label: "Paste", accelerator: "CommandOrControl+V", selector: "paste:" },
    { label: "Select All", accelerator: "CommandOrControl+A", selector: "selectAll:" }
  ]}
]
Menu.setApplicationMenu(Menu.buildFromTemplate(template))

function createMainWindow() {
  return new BrowserWindow({
    x: 0, y: 0, width: 0, height: 0, show: false, focusable: false, frame: false,
    titleBarStyle: 'customButtonsOnHover',
    transparent: true
  })
}

function createEvaWindow(width = 500, height = 60, opacity = 1) {
  // Create the browser window.
  const x = (electron.screen.getPrimaryDisplay().workAreaSize.width / 2 - width / 2).toFixed(0)
  const y = 90

  const evaWindow = new BrowserWindow({
    alwaysOnTop: true,
    x: +x,
    y: +y,
    width,
    height,
    opacity,
    // transparent: true,
    frame: false,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    backgroundColor: '#232323',
    show: false,
    webPreferences: {
      devTools: true,
      nodeIntegrationInWorker: true
    }
    // parent: mainWindow
  })

  // 全屏代码
  if (process.platform === 'darwin') electron.app.dock.hide()
  evaWindow.setAlwaysOnTop(true, "floating")
  evaWindow.setVisibleOnAllWorkspaces(true)
  evaWindow.setFullScreenable(false)

// and load the index.html of the app.
  evaWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/main.html'),
    protocol: 'file:',
    slashes: true
  }))

  return evaWindow
}

module.exports = {
  createMainWindow,
  createEvaWindow
}
