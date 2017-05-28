# janusweb-electron
Electron app for JanusWeb.  Run JanusWeb in a standalone native app.

# Building
## Linux
```bash
$ git clone https://github.com/jbaicoianu/janusweb-electron
$ cd janusweb-electron
$ wget https://web.janusvr.com/janusweb-1.0.tar.gz # always points to most recent 1.0 version
$ tar xzfs janusweb-1.0.tar.gz
$ ln -s janusweb-1.0.xx/ janusweb # FIXME - tarball from above extracts to versioned dir, need to know which version to create the symlink
$ npm install electron electron-builder electron-packager
$ npm run pack:linux
```
