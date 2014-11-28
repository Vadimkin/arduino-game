var Board = require("firmata").Board;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

var board = new Board("/dev/tty.usbmodem1411");


io.on('connection', function (socket) {
	board.on("ready", function() {
		var data = 0;
		board.analogRead(0,function(val) {
			data = val;
		})
		setInterval(function() {
			// console.log(data);
			socket.broadcast.emit('analogValue', data);
		}, 100);
	});
});


server.listen(3000, function(){
  console.log('listening on *:3000');
});