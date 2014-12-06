var socket = io.connect();

var photoresistorValues = [[-1, -1], [-1, -1]];

var maxFirstValue = -1;
var minFirstValue = -1;

var maxSecondValue = -1;
var minSecondValue = -1;

var KeyX = 0;
var KeyY = 0;

socket.on('analogFirstValue', (function(data) {
	if(photoresistorValues[0][1] < data || photoresistorValues[0][1] <= 0) {
		photoresistorValues[0][1] = data;
	}
	if((photoresistorValues[0][0] == -1 || photoresistorValues[0][0] > data) && data != 0) {
		photoresistorValues[0][0] = data;
	}

	var firstValue = 100 - (100 * (data - photoresistorValues[0][0]))/(photoresistorValues[0][1] - photoresistorValues[0][0]);
	KeyX = firstValue*WIDTH/100;
}));

socket.on('analogSecondValue', (function(data) {
	if(photoresistorValues[1][1] < data) {
		photoresistorValues[1][1] = data;
	}
	if((photoresistorValues[1][0] == -1 || photoresistorValues[1][0] > data) && data != 0) {
		photoresistorValues[1][0] = data;
	}

	secondValue = 100 - (100 * (data - photoresistorValues[1][0]))/(photoresistorValues[1][1] - photoresistorValues[1][0]);
	KeyY = secondValue*HEIGHT/100;
}));

setInterval(function() {
	KeyFlag = true;
	oscillator.frequency.value = (KeyX/WIDTH) * maxFreq;
	gainNode.gain.value = (KeyY/HEIGHT) * maxVol;
	canvasDraw();
}, 50);

socket.on('disconnect', function() {
	maxFirstValue = -1;
	minFirstValue = -1;

	maxSecondValue = -1;
	minSecondValue = -1;
});