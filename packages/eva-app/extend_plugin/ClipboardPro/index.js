
const execute = async ({query}) => {
  return []
}

module.exports = {
  pluginId: '',
  name: 'ClipboardPro',
  quick: 'cli',
  async query(pluginContext) {
    return execute(pluginContext)
  }
}
