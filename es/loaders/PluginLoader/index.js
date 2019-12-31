const path = require('path')
const fs = require("fs")

module.exports = (utils) => {
  const baseArr = getPluginFromDir(path.join(global.evaSpace.ROOT_DIR, 'base_plugin'))
  console.trace('基础插件加载完毕.')
  utils.createFolder(`${global.evaSpace.evaWorkHome}/plugins/default`)
  const extendArr = getPluginFromDir(path.join(global.evaSpace.evaWorkHome, 'plugins'))
  console.trace('扩展插件加载完毕.')
  const allPlugin = baseArr.concat(extendArr)
  allPlugin.forEach(p => {
    console.trace(`初始化插件: ${p.name}`)
    p.init && new Promise(resolve => resolve(p.init(utils))).catch(reason => console.error(reason))
  })
  return allPlugin
}

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
