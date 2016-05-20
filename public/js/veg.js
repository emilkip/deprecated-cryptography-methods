(function() {

	var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',' '],
		stringCryptSubmit = document.getElementById('crypt'),
		stringDecryptSubmit = document.getElementById('decrypt'),
		cryptOutput = document.getElementById('crypt-result'),
		decryptOut = document.getElementById('decrypt-result'),
		fullKey = document.getElementById('full-key'),
		hashSubmit = document.getElementById('hash-btn'),
		alphLen = alphabet.length,
		tabulaRecta = [],
		cryptHash;


	stringCryptSubmit.onclick = crypt;
	stringDecryptSubmit.onclick = decrypt;
	hashSubmit.onclick = getHash;


	$('#modal').on('shown.bs.modal', function (event) {

		var canvas = document.getElementById("graph");
		var ctx = canvas.getContext("2d");
		var letterNum = [];

		canvas.width  = 850;
		canvas.height = 500;

		delete cryptHash[' '];

		var sortedObj = sortObject(cryptHash);

		var labels = Object.keys(sortedObj);

		for(var i = 0; i < labels.length; i += 1) {
			letterNum.push(sortedObj[labels[i]]);
		}

		function sortObject(obj) {
			var arr = [];
			var sortedHash = {};
			var prop;
			for (prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					arr.push({
						'key': prop,
						'value': obj[prop]
					});
				}
			}
			arr.sort(function(a, b) {
				return b.value - a.value;
			});

			for(var i = 0; i < arr.length; i += 1)
				sortedHash[arr[i].key] = arr[i].value;

			return sortedHash;
		}

		window.newChart = new Chart(ctx).Bar({

			labels: labels,
				datasets: [
					{
						label: "Chart",
						fillColor: "#C5D1FF",
						strokeColor: "rgba(106,151,220,0.5)",
						pointColor: "rgba(106,151,220,0.9)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: letterNum
					}
				]
		});
	});


	function getHash() {
		var decryptHash = document.getElementById('decrypt-hash');

		decryptHash.innerHTML = JSON.stringify(cryptHash);
	}


	function getTabulaRecta() {

		for(var i = 0, len = alphLen; i < len; i += 1) {

			tabulaRecta[i] = [];

			for(var j = 0, len2 = alphLen; j < len2; j += 1)
				tabulaRecta[i][j] = alphabet[(j + i) % alphLen];
		}

		return tabulaRecta;
	}


	function buildFreqHash(string) {

		var symbolHash = {},
			len = string.length;

		for(var i = 0; i < len; i += 1) {

			if(!(string[i] in symbolHash))
				symbolHash[string[i]] = 1;
			else
				symbolHash[string[i]] += 1;
		}

		return symbolHash;
	}


	function getFullKey(string, key) {

		var freePlace,
			newKey = key;

		while(string.length != newKey.length) {

			if(string.length - newKey.length >= key.length) newKey += key;

			if(string.length - newKey.length < key.length && string.length - newKey.length != 0) {
				freePlace = string.length - newKey.length;
				newKey += key.substr(0, freePlace);
				break;
			}
		}

		return newKey;
	}


	function checkLetter(table, letter) {
		for(var i = 0; i < table.length; i += 1) {
			if(table[i] == letter.toLowerCase())
				return true;
		}
		return false;
	}


	function crypt() {

		var cryptedString 	= '',
			key 			= document.getElementById('crypt-key').value,
			stringForCrypt 	= document.getElementById('crypt-string').value.toLowerCase(),
			tabulaRecta 	= getTabulaRecta(),
			keyInCode 		= [],
			stringInCode 	= [],
			cleanSFC 		= '',
			newKey;


		for(var i = 0; i < stringForCrypt.length; i += 1) {
			if(checkLetter(alphabet, stringForCrypt[i]))
				cleanSFC += stringForCrypt[i];
		}

		newKey = getFullKey(cleanSFC, key),
		console.log(cleanSFC);

		for(var i = 0; i < newKey.length; i += 1) {
			for(var j = 0; j < alphLen; j += 1) {
				if(newKey[i] == alphabet[j]) keyInCode.push(j);
				if(cleanSFC[i] == alphabet[j]) stringInCode.push(j);
			}
		}

		for(var k = 0; k < newKey.length; k += 1) {
			cryptedString += tabulaRecta[keyInCode[k]][stringInCode[k]];
		}

		cryptOutput.innerHTML = cryptedString;
	}


	function decrypt() {

		var decryptedString 	= '',
			key 				= document.getElementById('decrypt-key').value,
			stringForDecrypt 	= document.getElementById('decrypt-string').value,
			tabulaRecta 		= getTabulaRecta(),
			newKey 				= getFullKey(stringForDecrypt, key),
			keyInCode 			= [];

		cryptHash = buildFreqHash(stringForDecrypt);

		for(var i = 0; i < newKey.length; i += 1) {
			for(var j = 0; j < alphLen; j += 1) {
				if(newKey[i] == alphabet[j]) keyInCode.push(j);
			}
		}

		for(var i = 0; i < stringForDecrypt.length; i += 1) {
			for(var j = 0; j < alphLen; j += 1) {
				if(tabulaRecta[keyInCode[i]][j] == stringForDecrypt[i]) {

					decryptedString += alphabet[j];
				}
			}
		}

		decryptOut.innerHTML = decryptedString;
	}

})();