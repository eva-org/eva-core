const child_process = require('child_process')
const rimraf = require('rimraf')
const {sep} = require('path')

const execute = async ({query, utils: {notice}}) => {
  if (!query) return []
  const opt = query.split(' ')
  const option = opt[0]
  const optQuery = opt[1]
  if (option === 'add' || option === 'install') {
    return [{
      title: `安装插件:${optQuery || '请输入插件名称'}`,
      subTitle: 'EvaPackageManager',
      action() {
        if (!optQuery) return
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
        notice({
          title: `EPM 提醒您：`,
          body: `插件${pluginName}安装成功，他将守护您！记得重新启动Eva哦！`
        })
        console.log('安装成功')
      }
    }]
  } else if (option === 'remove' || option === 'uninstall') {
    return [{
      title: `移除插件:${optQuery || '请输入插件名称'}`,
      subTitle: 'EvaPackageManager',
      action() {
        if (!optQuery) return
        let pluginName = optQuery
        if (optQuery.indexOf('eva-plugin') < 0) pluginName = 'eva-plugin-' + optQuery
        rimraf(`${evaSpace.evaWorkHome}plugins${sep}${pluginName}`, () => {
          console.log(`${evaSpace.evaWorkHome}plugins${sep}${pluginName} Removed.`)
          notice({
            title: `EPM 提醒您：`,
            body: `插件${pluginName}已经离你而去！记得重新启动Eva哦！`
          })
        })
      }
    }]
  } else if (option === 'update' || option === 'up') {
    return [{
      title: `更新插件:${optQuery || '请输入插件名称'}`,
      subTitle: 'EvaPackageManager',
      action() {
        if (!optQuery) return
        let gitUrl = optQuery
        let pluginName
        if (optQuery.indexOf('http') < 0) {
          pluginName = optQuery.indexOf('eva-plugin') < 0 ? `eva-plugin-${optQuery}` : optQuery
          gitUrl = 'https://github.com/eva-org/' + pluginName
        } else {
          pluginName = optQuery.substr(optQuery.lastIndexOf('/') + 1)
        }
        const pluginDirPath = `${evaSpace.evaWorkHome}plugins`
        child_process.execSync(`cd ${pluginDirPath}${sep}${pluginName} && git pull`)
        notice({
          title: `EPM 提醒您：`,
          body: `插件${pluginName}已经更新成功！记得重新启动Eva哦！`
        })
      }
    }]
  }
  return []
}

module.exports = {
  name: 'PackageManager',
  quick: 'epm',
  async query(pluginContext) {
    return execute(pluginContext)
  }
}
