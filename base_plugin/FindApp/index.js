const child_process = require('child_process');
const glob = require('glob')
const os = require('os')

let files = []
let config

let initialized = false

function initAndGetData(pluginContext) {
  const {utils: {isMac, isWindows, isLinux, logger, getConfig, saveConfig}} = pluginContext

  config = getConfig('FindApp')
  if (!config.patterns) {
    if (isMac) {
      config.patterns = ['/Applications/**.app', `${os.homedir()}/Downloads/**.**`]
      config.command = 'open '
    } else if (isWindows) {
      config.patterns = ['C:/ProgramData/Microsoft/Windows/Start Menu/Programs/**.lnk']
      config.command = ''
    } else if (isLinux) {
      // TODO linux support
    } else {
      logger.error('Not support current system.')
    }
    saveConfig('findApp', config)
  }
  return new Promise(resolve => {
    config.patterns.forEach(pattern => {
      glob(pattern, (err, file) => {
        files = files.concat(file.toString().split(','))
        initialized = true
      })
    })
    console.log(files)
    resolve(getData(pluginContext))
  })
}

const getData = ({query}) => {
  return new Promise(resolve => {
    const resultFileArr = files.filter(fileUri => {
      const position = fileUri.lastIndexOf('/') + 1
      return fileUri.slice(position).toUpperCase().indexOf(query.toUpperCase()) >= 0
    })

    const resultArr = resultFileArr.map(fileUri => {
      const position = fileUri.lastIndexOf('/') + 1
      return {
        title: fileUri.slice(position),
        subTitle: `打开 ${fileUri}`,
        action() {
          child_process.exec(`${config.command}${fileUri}`)
        }
      }
    })
    resolve(resultArr)
  })
}

module.exports = {
  name: 'FindApp',
  quick: '*',
  type: 'ignoreQuick',
  async query(pluginContext) {
    if (!initialized) return initAndGetData(pluginContext)
    return getData(pluginContext)
  }
}
