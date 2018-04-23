const path = require('path')
module.exports = () => {
  const baseArr = getPluginFromDir(path.join(evaSpace.ENTRY_DIR, 'base_plugin'))
  console.trace('基础插件加载完毕.')
  const extendArr = getPluginFromDir(path.join(evaSpace.ENTRY_DIR, 'extend_plugin'))
  console.trace('扩展插件加载完毕.')
  const allPlugin = baseArr.concat(extendArr)
  console.trace('检查自动执行插件')
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
