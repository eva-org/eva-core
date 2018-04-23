const path = require('path')
const os = require('os')
const fs = require('fs')
const initEva = () => {
  console.log(`${path.join(evaSpace.ENTRY_DIR, 'node_modules/vue/dist/vue.min.js')}`)
  console.log(`${os.homedir()}/.eva/.init/vue`)

  // createDir(`${os.homedir()}/.eva`);
}
function createDir(path) {
  const pathAry = path.split('/');
  for (let i = 0; i < pathAry.length; i++) {
    const curPath = pathAry.slice(0, i + 1).join('/');
    const isExist = fs.existsSync(curPath);
    !isExist ? fs.mkdirSync(curPath) : null;
  }
}

module.exports = {
  initEva
}