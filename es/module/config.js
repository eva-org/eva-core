import { saveJSONFile, getJSONFile } from '../utils'

const evaWorkHome = `${os.homedir()}${path.sep}.eva${path.sep}`
const config = {
  evaWorkHome,
  configPath: path.join(evaWorkHome, 'config.json')
}

const init = obj => {
  // TODO load config.json file
}

const merge = obj => {
  Object.assign(config, obj)
  return {
    ...config
  }
}

const store = () => {
  saveJSONFile(config.configPath, config)
}

const reload = () => {
  merge(config, getJSONFile(config.configPath))
}

export default {
  get: () => ({ ...config }),
  merge,
  init,
  store,
  reload
}
