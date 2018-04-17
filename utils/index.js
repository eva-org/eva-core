function isWindows() {
  return process.platform === 'win32'
}
function isLinux() {
  return process.platform === 'linux'
}
function isMac() {
  return process.platform === 'darwin'
}
const color = require('colors')

const info = (log) => {
  console.log(log.green)
}
const debug = (log) => {
  console.log(log.rainbow)
}
const warn = (log) => {
  console.log(log.yellow)
}
const error = (log) => {
  console.log(log.red)
}

const md5 = (str) => {
  const cr = require('crypto');
  const md5 = cr.createHash('md5');
  md5.update(str);
  const result = md5.digest('hex');
  return result.toUpperCase();  //32位大写
}

module.exports = {
  isWindows,
  isLinux,
  isMac,
  log: {
    info,
    debug,
    warn,
    error,
    md5
  }
}
