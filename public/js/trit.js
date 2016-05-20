(function() {


	// var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',' ',',','.','!','?','"',':',';','\'','/','\\','(',')','[',']','{','}','1','2','3','4','5','6','7','8','9','0'],
	var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',' '],
		stringCryptSubmit = document.getElementById('crypt'),
		stringDecryptSubmit = document.getElementById('decrypt'),
		hashSubmit = document.getElementById('hash-btn'),
		cryptOutput = document.getElementById('crypt-result'),
		decryptOut = document.getElementById('decrypt-result'),
		cryptHash;


	stringCryptSubmit.onclick = crypt;
	stringDecryptSubmit.onclick = decrypt;
	hashSubmit.onclick = getHash;


	// Modulo bug fix
	function mod(n, m) {
		return ((n % m) + m) % m;
	}


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


	function rebuildSymbolHash(hash) {

		var newHash = {},
			hashArr = [];

		for(var sym in hash) {

			hashArr.push([sym, hash[sym]]);

			hashArr.sort(function(a, b) { return a[1] - b[1]; });
		}

		hashArr.reverse();

		for(var i = 0; i < hashArr.length; i += 1)
			newHash[hashArr[i][0]] = hashArr[i][1];

		return newHash;
	}


	function populateModal(symbolElem, symbolHash) {

		for(var sym in symbolHash) {

			var elem = document.createElement('li');
			elem.className = "list-group-item";

			if(sym == " ")
				elem.innerHTML = "space";
			else
				elem.innerHTML = sym;

			var quantity = document.createElement('span');
			quantity.className = 'badge';
			quantity.innerHTML = symbolHash[sym];

			elem.appendChild(quantity);
			symbolElem.appendChild(elem);
		}
	}


	function checkLetter(table, letter) {
		for(var i = 0; i < table.length; i += 1) {
			if(table[i] == letter.toLowerCase())
				return true;
		}
		return false;
	}


	function keyAllLength(key, stringForCrypt) {

		var newKey = key,
			freePlace;

		while(stringForCrypt.length != newKey.length) {

			if(stringForCrypt.length - newKey.length >= key.length) {

				newKey += key;
			}
			if(stringForCrypt.length - newKey.length < key.length && stringForCrypt.length - newKey.length != 0) {
				freePlace = stringForCrypt.length - newKey.length;
				newKey += key.substr(0, freePlace);
				break;
			}
		}

		return newKey;
	}


	function crypt() {

		var cryptedString 	= '',
			keyInCodes 		= [],
			symbolHash 		= {},
			key 			= document.getElementById('crypt-key').value,
			stringForCrypt 	= document.getElementById('crypt-string').value.toLowerCase(),
			symbolElem 		= document.getElementById('symbol'),
			cleanSFC 		= '',
			newKey;

		for(var i = 0; i < stringForCrypt.length; i += 1) {
			if(checkLetter(alphabet, stringForCrypt[i])) cleanSFC += stringForCrypt[i].toLowerCase();
		}

		newKey = keyAllLength(key, cleanSFC);

		for(var i = 0, len = newKey.length; i < len; i += 1) {
			for(var j = 0, len2 = alphabet.length; j < len2; j += 1) {

				if(newKey[i] == alphabet[j])
					keyInCodes.push(j);
			}
		}

		for(var i = 0, len = cleanSFC.length; i < len; i += 1) {
			for(var j = 0, len2 = alphabet.length; j < len2; j += 1) {

				if(cleanSFC[i] == alphabet[j]) {

					cryptedString += alphabet[(j + +keyInCodes[i]) % alphabet.length];
				}
			}
		}

		populateModal(symbolElem, rebuildSymbolHash(symbolHash));

		cryptOutput.innerHTML = cryptedString;
	}


	function decrypt() {

		var decryptedString 	= '',
			keyInCodes 			= [],
			symbolHash 			= {},
			key 				= document.getElementById('decrypt-key').value,
			stringForDecrypt 	= document.getElementById('decrypt-string').value,
			symbolElem 			= document.getElementById('symbol');

		cryptHash = buildFreqHash(stringForDecrypt);

		newKey = keyAllLength(key, stringForDecrypt);

		for(var i = 0, len = newKey.length; i < len; i += 1) {
			for(var j = 0, len2 = alphabet.length; j < len2; j += 1) {

				if(newKey[i] == alphabet[j])
					keyInCodes.push(j);
			}
		}

		for(var i = 0, len = stringForDecrypt.length; i < len; i += 1) {
			for(var j = 0, len2 = alphabet.length; j < len2; j += 1) {

				if(stringForDecrypt[i] == alphabet[j]) {

					decryptedString += alphabet[ mod( (j - keyInCodes[i]), alphabet.length )];
				}
			}
		}

		populateModal(symbolElem, rebuildSymbolHash(symbolHash));

		decryptOut.innerHTML = decryptedString;
	}


})();