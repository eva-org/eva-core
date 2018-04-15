function isWindows() {
  return process.platform === 'win32'
}
function isLinux() {
  return process.platform === 'linux'
}
function isMac() {
  return process.platform === 'darwin'
}

module.exports = {
  isWindows,
  isLinux,
  isMac
}
