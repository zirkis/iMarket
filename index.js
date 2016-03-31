var app = require('app')
var BrowserWindow = require('browser-window')
app.on('ready', function() {
	var mainWindow = new BrowserWindow({
		width : 850,
		height : 800,
	})
	mainWindow.loadURL('file://' + __dirname + '/index.html')
})