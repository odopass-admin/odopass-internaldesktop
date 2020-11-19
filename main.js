// Modules to control application life and create native browser window
const {app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')
const ejse = require('ejs-electron')
const {ipcMain} = require('electron');
const { Notification } = require('electron')
const { autoUpdater } = require('electron-updater');


function showNotification(title, body) {
  const notification = {
    title: title,
    body: body
  }
  new Notification(notification).show()
}


let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    //icon: __dirname + '/YDEO.icns',
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // Create the browser window.
  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')
  mainWindow.loadURL('file://' + __dirname + '/client/list.ejs')
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

}


autoUpdater.on('checking-for-update', function () {
    mainWindow.webContents.send('check_update');
    sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-not-available', function (info) {
    mainWindow.webContents.send('no_update_available');
    sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', function (err) {
    sendStatusToWindow('Error in auto-updater.');
});

autoUpdater.on('download-progress', function (progressObj) {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
});


autoUpdater.on('update-available', () => {
  console.log("update available")
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  console.log("update downloaded")
  mainWindow.webContents.send('update_downloaded');
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  globalShortcut.register('CommandOrControl+E', () => {
    console.log('CommandOrControl+E is pressed')
    mainWindow.loadURL('file://' + __dirname + '/client/list.ejs')
  })

  globalShortcut.register('CommandOrControl+G', () => {
    console.log('CommandOrControl+E is pressed')
    mainWindow.loadURL('https://accounts.google.com/AccountChooser/signinchooser?service=mail&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&flowName=GlifWebSignIn&flowEntry=AccountChooser')
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})














ipcMain.on('switch_environnement', (event, params) => {
    //showNotification('switch_env', params.environnement)
    console.log(params.environnement)
    switch (params.environnement) {
      case 'clickup_all':
        mainWindow.loadURL('https://app.clickup.com/2671518/v/b/li/33970944');
        break;

      case 'firebase_staging':
        mainWindow.loadURL('https://console.firebase.google.com/u/0/project/odopassdb-test/firestore/data~2Falerts~2F01f68f36-ccf6-42f2-84ec-0a763188de0a');
        break;
      case 'firebase_production':
        mainWindow.loadURL('https://console.firebase.google.com/u/0/project/odopass/firestore/data~2Falerts~2F1e7d0394-f4b9-4b5f-8f63-6695a69fe0e7');
        break;

      case 'kibana_staging':
        mainWindow.loadURL('https://adminstage.odopass.tech/app/apm#/services/API_vps-53fcdb52_staging/transactions?rangeFrom=now-24h&rangeTo=now&refreshPaused=true&refreshInterval=0&transactionType=request');
        break;
      case 'kibana_production':
        mainWindow.loadURL('https://adminpro.odopass.tech/app/apm#/services/API_vps-1de3474d_production/transactions?rangeFrom=now-24h&rangeTo=now&refreshPaused=true&refreshInterval=0&transactionType=request');
        break;


      case 'sentry_api':
        mainWindow.loadURL('https://sentry.io/organizations/odopass/issues/?environment=production&project=5433787');
        break;
      case 'sentry_mobile':
        mainWindow.loadURL('https://sentry.io/organizations/odopass/issues/?environment=production&project=5433796');
        break;


      case 'gitlab_api':
        mainWindow.loadURL('https://gitlab.com/mobwebstack/api_odo/-/pipelines');
        break;
      case 'gitlab_elk':
        mainWindow.loadURL('https://gitlab.com/odotechstack/docker_elk');
        break;
      case 'gitlab_scrapper':
        mainWindow.loadURL('https://gitlab.com/odotechstack/scrapper_js');
        break;
      case 'gitlab_backoffice':
        mainWindow.loadURL('https://gitlab.com/odotechstack/odopass-monitor/-/pipelines');
        break;
      case 'gitlab_mobile':
        mainWindow.loadURL('https://gitlab.com/mobwebstack/odopass_mobileapp/-/pipelines');
        break;
      case 'gitlab_backoffice':
        mainWindow.loadURL('https://gitlab.com/odotechstack/odopass-monitor/-/pipelines');
        break;


      case 'odopass_staging':
        mainWindow.loadURL('http://192.168.1.157:3001/users');
        break;
      case 'odopass_production':
        mainWindow.loadURL('http://192.168.1.157:3000/users');
        break;
    }

});


ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})




function sendStatusToWindow(message) {
    console.log(message);
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
