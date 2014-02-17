var score = 0.0;
var currentLetter = "";
var words = [];
getWords(); // Populates 'words'
// Get first word
var wordToType = words[0]
var letterPlace = 0;
var wordPlace = 0;
var letterToType = wordToType[letterPlace]; //words[0][0]
var angle = Math.floor(Math.random()*(61 - -60 +1)+ -61);
var z=0;
var canvas = document.getElementById("moving");
var context = canvas.getContext("2d");

var correct;

var now, delta;
var then = new Date().getTime();

window.requestAnim = function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function(f) {
			window.setTimeout(f,1e3/60);
		}
}();

function move() {
	now = new Date().getTime();
	delta = now-then;
	//console.log(delta);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var x = 0//Math.floor(Math.random()*(50 - -50 +1)+ -50);
	var y = 0;
	
	context.font = "24px monospace";
	z+=calcSpeed(delta, 1);
	context.translate(canvas.width / 2, 20+z);
	if (angle > -80) {
		angle -= 2;
	}
	context.rotate(angle*Math.PI / 180);
	context.save();
	for (var i=0; i<=wordToType.length; ++i) {
		var ch = wordToType.charAt(i);
		if (i<letterPlace) {	
			context.fillStyle = "rgb(0,255,0)";
		} else if (correct==false && i==letterPlace) {
			context.fillStyle = "rgb(255,0,0)";
		} else {
			context.fillStyle = "rgb(0,0,0)";
		}
		context.fillText(ch, x, y);
		x += context.measureText(ch).width;
	}
	context.restore();

	then = now;

}

var calcSpeed = function(delta, speed) {
	return(speed * 60 * delta) / 1000;
}

var anim = function() {
	requestAnim(anim);
	move();
}
anim();

function nextword(word) {
	return 0;
	var canvas = document.getElementById("nextword");
	var context = canvas.getContext("2d");
	var x = 60;
	var y = 15;
	canvas.width = 120;
	canvas.height = 20;
	
	context.font = "12px monospace";
	context.textAlign = "center";

	context.fillText(word, x, y);
}

nextword(words[1]);

document.addEventListener('keydown', function(event) {
	// Add to the var 'currentWord' the current pressed key
	currentLetter = String.fromCharCode(event.keyCode);
	
	if(event.keyCode == 32) { // Space
		console.log("PAUSE");
	}

	// A - Z	
	if (event.keyCode >= 65 && event.keyCode <= 90) {
		if (letterToType.toUpperCase() == currentLetter) {
			//console.log(letterToType);
			letterPlace += 1;
			letterToType = wordToType[letterPlace];
			
			correct = true;
			
			// Word completely typed
			if (wordToType.length == letterPlace) {
				score += 1;
				angle = 0;
				z = 0;
				//document.getElementById('score').innerHTML = score;
				// Reset some variables
				wordPlace += 1;
				
				wordToType = words[wordPlace];
				
				// if need new words, get them
				if (wordPlace == words.length-1) {
					getWords();
					wordPlace = -1;
				}
				
				nextword(words[wordPlace+1]);
				
				letterPlace = 0;
				letterToType = wordToType[letterPlace];
			}
		} else {
			// Typed incorrect letter
			score -= 0.1;
			// Since 0.1 isn't actually 0.1, we need to round it
			score = Math.round(score * 100) / 100;
			//document.getElementById('score').innerHTML = score;
			correct = false;
			//redraw(wordToType, letterPlace, false);
		}
	}
});

function getWords() {
	request = new XMLHttpRequest;
	// Difficulty starts at 2
	request.open('GET', 'words.php?difficulty=2', false); // Must be false
    
	request.onload = function() {
		if(request.status >= 200 && request.status < 400) {
			// It worked.
			data = JSON.parse(request.responseText);
			handleResponse(data);
		} else {
			console.log("An error occurred");
		}
	}
	request.send();
}

function handleResponse (response) {
   words = response; 
}
