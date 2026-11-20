const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('playgroundApi', {
  copyText: (text) => ipcRenderer.invoke('clipboard:write', text),
  saveJson: (defaultName, content) => ipcRenderer.invoke('file:save', defaultName, content),
  openFile: (title, extensions) => ipcRenderer.invoke('file:open', title, extensions),
});

contextBridge.exposeInMainWorld('odataApi', {
  parse: (tokens) => ipcRenderer.invoke('odata:parse', tokens),
  tokenize: (filter) => ipcRenderer.invoke('odata:tokenize', filter),
});
