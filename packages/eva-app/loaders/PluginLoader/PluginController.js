const path = require('path')
const fs = require('fs')
const { createFolder } = require('../../utils')
function getPluginFromDir(path) {
  return fs.readdirSync(path).filter(item => {
    return item !== '.DS_Store'
  }).map(file => {
    const middleObject = require(`${path}/${file}`)
    return {
      ...middleObject,
      __dir: path
    }
  })
}

class PluginController {
  basePlugins
  extendPlugins

  constructor (basePlugins = [], extendPlugins = []) {
    this.basePlugins = basePlugins
    this.extendPlugins = extendPlugins
    createFolder(`${evaSpace.evaWorkHome}plugins/`)
  }

  loadBasePlugins (utils, app) {
    const baseArr = getPluginFromDir(path.join(evaSpace.ROOT_DIR, 'base_plugin'))
    console.trace('基础插件加载完毕.')
    baseArr.forEach(p => {
      console.trace(`初始化基础插件: ${p.name}`)
      p.init && new Promise(resolve => resolve(p.init(utils, app))).catch(reason => console.error(reason))
    })
    this.basePlugins = baseArr
  }

  loadExtendPlugins (utils) {
    const extendArr = getPluginFromDir(path.join(evaSpace.evaWorkHome, 'plugins'))
    console.trace('扩展插件加载完毕.')
    extendArr.forEach(p => {
      console.trace(`初始化扩展插件: ${p.name}`)
      p.init && new Promise(resolve => resolve(p.init(utils))).catch(reason => console.error(reason))
    })
    this.extendPlugins = extendArr
  }

  loadAllPlugins (utils, app) {
    this.loadBasePlugins(utils, app)
    this.loadExtendPlugins(utils)
  }

  registerBasePlugin (plugin) {
    this.basePlugins.push(plugin)
  }

  registerExtendPlugin (plugin) {
    this.extendPlugins.push(plugin)
  }

  getBasePlugins () {
    return this.basePlugins
  }

  getExtendPlugins () {
    return this.extendPlugins
  }

  getPlugins () {
    return this.basePlugins.concat(this.extendPlugins)
  }

  getPluginByName (name) {
    return this.getPlugins().find(p => p.name === name)
  }
}

module.exports = PluginController
