import {
  app,
  BrowserWindow,
  ipcMain
} from 'electron';

import {
  excelReader
} from '../module/excelReader'
import {
  checkEarning
} from '../module/checkEarning';

const path = require('path');


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
let backWindow;
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

const isDev = process.env.NODE_ENV === 'development' ? true : false;


const backURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080#/backServicePage` :
  `file://${__dirname}/index.html#/backServicePage`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    transparent: true,
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null;
    if(backWindow!=null){
      backWindow.close();
      backWindow = null;
    }
    
  });


  backWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    show: isDev
  });


  backWindow.loadURL(backURL);


  backWindow.on('closed', () => {
    backWindow = null;
    if(mainWindow!=null){
      mainWindow.close();
      mainWindow = null;
    }
    
  });


  ipcMain.on('backReturn',(event,arg)=>{
    console.log('main 收到  backReturn')
    mainWindow.send(arg.name,arg.data);
  })



  ipcMain.on('toBack', (event, arg) => {
    console.log('main 收到  toBack');
    backWindow.send('backService',arg);
  })



}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})