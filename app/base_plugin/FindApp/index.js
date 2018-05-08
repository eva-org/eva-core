const child_process = require('child_process')
const glob = require('glob')
const os = require('os')
let files = []
let config
let initialized = false

glob.promise = function (pattern, options) {
  return new Promise(function (resolve, reject) {
    const g = new glob.Glob(pattern, options)
    g.once('end', resolve)
    g.once('error', reject)
  })
}

let searchCache = {}
const fs = require('fs')
// 缓存路径
const cachePath = `${evaSpace.evaWorkHome}FindApp/cache.json`

async function initAndGetData(pluginContext) {
  initialized = true

  const {utils: {isMac, isWindows, isLinux, logger, getConfig, saveConfig, createFolder}} = pluginContext

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
      if (err) {
        logger.error(err)
        return
      }
      files = files.concat(file.toString().split(',').filter(() => true))
    })
  }

  //加载缓存
  const cacheFileExist = fs.existsSync(cachePath)
  files.forEach(file => {
    searchCache[file] = 0
  })
  if (cacheFileExist) {
    Object.assign(searchCache, JSON.parse(fs.readFileSync(cachePath).toString()))
  } else {
    createFolder(cachePath)
  }
  return getData(pluginContext)
}

const getData = ({query}) => {
  return new Promise(resolve => {
    const resultFileArr = files.filter(fileUri => {
      const position = fileUri.lastIndexOf('/') + 1
      return fileUri.slice(position).toUpperCase().indexOf(query.toUpperCase()) >= 0
    })

    const resultArr = resultFileArr.map(fileUri => {
      const position = fileUri.lastIndexOf('/') + 1
      const order = searchCache[fileUri]

      return {
        title: fileUri.slice(position),
        subTitle: `打开 ${fileUri}`,
        order,
        action() {
          try {
            cache(fileUri)
          } catch (e) {
            console.log(e)
          }
          child_process.exec(`${config.command}"${fileUri}"`)
        }
      }
    })
    resultArr.sort((a, b) => {
      return b['order'] - a['order']
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


const cache = (filePath) => {
  const times = searchCache[filePath] || 0
  searchCache[filePath] = times + 1
  fs.writeFileSync(cachePath, JSON.stringify(searchCache))
}