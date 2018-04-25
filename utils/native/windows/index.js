let native = null

if (process.platform === 'win32') {
  const nativeModuleName = `${process.platform}-${process.arch}`
  try {
    native = require(`./${nativeModuleName}`)
  } catch (e) {
    console.error(e)
  }
}

// avoid invoke error
if (native === null) {
  native = {
    fetchFileIconAsPng: (path, cb) => {
      cb([])
    },
    saveFocus: () => {},
    restoreFocus: () => {}
  }
}

function fetchFileIconAsPng(filePath, callback) {
  try {
    native.fetchFileIconAsPng(filePath, callback)
  } catch (e) {
    console.log(e)
  }
}

function saveFocus() {
  native.saveFocus()
}


function restoreFocus() {
  native.restoreFocus()
}

module.exports = { fetchFileIconAsPng, saveFocus, restoreFocus }
