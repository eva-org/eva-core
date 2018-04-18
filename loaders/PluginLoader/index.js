const path = require('path')

module.exports = () => {
  const baseArr = getPluginFromDir(path.join(evaSpace.ENTRY_DIR, 'base_plugin'))
  console.log('BASE PLUGIN LOADED.')
  const extendArr = getPluginFromDir(path.join(evaSpace.ENTRY_DIR, 'extend_plugin'))
  console.log('EXTEND PLUGIN LOADED.')
  return baseArr.concat(extendArr)
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
