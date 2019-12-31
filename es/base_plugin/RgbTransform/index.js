const execute = async ({ query, utils: { buildLine, logger } }) => {
  const result = []
  if (/^#[0-9abcdef]{3}$/.test(query)) {
    const arr = query.split('')
    arr.shift()
    arr.forEach(item => {
      result.push(parseInt('' + item + item, 16))
    })
  } else if (/^#[0-9abcdef]{6}$/.test(query)) {
    const arr = query.split('')
    arr.shift()
    logger.info(arr)
    for (let i = 0; i < arr.length; i++) {
      if (i % 2 === 0) {
        result.push(parseInt('' + arr[i] + arr[i + 1], 16))
      }
    }
  }
  return [buildLine(
    `${result.length <= 0 ? '请输入正确的16进制颜色以#号开头' : 'RGB值转换成功'}`,
    `RGB: ${result.join(',')}`,
    () => logger.info('这是一个方法')
  )]
}

module.exports = {
  name: 'RgbTransform',
  quick: 'rgb',
  async query (pluginContext) {
    return execute(pluginContext)
  }
}
