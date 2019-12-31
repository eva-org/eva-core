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

const reload = () => {
  // TODO 重新加载配置文件
}

export default {
  config: { ...config },
  merge,
  init,
  store
}
