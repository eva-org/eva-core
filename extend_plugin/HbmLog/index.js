const child_process = require('child_process')

module.exports = {
  name: 'HbmLog',
  quick: 'log',
  icon: 'log.gif',
  query: ({param}) => {
    return [{
      title: 'Raiyee log',
      subTitle: 'subTitle',
      action() {
        const openUrl = `http://hbm.easy-hi.cn/blackcat-detail/log/${param}`
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
}
