module.exports = {
  hideWindow: (win) => {
    // win.hide()
    win.minimize()
  },
  showWindow: (win) => {
    win.restore()
  },
  switchWindowShown: (win) => {
    const isVisible = win.isVisible()
    isVisible ? win.hide() : win.show()
  }
}
