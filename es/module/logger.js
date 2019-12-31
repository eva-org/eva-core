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

export const initLogger = (level) => {
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
