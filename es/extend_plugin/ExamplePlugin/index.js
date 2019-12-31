const execute = async ({ query, utils: { buildLine, logger } }) => {
  return [buildLine(
    '例子插件',
    '欢迎创作',
    () => logger.info('这是一个方法')
  )]
}

module.exports = {
  name: 'ExamplePlugin',
  quick: 'ep',
  async query (pluginContext) {
    return execute(pluginContext)
  }
}
