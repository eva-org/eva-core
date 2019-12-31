const config = {}

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
  // TODO save config.json file
}

export default {
  config: { ...config },
  merge,
  init,
  store
}
