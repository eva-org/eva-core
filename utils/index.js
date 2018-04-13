module.exports = {
  hideWindow: (win) => {
    win.hide()
  },
  showWindow: (win) => {
    win.show()
  },
  switchWindowShown: (win) => {
    const isVisible = win.isVisible()
    isVisible ? win.hide() : win.show()
  }
}
