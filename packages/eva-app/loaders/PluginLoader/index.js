const PluginController = require('./PluginController')
const controller = new PluginController()

module.exports = {
  controller,
  loadPlugins: (utils, app) => {
    controller.loadAllPlugins(utils, app)
    return controller.getPlugins()
  }
}
