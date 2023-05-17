// main.js

// Modules to control application life and create native browser window
const { app, dialog, BrowserWindow, ipcMain, electron } = require('electron')
const path = require('path')
const fs = require('fs');
const contextMenu = require('electron-context-menu');

// const { dialog } = require('electron')
var mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 1024,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      spellcheck: true
    },
    autoHideMenuBar: true
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  // electron.ipcMain.addListener('mouse', function(event, e) {
  //   event.returnValue = null;
  //   mainWindow.webContents.inspectElement(e.x, e.y);
  // });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.handle('read', () => 
  {
    return "poing";
    // const fileContent = fs.readFileSync('./main.js', { encoding: 'utf-8' });
    // return fileContent;
  });

  ipcMain.handle('open-file', (event) => {
    // dialog.showOpenDialog(mainWindow, {
    //   properties: ['openFile']
    // }).then(result => {
    //   // console.log(result.canceled)
    //   // console.log(result.filePaths)
    //   if (result.canceled) return;
    //   let data = fs.readFileSync(result.filePaths[0], { encoding: 'utf-8'});
    //   // console.log(data);
    //   event.sender.send('send-content', data);
    // }).catch(err => {
    //   console.log(err)
    // });
    dialog.showOpenDialog(mainWindow, {
      properties: ['openFile']
    }).then(result => {
      if (result.canceled) {
        event.sender.send('open-file-result', false);
        return;
      }
      if (result.filePaths.length > 0) {
        let data = fs.readFileSync(result.filePaths[0], {
          encoding: "utf-8"
        });
        event.sender.send('open-file-result', data);
      }
    });
  });

  ipcMain.handle('save-file-as', (event, data) => {
    let filePath = dialog.showSaveDialogSync(mainWindow, {
      defaultPath: 'Untitled.cmap'
    });
    console.log(filePath, data);
    if (filePath !== undefined) {
      fs.writeFileSync(filePath, data);
      event.sender.send('save-file-as-result', true);
    } else event.sender.send('save-file-as-result', false);
  });
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

contextMenu({
	showSaveImageAs: true,
  prepend: (defaultActions, parameters, browserWindow) => [
		{
			label: 'Rainbow',
			// Only show it when right-clicking images
			visible: parameters.mediaType === 'image'
		},
		{
			label: 'Search Google for “{selection}”',
			// Only show it when right-clicking text
			visible: parameters.selectionText.trim().length > 0,
			click: () => {
				shell.openExternal(`https://google.com/search?q=${encodeURIComponent(parameters.selectionText)}`);
			}
		}
	]
});

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}