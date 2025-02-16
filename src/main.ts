import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import axios from 'axios';
import Logger from './main/utils/Logger';
import previewReceiptHandler from './main/ipcHandlers/previewReceiptHandler';
import printHandler from './main/ipcHandlers/printHandler';
import printLog from './main/ipcHandlers/logHandler';
import WebSocketService from './main/service/WebSocketService';
import webSocketServerCheckHandler from './main/ipcHandlers/webSocketServerCheckHandler';

let mainWindow: BrowserWindow;

if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 640,
    height: 480,
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
};

app.on('ready', () => {
  Logger.info('App Ready');
  createWindow();

  axios.get('https://naver.com')
  .then(res => {
    dialog.showMessageBox(mainWindow, { message: res.data.substring(0, 20) })
  })

  const webSocketService = WebSocketService.getInstance();

  setInterval(() => {
    if (webSocketService.isEnabled) {
//
    } else {
      // Logger.info('[WebSocketServer Down]');

      // webSocketService.restartServer();
    }
  }, 1000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('previewReceipt', previewReceiptHandler);
ipcMain.handle('print', printHandler);
ipcMain.handle('checkWebSocketServer', webSocketServerCheckHandler);
ipcMain.handle('log', printLog);