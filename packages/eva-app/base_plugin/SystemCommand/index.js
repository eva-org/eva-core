const child_process = require('child_process')

const getData = ({query, utils: { logger }}, app) => {
  const systemCommandList = [
    {
      title: 'Restart',
      subTitle: 'Restart Eva',
      action () {
        app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
        app.exit(0)
      }
    },
    {
      title: 'Exit',
      subTitle: 'Exit Eva',
      action () {
        app.exit(0)
      }
    },
    {
      title: 'All plugins',
      subTitle: 'Press Enter show all plugins',
      action () {
        // TODO 显示所有plugins
      }
    }
  ]
  if (query === '?') {
    return systemCommandList
  }
  return systemCommandList.filter(item => item.title.toUpperCase().indexOf(query.toUpperCase()) >= 0)
}
module.exports = {
  name: 'SystemCommand',
  quick: '*',
  type: 'ignoreQuick',
  async query(pluginContext) {
    return getData(pluginContext, this.app)
  },
  app: null,
  async init (utils, app) {
    this.app = app
  }
}
