const child_process = require('child_process');
const glob = require('glob')
let files = []
glob('/Applications/**.app', (err, file) => {
  files = file.toString().split(',')
})
const buildLine = (title, subTitle = '', action = () => {
}) => {
  return {
    title,
    subTitle,
    action
  }
}
const getData = ({query}) => {
  return new Promise(resolve => {
    const resultFileArr = files.filter(item => item.replace('/Applications/', '').toUpperCase().indexOf(query.toUpperCase()) >= 0)
    const resultArr = []
    resultFileArr.forEach(item => {
      resultArr.push(buildLine(item.replace('/Applications/', ''), `打开 ${item}`, () => {
        child_process.exec(`open "${item}"`)
      }))
    })
    resolve(resultArr)
  })
}

module.exports = {
  name: 'FindApp',
  quick: 'op',
  async query (pluginContext) {
    return getData(pluginContext)
  }
}
