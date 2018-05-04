const child_process = require('child_process')
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
        child_process.exec(`git clone ${optQuery} C:\\Users\\hanzi\\.eva\\plugins\\${pluginName}`)
      }
    }]
  } else if (option === 'remove' || option === 'uninstall') {
    return [{
      title: `移除插件:${optQuery || ''}`,
      subTitle: 'EvaPackageManager',
      action() {
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
