window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

const { contextBridge, ipcRenderer, ipcMain } = require('electron')

contextBridge.exposeInMainWorld('api', {
  // handleCounter: (callback) => ipcRenderer.on('update-counter', callback),
  // openFile: callback => {
  //   let res = ipcRenderer.invoke('open-file');
  //   // res.then(data => {
  //   //   console.log(data);
  //   // });
  // },
  handleContent: (callback) => ipcRenderer.on('send-content', callback),
  saveFileAs: (data) => ipcRenderer.invoke('save-file-as', data).then(result => console.log(result)),
  saveFileAsResult: (callback) => ipcRenderer.on('save-file-as-result', callback),
  openFile: () => ipcRenderer.invoke('open-file'),
  openFileResult: (callback) => ipcRenderer.on('open-file-result', callback),
  openFileCancelled: (callback) => ipcRenderer.on('open-file-cancelled', callback),
  composeKit: (data) => ipcRenderer.invoke('compose-kit', data),
});

// contextBridge.exposeInIsolatedWorld('electronAPI', {
//   fileContent: (content) => {

//   }
// });

// ipcRenderer.on('send-content', data => {
//   window.postMessage('send-content', data);
// });