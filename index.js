var Board = require("firmata").Board;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

var board = new Board("/dev/tty.usbmodem1411");

var photoresistorValue = 0;

board.on("ready", function() {
	var photoresistorPin = 0;
	var ledPin = 13;

	board.pinMode(ledPin, board.MODES.OUTPUT);
	board.digitalWrite(ledPin, board.LOW);
	
	board.analogRead(0,function(val) {
		if(val < 400) {
			board.digitalWrite(ledPin, board.HIGH);
		} else {
			board.digitalWrite(ledPin, board.LOW);
		};

		photoresistorValue = val;
	})
});

io.on('connection', function (socket) {

	setInterval(function() {
		// console.log(photoresistorValue);
		socket.broadcast.emit('analogValue', photoresistorValue);
	}, 100);
});


server.listen(3000, function(){
  console.log('listening on *:3000');
});