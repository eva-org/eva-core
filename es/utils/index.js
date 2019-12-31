const logLevel = 'all'
const os = require('os')
const fs = require('fs')
const path = require('path')

const evaWorkHome = global.evaSpace.evaWorkHome

function isWindows() {
  return process.platform === 'win32'
}

function isLinux() {
  return process.platform === 'linux'
}

function isMac() {
  return process.platform === 'darwin'
}



const md5 = (str) => {
  const cr = require('crypto')
  const md5 = cr.createHash('md5')
  md5.update(str)
  const result = md5.digest('hex')
  return result.toUpperCase()  //32位大写
}

const buildLine = (title, subTitle = '', action = new Function()) => {
  return {
    title,
    subTitle,
    action
  }
}

const saveConfig = (configName, config) => {
  fs.writeFileSync(`${evaWorkHome}${configName}.json`, JSON.stringify(config, null, 2))
}

const getConfig = (configName) => {
  let configPath = `${evaWorkHome}${configName}.json`
  const exist = fs.existsSync(configPath)
  if (!exist) fs.writeFileSync(configPath, '{}')
  return JSON.parse(fs.readFileSync(configPath).toString())
}

const createFolder = (to) => { //文件写入
  const sep = path.sep
  const folders = path.dirname(to).split(sep);
  let p = '';
  while (folders.length) {
    p += folders.shift() + sep;
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p);
    }
  }
};
// platform args selector 平台参数选择器
const PAS = (mac, win, linux) => {
  if (isMac()) return mac
  else if (isWindows()) return win
  else if (isLinux()) return linux
}
module.exports = {
  isWindows: isWindows(),
  isLinux: isLinux(),
  isMac: isMac(),
  md5,
  buildLine,
  saveConfig,
  getConfig,
  createFolder,
  PAS
}
