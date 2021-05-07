const {app, BrowserWindow} = require('electron');
const localShortcut = require('electron-localshortcut');
const { SplashScreen, SplashScreenPermissionsEntry } = require('./splash.js');
const process = require('process');
const commander = require('commander');
const program = new commander.Command();

program.version('0.0.1');
program.option('-d, --debug', 'Debug mode');
program.option('-m, --mode <type>', 'Display mode (2d or vr)', '2d');

// FIXME if I don't add an extra entry at the start of our arguments, commander ignores the first arg
program.parse(['', ...process.argv]);
const options = program.opts();

let splash = new SplashScreen();
splash.add(new SplashScreenPermissionsEntry());

//app.commandLine.appendSwitch('force-webxr-runtime', 'openxr');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let januswebapp;

function initJanusWeb() {
  splash.on('finish', () => {
    januswebapp = new JanusWebElectron();
  });
  splash.begin();
}

function JanusWebElectron() {
  this.windows = [];

  this.windows.push(this.createWindow());
}
JanusWebElectron.prototype.createWindow = function() {
  // Create the browser window.
  var win = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: 'JanusXR',
    show: false,
  })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.once('ready-to-show', () => {
    win.show();

    if (options.mode == 'vr') {
      // FIXME - firing this on a short timeout helps give the page time to load and register its event handler, but there are probably more reliable ways to do this
      setTimeout(() => {
        // Synthesize click event so that Chrome's LocalFrame::HasTransientUserActivation() check when entering VR returns true
        win.webContents.sendInputEvent({
          type: 'mousedown',
          x: 0,
          y: 0,
          clickCount: 1
        });
        win.webContents.sendInputEvent({
          type: 'mouseup',
          x: 0,
          y: 0
        });

        // Send fake sessiongranted event
        win.webContents.executeJavaScript('navigator.xr.dispatchEvent(new CustomEvent("sessiongranted"));');
      }, 100);
    }
  });

  localShortcut.register(win, 'CmdOrCtrl+Shift+J', this.showDevTools.bind(this, win));
  localShortcut.register(win, 'CmdOrCtrl+N', this.createWindow.bind(this));
  localShortcut.register(win, 'CmdOrCtrl+W', this.closeWindow.bind(this, win));
  return win;
}
JanusWebElectron.prototype.showDevTools = function(win) {
  // Open the DevTools.
  win.webContents.openDevTools()
}
JanusWebElectron.prototype.closeWindow = function(win) {
  win.close();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', initJanusWeb)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
/*
  if (win === null) {
    createWindow()
  }
*/
})


