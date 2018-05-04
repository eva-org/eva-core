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
  pluginId: '',
  name: 'ClipboardPro',
  quick: 'epm',
  async query(pluginContext) {
    return execute(pluginContext)
  }
}
