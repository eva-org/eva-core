// import fs from 'fs'
// import path from 'path'

export const isWindows = () => process.platform === 'win32'

const isLinux = () => {
  return process.platform === 'linux'
}

const isMac = () => {
  return process.platform === 'darwin'
}

const md5 = (str) => {
  const cr = require('crypto')
  const md5 = cr.createHash('md5')
  md5.update(str)
  const result = md5.digest('hex')
  return result.toUpperCase() // 32位大写
}

const buildLine = (title, subTitle = '', action = () => {}) => {
  return {
    title,
    subTitle,
    action
  }
}

const saveJSONFile = (filepath, config) => {
  fs.writeFileSync(`${filepath}`, JSON.stringify(config, null, 2))
}

const getJSONFile = filepath => {
  const exist = fs.existsSync(filepath)
  if (!exist) fs.writeFileSync(filepath, '{}')
  return JSON.parse(fs.readFileSync(filepath).toString())
}

const createFolder = (to) => { // 文件写入
  const sep = path.sep
  const folders = path.dirname(to).split(sep)
  let p = ''
  while (folders.length) {
    p += folders.shift() + sep
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p)
    }
  }
}

// platform args selector 平台参数选择器
const PAS = (mac, win, linux) => {
  if (isMac()) return mac
  else if (isWindows()) return win
  else if (isLinux()) return linux
}

export {
  isLinux,
  isMac,
  md5,
  buildLine,
  getJSONFile,
  saveJSONFile,
  createFolder,
  PAS
}
