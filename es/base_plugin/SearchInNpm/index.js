const child_process = require('child_process')

const getData = async ({ query }) => {
  return [{
    title: `在NPM仓库中搜索:${query}`,
    subTitle: '基于NPM仓库',
    action () {
      const openUrl = `https://www.npmjs.com/search?q=${query}`
      let cmd
      if (process.platform === 'win32') {
        cmd = 'start'
        return child_process.exec(`${cmd} ${openUrl}`)
      } else if (process.platform === 'linux') {
        cmd = 'xdg-open'
      } else if (process.platform === 'darwin') {
        cmd = 'open'
      }
      child_process.exec(`${cmd} "${openUrl}"`)
    }
  }]
}

module.exports = {
  name: 'SearchInNpm',
  quick: 'npm',
  async query (pluginContext) {
    return getData(pluginContext)
  }
}
