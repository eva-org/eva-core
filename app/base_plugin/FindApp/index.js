const child_process = require('child_process')
const glob = require('glob')
const os = require('os')

let files = []
let config

glob.promise = function (pattern, options) {
  return new Promise(function (resolve, reject) {
    const g = new glob.Glob(pattern, options)
    g.once('end', resolve)
    g.once('error', reject)
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
  async init(utils) {
    const {isMac, isWindows, isLinux, logger, getConfig, saveConfig} = utils
    config = getConfig('FindApp')
    if (!config.patterns) {
      logger.error('Error')
      if (isMac) {
        config.patterns = ['/Applications/**.app', `${os.homedir()}/Downloads/**.**`]
        config.command = 'open '
      } else if (isWindows) {
        config.patterns = ['C:/ProgramData/Microsoft/Windows/Start Menu/Programs/**.lnk']
        config.command = ''
      } else if (isLinux) {
        // TODO linux support. Pull request needed.
      } else {
        logger.error('Not support current system.')
      }
      saveConfig('findApp', config)
    }

    for (const pattern of config.patterns) {
      await glob.promise(pattern, (err, file) => {
        files = files.concat((file.toString().split(',')))
      })
    }
  },
  async query(pluginContext) {
    return getData(pluginContext)
  }
}
