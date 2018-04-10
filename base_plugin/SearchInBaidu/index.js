const search = ({query}) => {
  const child_process = require('child_process');

  const openUrl = `https://www.baidu.com/s?wd=${query}`
  let cmd
  if (process.platform == 'wind32') {
    cmd = 'start "%ProgramFiles%\Internet Explorer\iexplore.exe"';
  } else if (process.platform == 'linux') {
    cmd = 'xdg-open';
  } else if (process.platform == 'darwin') {
    cmd = 'open';
  }
  child_process.exec(`${cmd} "${openUrl}"`);
}
module.exports = search
