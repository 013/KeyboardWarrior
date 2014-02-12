var score = 0.0;
var currentLetter = "";
var words = [];
getWords();
// Get first word
var wordToType = words[0]
var letterPlace = 0;
var wordPlace = 0;
var letterToType = wordToType[letterPlace];

/* Function relating to canvas */
function redraw(wordToType, letterPlace, correct) {
	var canvas = document.getElementById("moving");
	var context = canvas.getContext("2d");
	var x = 60;
	var y = 15;
	canvas.width = 120;
	canvas.height = 20;
	
	context.font = "12px monospace";
	context.textAlign = "center";

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
}

function nextword(word) {
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

redraw(wordToType, letterPlace, true);
nextword(words[1]);
/*				*/

document.addEventListener('keydown', function(event) {
	// Add to the var 'currentWord' the current pressed key
	currentLetter = String.fromCharCode(event.keyCode);

	if(event.keyCode == 32) { // Space
		console.log("PAUSE");
	}

	if (letterToType.toUpperCase() == currentLetter) {
		//console.log(letterToType);
		letterPlace += 1;
		letterToType = wordToType[letterPlace];
		
		// Make colours
		//	document.getElementById('colourword').innerHTML = 
		//	//"<span style='color: #00DD00'>" + wordToType.substr(0,letterPlace) + "<span>" + 
		//	"<span style='color: #CCC'>" + wordToType.substr(0,letterPlace) + "</span>" + 
		//	"<span style='color: #000'>" + wordToType.substr(letterPlace, wordToType.length) + "</span>";
		//
		redraw(wordToType, letterPlace, true);
		
		// Word completely typed
		if (wordToType.length == letterPlace) {
			score += 1;
			document.getElementById('score').innerHTML = score;
			// Reset some variables
			wordPlace += 1;
			
			wordToType = words[wordPlace];
			//document.getElementById('word').innerHTML = wordToType;
			//document.getElementById('colourword').innerHTML = "<span style='color: #000'>" + wordToType + "</span>";
			
			// if need new words, get them
			if (wordPlace == words.length-1) {
				//console.log("Need new words");
				getWords();
				wordPlace = -1;
			}
			
			redraw(wordToType);
			nextword(words[wordPlace+1]);
			//document.getElementById('nextword').innerHTML = words[wordPlace+1];
			
			letterPlace = 0;
			letterToType = wordToType[letterPlace];
		}
	} else {
		// Typed incorrect letter
		score -= 0.1;
		// Since 0.1 isn't actually 0.1, we need to round it
		score = Math.round(score * 100) / 100;
		document.getElementById('score').innerHTML = score;

		redraw(wordToType, letterPlace, false);
		/* Fade colour */

		//document.getElementById('colourword').innerHTML = 
		//"<span style='color: #00DD00'>" + wordToType.substr(0,letterPlace) + "<span>" + 
		//"<span style='color: #CCC'>" + wordToType.substr(0,letterPlace) + "</span>" + 
		//"<span id='flash' style='transition: color 0.2s; -moz-transition: color 0.2s; -webkit-transition: color 0.2s;'>" + wordToType.charAt(letterPlace) + "</span>" + 
		//"<span style='color: #000'>" + wordToType.substr(letterPlace+1, wordToType.length) + "</span>";
		//var flash = document.getElementById('flash');
		//flash.style.transition = "color 0.5s ease-in 0.5s";
		//flash.style.WebkitTransition = 'color 0.5s ease-in 0.5s';
		//flash.style.MozTransition = 'color 0.5s ease-in 0.5s';
		//setTimeout(function() {
		//	var flash = document.getElementById('flash');
		//	flash.style.color = "#dd0000";
		//},0);
		/*		*/

	}
});
/*
function fade() {
		document.getElementById('flash').style.transition = "color 0.5s ease-in 0.5s";
		document.getElementById('flash').style.WebkitTransition = 'color 0.5s ease-in 0.5s';
		document.getElementById('flash').style.MozTransition = 'color 0.5s ease-in 0.5s';
		document.getElementById('flash').style.color = "#dd0000";
}
*/
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
