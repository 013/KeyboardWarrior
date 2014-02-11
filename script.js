var score = 0.0;
var currentLetter = "";
//var words = ["Ryan", "Two"];
var words;
getWords();
// Get first word
var wordToType = words[0]
var letterPlace = 0;
var wordPlace = 0;
var letterToType = wordToType[letterPlace];

// Set div to the first word
document.getElementById('colourword').innerHTML = "<span style='color: #CCC'>" + wordToType + "<span>";
document.getElementById('nextword').innerHTML = words[1];

document.addEventListener('keydown', function(event) {
	// Add to the var 'currentWord' the current pressed key
	currentLetter = String.fromCharCode(event.keyCode);

	if(event.keyCode == 32) { // Space
		console.log("PAUSE");
	}

	if (letterToType.toUpperCase() == currentLetter) {
		
		
		console.log(letterToType);
		letterPlace += 1;
		letterToType = wordToType[letterPlace];
		
		// Make colours
			document.getElementById('colourword').innerHTML = 
			"<span style='color: #00DD00'>" + wordToType.substr(0,letterPlace) + "<span>" + 
			"<span style='color: #CCC'>" + wordToType.substr(letterPlace, wordToType.length) + "<span>";
		//
		
		// Word completely typed
		if (wordToType.length == letterPlace) {
			score += 1;
			document.getElementById('score').innerHTML = score;
			console.log("DONE");
			// Reset some variables
			wordPlace += 1;
			
			// if need new words, get them

			wordToType = words[wordPlace];
			//document.getElementById('word').innerHTML = wordToType;
			document.getElementById('colourword').innerHTML = "<span style='color: #CCC'>" + wordToType + "<span>";
			
			if (wordPlace == words.length-1) {
				console.log("Need new words");
				getWords();
				wordPlace = -1;
			}
			
			document.getElementById('nextword').innerHTML = words[wordPlace+1];
			
			letterPlace = 0;
			letterToType = wordToType[letterPlace];
		}
	} else {
		// Typed incorrect letter
		score -= 0.1;
		// Since 0.1 isn't actually 0.1, we need to round it
		score = Math.round(score * 100) / 100;
		document.getElementById('score').innerHTML = score;
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
