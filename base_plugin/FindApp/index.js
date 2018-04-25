const child_process = require('child_process');
const glob = require('glob')
const os = require('os')

let files = []
let patterns = []
let command

let initialized = false

function initAndGetData(pluginContext) {
  const {utils: {isMac, isWindows, isLinux, logger}} = pluginContext
  return new Promise(resolve => {
    if (isMac) {
      patterns.push('/Applications/**.app')
      patterns.push(`${os.homedir()}/Downloads/**.**`)
      command = 'open '
    }
    else if (isWindows) {
      patterns.push('C:/ProgramData/Microsoft/Windows/Start Menu/Programs/**.lnk')
      command = ''
    } else if (isLinux) {
      // TODO linux support
    } else {
      logger.error('Not support current system.')
    }
    patterns.forEach(pattern => {
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
          child_process.exec(`${command}${fileUri}`)
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
