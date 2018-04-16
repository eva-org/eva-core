const child_process = require('child_process');

module.exports = {
  name: 'SearchInBaidu',
  quick: 'bd',
  query: ({param}) => {
    return [{
      title: '百度搜索',
      subTitle: '基于百度搜索',
      action() {
        const openUrl = `https://www.google.com/search?q=${query}`
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
