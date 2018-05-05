const child_process = require('child_process')
const rimraf = require('rimraf')
const {sep} = require('path')

const execute = async ({query}) => {
  if (!query) return []
  const opt = query.split(' ')
  const option = opt[0]
  const optQuery = opt[1]
  if (option === 'add' || option === 'install') {
    return [{
      title: `安装插件:${optQuery || '请输入插件名称'}`,
      subTitle: 'EvaPackageManager',
      action() {
        let gitUrl = optQuery
        let pluginName
        if (optQuery.indexOf('http') < 0) {
          pluginName = optQuery
          gitUrl = 'https://github.com/eva-org/' + optQuery
        } else {
          pluginName = optQuery.substr(optQuery.lastIndexOf('/') + 1)
        }
        console.debug(gitUrl)
        console.debug(pluginName)
        const pluginDirPath = `${evaSpace.evaWorkHome}plugins`
        child_process.execSync(`git clone ${gitUrl} ${pluginDirPath}${sep}${pluginName}`)
        console.log('安装成功')
      }
    }]
  } else if (option === 'remove' || option === 'uninstall') {
    return [{
      title: `移除插件:${optQuery || '请输入插件名称'}`,
      subTitle: 'EvaPackageManager',
      action() {
        rimraf(`${evaSpace.evaWorkHome}plugins${sep}${optQuery}`, () => {
          console.log(`${evaSpace.evaWorkHome}plugins${sep}${optQuery} Removed.`)
        })
      }
    }]
  }
  return []
}

module.exports = {
  name: 'EvaPackageManager',
  quick: 'epm',
  async query(pluginContext) {
    return execute(pluginContext)
  }
}
