const fs = require('fs')

const evaWorkHome = global.evaSpace.evaWorkHome
const userConfigFilePath = `${evaWorkHome}config.json`

function createConfigFile () {
  const exist = fs.existsSync(userConfigFilePath)
  console.log(userConfigFilePath)
  if (!exist) {
    fs.writeFileSync(userConfigFilePath, fs.readFileSync(`${evaSpace.ROOT_DIR}/config.json`).toString())
  }
}

const initEva = () => {
  createConfigFile()

  global.evaSpace.config = {
    ...global.evaSpace.config,
    ...require(userConfigFilePath),
    evaWorkHome
  }
}

module.exports = {
  initEva,
  evaWorkHome
}
