const child_process = require('child_process')
const os = require('os')
const axios = require('axios')
const {appKey, appSecret} = require('./config.json')
if(!appKey || !appSecret)
console.log(YouDaoConfig)
// 存入剪切板 mac xos
const pbcopyMac = (data) => {
  const proc = require('child_process').spawn('pbcopy')
  proc.stdin.write(data)
  proc.stdin.end()
}

const md5 = (str) => {
  const cr = require('crypto');
  const md5 = cr.createHash('md5');
  md5.update(str);
  const result = md5.digest('hex');
  return result.toUpperCase();  //32位大写
}

function getData (query) {
  const salt = Math.random()
  const sign = md5(appKey + query + salt + appSecret)
  const request = `http://openapi.youdao.com/api?q=${query}&appKey=${appKey}&from=auto&to=auto&salt=${salt}&sign=${sign}`
  axios.get(request).then((res) => {
    console.log(res.data)
  })

}

// 存入剪切板 windows
const pbcopyWin = (data) => {
  require('child_process').spawn('clip').stdin.end(util.inspect(data.replace('\n', '\r\n')))
}
module.exports = {
  name: 'YouDao',
  quick: 'yd',
  icon: '',
  query: ({query, response}) => {


    return getData(query)
    // return new Promise((resolve) => {
    //   $.get(request, (ret) => {
    //     console.log(ret)
    //     resolve([{
    //       title: 'ret',
    //       subTitle: 'subTitle',
    //       action () {
    //         // if (os.platform() === 'darwin') {
    //         //   pbcopyMac(resultText)
    //         // } else {
    //         //   pbcopyWin(resultText)
    //         // }
    //       }
    //     }])
    //   })
    // })


  }
}
