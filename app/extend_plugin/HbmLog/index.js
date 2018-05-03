const child_process = require('child_process')

const getData = async ({query}) => {
  return [{
    title: `Raiyee log: ${query}`,
    subTitle: '查询Raiyee日志',
    action() {
      const openUrl = `http://hbm.easy-hi.cn/blackcat-detail/log/${query}`
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
  name: 'HbmLog',
  quick: 'log',
  icon: 'log.gif',
  async query(pluginContext) {
    return getData(pluginContext)
  }
}
