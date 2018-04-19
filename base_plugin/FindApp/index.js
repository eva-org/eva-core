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
    // console.log(ScanDir('/Applications'))
  })
}
// const getData = async ({query}) => {
//   return [{
//     title: `百度搜索:${query}`,
//     subTitle: '基于百度搜索',
//     action() {
//       const openUrl = `https://www.baidu.com/s?wd=${query}`
//       let cmd
//       if (process.platform === 'win32') {
//         cmd = 'start'
//         return child_process.exec(`${cmd} ${openUrl}`)
//       } else if (process.platform === 'linux') {
//         cmd = 'xdg-open'
//       } else if (process.platform === 'darwin') {
//         cmd = 'open'
//       }
//       child_process.exec(`${cmd} "${openUrl}"`)
//     }
//   }]
// }

module.exports = {
  name: 'FindApp',
  quick: 'op',
  async query (pluginContext) {
    return getData(pluginContext)
  }
}
