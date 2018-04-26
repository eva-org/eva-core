const download = async ({query}) => {
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
    return download(pluginContext)
  }
}
