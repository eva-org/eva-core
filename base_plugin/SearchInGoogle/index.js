module.exports = {
  name: 'SearchInGoogle',
  quick: 'g',
  exec: ({query}) => {
    const child_process = require('child_process');

    const openUrl = `https://www.google.com/search?q=${query}`
    let cmd

    if (process.platform == 'win32') {
      cmd = 'start'
      return child_process.exec(`${cmd} ${openUrl}`)
    } else if (process.platform == 'linux') {
      cmd = 'xdg-open'
    } else if (process.platform == 'darwin') {
      cmd = 'open'
    }
    child_process.exec(`${cmd} "${openUrl}"`)
  }
}
