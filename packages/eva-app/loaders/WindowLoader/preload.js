const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  evaAction: (index) => ipcRenderer.send('action', index),
  evaEsc: (input) => ipcRenderer.send('box-input-esc', input),
  evaInput: (input) => {
    console.log(input)
    ipcRenderer.send('box-input', { input: input })
  },
  evaOn: (channel, fn) => ipcRenderer.on(channel, fn),
  evaSend: (channel, fn) => ipcRenderer.send(channel, fn)
})
contextBridge.exposeInMainWorld('eva', {
  action: (index) => ipcRenderer.send('action', index),
  esc: (input) => ipcRenderer.send('box-input-esc', input),
  input: (input) => {
    console.log(input)
    ipcRenderer.send('box-input', { input: input })
  },
  on: (channel, fn) => ipcRenderer.on(channel, fn),
  send: (channel, fn) => ipcRenderer.send(channel, fn)
})
