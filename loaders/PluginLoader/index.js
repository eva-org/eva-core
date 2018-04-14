const path = require('path')

module.exports = () => {
  const baseArr = getPluginFromDir(path.join(evaSpace.ENTRY_DIR, 'base_plugin'))
  const extendArr = getPluginFromDir(path.join(evaSpace.ENTRY_DIR, 'extend_plugin'))
  return baseArr.concat(extendArr)
}

function getPluginFromDir(path) {
  return require("fs").readdirSync(path).map(file => {
    const middleObject = require(`${path}/` + file)
    return {
      ...middleObject,
      __dir: path
    }
  })
}
