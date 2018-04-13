// const basePlugin = require.context('../../base_plugin', false, '*')
// const extendPlugin = require.context('../../extend_plugin', false, '*')
// const routes = modulesContext.keys().reduce((modules, key) => {
//   console.log(key)
//   modules.concat(modulesContext(key)
// }), [])
module.exports = () => {
  const basePlugin = require("path").join(__ROOTPATH, "base_plugin");
  const basePlugins = {}
  require("fs").readdirSync(basePlugin).forEach(function (file) {
    basePlugins[file] = require(`${__ROOTPATH}/base_plugin/` + file)
  })

  const extendPlugin = require("path").join(__ROOTPATH, "extend_plugin");
  const extendPlugins = {}
  require("fs").readdirSync(extendPlugin).forEach(function (file) {
    extendPlugins[file] = require(`${__ROOTPATH}/extend_plugin/` + file)
  })
  console.log(basePlugins);
  console.log(extendPlugins);
  return Object.assign(basePlugins, extendPlugins)
}
