import { globalShortcut } from 'electron'
import { logger } from '../utils'

const registerGlobal = (key, callback) => {
  const registerSuccess = globalShortcut.register(key, callback)
  if (!registerSuccess) logger.error(`注册快捷键${key}失败`)
}

const register = (key, callback) => {
  // TODO 注册非全局快捷键
  // const registerSuccess = globalShortcut.register(key, callback)
  // if (!registerSuccess) logger.error(`注册快捷键${key}失败`)
}

export default {
  register,
  registerGlobal
}
