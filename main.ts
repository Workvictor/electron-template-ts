import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

const aspectRation = 16 / 9;
const width = 1440;
const height = width / aspectRation;

const createWindow = () => {
  const debugMode = process.argv.slice(1).includes('--dbg');

  const win = new BrowserWindow({
    width,
    height,
    minWidth: width,
    minHeight: height,
    backgroundColor: '#000',
    center: true,
    resizable: false,
    fullscreenable: true,
    webPreferences: {
      devTools: debugMode,
      textAreasAreResizable: false,
      preload: path.resolve(app.getAppPath(), 'preload.js'),
    },
  });
  win.menuBarVisible = debugMode;

  win.on('ready-to-show', () => {
    if (debugMode) {
      win.webContents.openDevTools();
    }
  });

  win.loadFile('index.html');
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('api-quit' as ChannelApiString, async () => {
  app.quit();
});
