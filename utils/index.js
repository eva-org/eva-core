function isWindows () {
  return process.platform === 'win32'
}

function isLinux () {
  return process.platform === 'linux'
}

function isMac () {
  return process.platform === 'darwin'
}

const rewriteConsole = logger => {
  console.log = function (item) {
    logger.info(item)
  }
  console.debug = function (item) {
    logger.debug(item)
  }
  console.debug = function (item) {
    logger.debug(item)
  }
}

const initLogger = () => {
  const log4js = require('log4js')
  log4js.configure({
    appenders: {
      out: {
        type: 'console', layout: {
          type: 'pattern',
          pattern: '%[%d{hh:mm:ss\'SSS} %p -- %m %]'
        }
      }
    },
    categories: {default: {appenders: ['out'], level: 'all'}}
  });
  const logger = log4js.getLogger()
  logger.level = 'all'

  // ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK < OFF
  logger.info('LOGGER IS INITIALIZED !')
  //
  console.oldLog = console.log
  rewriteConsole(logger)
  return logger
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
  md5,
  logger: initLogger()
}
