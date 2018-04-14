module.exports = () => {
  // const BASE_PLUGIN_DIR = path.join(__ROOTPATH, 'base_plugin')
  // const EXTEND_PLUGIN_DIR = path.join(__ROOTPATH, 'extend_plugin')
  const baseArr = getPluginFromDir(BASE_PLUGIN_DIR)
  const extendArr = getPluginFromDir(EXTEND_PLUGIN_DIR)
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
