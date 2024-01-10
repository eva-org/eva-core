module.exports = {
  name: 'Calculator',
  quick: '*',
  type: 'ignoreQuick',
  async query({query, utils}) {
    if (/^[0-9\-\/+*^.=]+$/.test(query)) {
      let exp
      if (query.includes('=')) {
        const arr = query.split('=')
        exp = arr[0]
      } else {
        exp = query
      }
      try {
        const result = eval(exp)
        return [utils.buildLine(`计算结果：${result}`, '继续输入继续计算')]
      } catch (e) {
        return [utils.buildLine('...', '请输入正确的表达式')]
      }
    }
    return []
  },
  app: null,
  async init (utils, app) {
    this.app = app
  }
}
