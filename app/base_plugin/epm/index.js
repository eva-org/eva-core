const execute = async ({query}) => {

  if (!query) return false
  const opt = query.split(' ')
  if (opt.length === 1) {
    const option = opt[0]

  }
  return [{
    title: `EvaPackageManager:${query}`,
    subTitle: 'EvaPackageManager',
    action() {
    }
  }]
}

module.exports = {
  name: 'EvaPackageManager',
  quick: 'epm',
  async query(pluginContext) {
    return execute(pluginContext)
  }
}
