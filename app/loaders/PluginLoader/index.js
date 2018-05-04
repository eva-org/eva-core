const path = require('path')
module.exports = (utils) => {
  const baseArr = getPluginFromDir(path.join(evaSpace.ROOT_DIR, 'base_plugin'))
  console.trace('基础插件加载完毕.')
  const extendArr = getPluginFromDir(path.join(evaSpace.ROOT_DIR, 'extend_plugin'))
  console.trace('扩展插件加载完毕.')
  const allPlugin = baseArr.concat(extendArr)
  allPlugin.forEach(p => {
    console.trace(`初始化插件: ${p.name}`)
    p.init && p.init(utils)
  })
  return allPlugin
}

function getPluginFromDir(path) {
  return require("fs").readdirSync(path).filter(item => {
    return item !== '.DS_Store'
  }).map(file => {
    const middleObject = require(`${path}/` + file)
    return {
      ...middleObject,
      __dir: path
    }
  })
}
