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


module.exports = {
  isWindows,
  isLinux,
  isMac,
  log: {
    info,
    debug,
    warn,
    error
  }
}
