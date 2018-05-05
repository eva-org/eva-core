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
        if(!optQuery) return
        let gitUrl = optQuery
        let pluginName
        if (optQuery.indexOf('http') < 0) {
          pluginName = optQuery.indexOf('eva-plugin') < 0 ? `eva-plugin-${optQuery}` : optQuery
          gitUrl = 'https://github.com/eva-org/' + pluginName
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
        if(!optQuery) return
        rimraf(`${evaSpace.evaWorkHome}plugins${sep}${optQuery}`, () => {
          console.log(`${evaSpace.evaWorkHome}plugins${sep}${optQuery} Removed.`)
        })
      }
    }]
  } else if (option === 'update' || option === 'up') {
    return [{
      title: `更新插件:${optQuery || '请输入插件名称'}`,
      subTitle: 'EvaPackageManager',
      action() {
        if(!optQuery) return
        let gitUrl = optQuery
        let pluginName
        if (optQuery.indexOf('http') < 0) {
          pluginName = optQuery.indexOf('eva-plugin') < 0 ? `eva-plugin-${optQuery}` : optQuery
          gitUrl = 'https://github.com/eva-org/' + pluginName
        } else {
          pluginName = optQuery.substr(optQuery.lastIndexOf('/') + 1)
        }
        console.debug(gitUrl)
        console.debug(pluginName)
        const pluginDirPath = `${evaSpace.evaWorkHome}plugins`
        child_process.execSync(`cd ${pluginDirPath}${sep}${pluginName} && git pull`)
        console.log('更新成功')
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
