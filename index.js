var Board = require("firmata").Board;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

var board = new Board("/dev/tty.usbmodem1421");

var photoresistorFirstValue = 0;
var photoresistorSecondValue = 0;

board.on("ready", function() {
	var photoresistorPin = 0;
	
	board.analogRead(0,function(val) {
		photoresistorFirstValue = val;
	})
	board.analogRead(1,function(val) {
		photoresistorSecondValue = val;
	})
});

io.on('connection', function (socket) {
	setInterval(function() {
		io.emit('analogFirstValue', photoresistorFirstValue);
		io.emit('analogSecondValue', photoresistorSecondValue);
	}, 100);
});


server.listen(3000, function(){
  console.log('listening on *:3000');
});