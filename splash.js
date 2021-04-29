const { BrowserWindow } = require('electron');
const { EventEmitter } = require('events');
const { initACLs } = require('./win32acls.js');

class SplashScreen extends EventEmitter {
  constructor() {
    super();
    this.splashtime = 2000;
    this.entries = [];
  }
  add(entry) {
    this.entries.push(entry);
  }
  async begin() {
    this.emit('begin');
    let starttime = Date.now();
    this.window = new BrowserWindow({width: 480, height: 260, transparent: true, frame: false, alwaysOnTop: true});
    this.window.setAlwaysOnTop(true, 'screen');
    this.window.loadURL(`file://${__dirname}/splash.html`);

    for (let i = 0; i < this.entries.length; i++) {
      let entry = this.entries[i];
      await entry.exec();
    }
    this.emit('finish');
    let now = Date.now();
    if (now - starttime < this.splashtime) {
      setTimeout(() => {
        this.window.destroy();
      }, this.splashtime - (now - starttime));
    } else {
      this.window.destroy();
    }

  }
}
class SplashScreenEntry extends EventEmitter {
  async exec() {
  }
}
class SplashScreenPermissionsEntry extends SplashScreenEntry {
  exec() {
    return new Promise((resolve, reject) => {
      this.emit('begin');
      initACLs().then(resolve).catch(err => console.log('an error?', err));
    });
  }
}

module.exports = {
  SplashScreen: SplashScreen,
  SplashScreenEntry: SplashScreenEntry,
  SplashScreenPermissionsEntry: SplashScreenPermissionsEntry,
};
