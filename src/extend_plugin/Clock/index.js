const path = require('path')
const url = require('url')

let clockWindow
const electron = require('electron')
const {BrowserWindow} = electron

function getData({query, utils: {logger, buildLine}}) {
  return new Promise(resolve => {
    console.log(query)
    if (!query) return false
    const resultList = []
    const opt = query.split(' ')
    console.log(opt)
    if (opt.length === 1) {
      const option = opt[0]
      logger.debug(option)
      if (option === 'time') {
        resultList.push(buildLine('开启时钟', '回车开启时钟', () => {
          const width = 200
          const height = 30
          const x = (electron.screen.getPrimaryDisplay().workAreaSize.width / 2 - width / 2).toFixed(0)
          const y = (electron.screen.getPrimaryDisplay().workAreaSize.height).toFixed(0)
          clockWindow = new BrowserWindow({
            x: +x, y: +y, width: +width, height: +height, frame: false,
            show: true, resizable: true, movable: true, transparent: true
          })
          clockWindow.setAlwaysOnTop(true, "floating")
          clockWindow.setVisibleOnAllWorkspaces(true)
          clockWindow.setFullScreenable(false)
          clockWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
          }))
          clockWindow.show()
        }))
        resolve(resultList)
      }
      if (option === 'close') {
        if (clockWindow) clockWindow.close()
      }
    }
    // if(query.split())
  })
}

module.exports = {
  name: 'Clock',
  quick: 'clock',
  icon: '',
  query: (pluginContext) => {
    return getData(pluginContext)
  }
}
