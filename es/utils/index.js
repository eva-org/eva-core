const logLevel = 'all'
const os = require('os')
const fs = require('fs')
const path = require('path')

const {restoreFocus, saveFocus} = require('./native/windows')
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

const rewriteConsole = logger => {
  console.log = function (item) {
    logger.info(item)
  }
  console.info = function (item) {
    logger.info(item)
  }
  console.debug = function (item) {
    logger.debug(item)
  }
  console.trace = function (item) {
    logger.trace(item)
  }
}

const initLogger = (level) => {
  const log4js = require('log4js')
  log4js.configure({
    appenders: {
      console: {
        type: 'console', layout: {
          type: 'pattern',
          pattern: '%[%d{hh:mm:ss\'SSS} %p -- %m%]'
        }
      },
      app: {
        type: 'file', filename: `${os.homedir()}/.eva/eva.log`, layout: {
          type: 'pattern',
          pattern: '%[%d{hh:mm:ss\'SSS} %p -- %m%]'
        }
      }
    },
    categories: {default: {appenders: ['console', 'app'], level: 'all'}}
  })
  const logger = log4js.getLogger()
  logger.level = level

  // 所有日志种类 ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK < OFF
  logger.mark(`日志模块初始化成功，当前日志级别: ${logger.level}`)
  console.oldLog = console.log
  rewriteConsole(logger)
  // 推荐使用 TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK
  return logger
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
  logger: initLogger(logLevel),
  restoreFocus,
  saveFocus,
  buildLine,
  saveConfig,
  getConfig,
  createFolder,
  PAS
}
