const child_process = require('child_process')
const fs = require('fs')

const execute = async ({query}) => {

  if (!query) return []
  const opt = query.split(' ')
  const option = opt[0]
  const optQuery = opt[1]
  if (option === 'add' || option === 'install') {
    return [{
      title: `安装插件:${optQuery || ''}`,
      subTitle: 'EvaPackageManager',
      action() {
        const pluginName = optQuery.substr(optQuery.lastIndexOf('/') + 1)
        child_process.exec(`git clone ${optQuery} ${evaSpace.evaWorkHome}\\plugins\\${pluginName}`)
      }
    }]
  } else if (option === 'remove' || option === 'uninstall') {
    return [{
      title: `移除插件:${optQuery || ''}`,
      subTitle: 'EvaPackageManager',
      action() {
        // TODO 删除非空目录
        fs.rmdir(`${evaSpace.evaWorkHome}\\plugins\\${optQuery}`)
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
