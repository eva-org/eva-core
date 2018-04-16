const child_process = require('child_process')
const os = require('os')
const $ = require('jquery')
// 存入剪切板 mac xos
const pbcopyMac = (data) => {
  const proc = require('child_process').spawn('pbcopy')
  proc.stdin.write(data)
  proc.stdin.end()
}
// 存入剪切板 windows
const pbcopyWin = (data) => {
  require('child_process').spawn('clip').stdin.end(util.inspect(data.replace('\n', '\r\n')))
}
module.exports = {
  name: 'YouDao',
  quick: 'yd',
  icon: '',
  query: ({query}) => {
    const request = `http://openapi.youdao.com/api?q=${query}&appKey=acDxfSQsv2GezTE3Fu6yEt6ynmm0j50q&from=auto&to=auto&salt=${Math.random()}`
    return new Promise((resolve) => {
      $.get(request, (ret) => {
        console.log(ret)
        resolve([{
          title: 'ret',
          subTitle: 'subTitle',
          action () {
            // if (os.platform() === 'darwin') {
            //   pbcopyMac(resultText)
            // } else {
            //   pbcopyWin(resultText)
            // }
          }
        }])
      })
    })



  }
}
