const fs = require('fs')

const evaWorkHome = evaSpace.evaWorkHome
let userConfigFilePath = `${evaWorkHome}config.json`

function createConfigFile() {
  const exist = fs.existsSync(userConfigFilePath)
  console.log(userConfigFilePath)
  if (!exist) {
    fs.writeFileSync(userConfigFilePath, fs.readFileSync(`${evaSpace.ROOT_DIR}/config.json`).toString())
  }
}

const initEva = () => {
  createConfigFile()

  evaSpace.config = {
    ...evaSpace.config,
    ...require(userConfigFilePath),
    evaWorkHome
  }
}

module.exports = {
  initEva,
  evaWorkHome
}
