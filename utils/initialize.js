const os = require('os')
const fs = require('fs')

const evaWorkHome = `${os.homedir()}/.eva`
let userConfigFilePath = `${evaWorkHome}/config.json`

function createConfigFile() {
  const exist = fs.existsSync(userConfigFilePath)
  if (!exist) {
    fs.writeFileSync(userConfigFilePath, fs.readFileSync(`${evaSpace.ROOT_DIR}/config.json`).toString())
  }
}

const initEva = () => {
  createConfigFile()

  evaSpace.config = {
    ...evaSpace.config,
    ...require(userConfigFilePath)
  }
}

module.exports = {
  initEva,
  evaWorkHome
}