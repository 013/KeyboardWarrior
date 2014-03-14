var words          = [];
getWords(false);  // Populates  'words'
var score          = 0.0;
var currentLetter  = "";
var wordToType     = words[0]
var letterPlace    = 0;
var wordPlace      = 0;
var letterToType   = wordToType[letterPlace]; //words[0][0]
var angle          = Math.floor(Math.random()*(61 - -60 +1)+ -61);
var z              = 0;
var pause          = false;
var canvas         = document.getElementById("moving");
var context        = canvas.getContext("2d");
var now, delta;
var then           = new Date().getTime();
var correct;

var startingX = 0;//Math.floor(Math.random()*(window.innerWidth/2 - (window.innerWidth/2-window.innerWidth))+ (window.innerWidth/2-window.innerWidth));
var x = startingX;//Math.floor(Math.random()*(50 - -50 +1)+ -50);
var y = 0;

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
	x=startingX;
	now = new Date().getTime();
	delta = now-then;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	if (pause == true) { 
		context.font = "24px monospace";
		context.strokeStyle = "rgb(255,0,0)";
		context.strokeText("Paused", window.innerWidth/2,window.innerHeight/2);
	} else {
		z+=calcSpeed(delta, .1);
	}
	
	context.font = "24px monospace";
	
	context.fillText("Score: "+
		score+
		"\tNext Word: "+
		words[wordPlace+1]
		, 10,window.innerHeight-10);

	context.translate(canvas.width / 2, 20+z);
	if(canvas.height < z) {
		console.log("Off screen");
		newWord(false);
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

function newWord(correct=true) {
	if (correct) {
		score += 1;
	} else {
		score -= 1;
	}
	angle = 0;
	z = 0;
	wordPlace += 1;
	angle = Math.floor(Math.random()*(61 - -60 +1)+ -61);
	wordToType = words[wordPlace];
	// if need new words, get them
	if (wordPlace == words.length-1) {
		getWords();
		wordPlace = -1;
	}
	letterPlace = 0;
	letterToType = wordToType[letterPlace];
}

document.addEventListener('keydown', function(event) {
	// Add to the var 'currentWord' the current pressed key
	currentLetter = String.fromCharCode(event.keyCode);
	
	if(event.keyCode == 32) { // Space
		if (pause == true) {
			pause = false;
			then = new Date().getTime();
		} else {
			pause = true;
		}
	}

	if (pause == true) { return 0; }

	// A - Z	
	if (event.keyCode >= 65 && event.keyCode <= 90) {
		if (letterToType.toUpperCase() == currentLetter) {
			letterPlace += 1;
			letterToType = wordToType[letterPlace];
			
			correct = true;
			
			// Word completely typed
			if (wordToType.length == letterPlace) {
				newWord(true);
			}
		} else {
			// Typed incorrect letter
			score -= 0.1;
			// Since 0.1 isn't actually 0.1, we need to round it
			score = Math.round(score * 100) / 100;
			correct = false;
		}
	}
});

function getWords(async=true) {
	request = new XMLHttpRequest;
	// Difficulty starts at 2
	request.open('GET', 'words.php?difficulty=2', async);
    
	request.onload = function() {
		if(request.status >= 200 && request.status < 400) {
			// It worked.
			data = JSON.parse(request.responseText);
			handleResponse(data);
		} else {
			console.log("An error occurred when retrieving words");
		}
	}
	request.send();
}

function handleResponse (response) {
   words = response; 
}
