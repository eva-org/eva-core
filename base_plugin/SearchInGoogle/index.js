const child_process = require('child_process');

module.exports = {
  name: 'SearchInGoogle',
  quick: 'g',
  query: ({query}) => {
    return [{
      title: '谷歌搜索',
      subTitle: '基于谷歌搜索',
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
