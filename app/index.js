'use strict';

//const app = require('app');
//const BrowserWindow = require(('browser-window'));

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.on('ready', function() {
  var mainWindow = new BrowserWindow({
    width: 870,
    height: 800
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
});


