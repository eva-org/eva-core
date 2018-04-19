const child_process = require('child_process');
const glob = require('glob')

let files = []
let pattern
let filePrefix
let command

let initialized = false

function initAndGetData(pluginContext) {
  const {utils: {isMac, isWindows, isLinux, logger}} = pluginContext
  return new Promise(resolve => {
    if (isMac) {
      pattern = '/Applications/**.app'
      filePrefix = '/Applications/'
      command = 'open '
    }
    else if (isWindows) {
      pattern = 'C:/ProgramData/Microsoft/Windows/Start Menu/Programs/**.lnk'
      filePrefix = 'C:/ProgramData/Microsoft/Windows/Start Menu/Programs/'
      command = ''
    } else if (isLinux) {
      // TODO linux support
    } else {
      logger.error('Not support current system.')
    }

    glob(pattern, (err, file) => {
      files = file.toString().split(',')
      initialized = true
      resolve(getData(pluginContext))
    })
  })
}

const getData = ({query}) => {
  return new Promise(resolve => {
    const resultFileArr = files.filter(item => item.replace(filePrefix, '').toUpperCase().indexOf(query.toUpperCase()) >= 0)
    const resultArr = []
    resultFileArr.forEach(item => {
      resultArr.push({
        title: item.replace(filePrefix, ''),
        subTitle: `打开 ${item}`,
        action() {
          child_process.exec(`${command}"${item}"`)
        }
      })
    })
    resolve(resultArr)
  })
}

module.exports = {
  name: 'FindApp',
  quick: 'op',
  async query(pluginContext) {
    if (!initialized) return initAndGetData(pluginContext)
    return getData(pluginContext)
  }
}
