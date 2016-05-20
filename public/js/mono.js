(function() {

	var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',' '],
		altAlph =  ['q','w','e','r','t','y','u','i','o','p',' ','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'],
		stringCryptSubmit = document.getElementById('crypt'),
		stringDecryptSubmit = document.getElementById('decrypt'),
		cryptOutput = document.getElementById('crypt-result'),
		decryptOut = document.getElementById('decrypt-result');


	stringCryptSubmit.onclick = crypt;
	stringDecryptSubmit.onclick = decrypt;


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


	function crypt() {

		var cryptedString 	= '',
			symbolHash 		= {},
			stringForCrypt 	= document.getElementById('crypt-string').value.toLowerCase(),
			symbolElem 		= document.getElementById('symbol');

		while (symbolElem.firstChild) {
			symbolElem.removeChild(symbolElem.firstChild);
		}

		for(var i = 0, len = stringForCrypt.length; i < len; i += 1) {
			for(var j = 0, len2 = altAlph.length; j < len; j += 1) {

				if(stringForCrypt[i] == alphabet[j]) {

					cryptedString += altAlph[j];
					break;
				}
			}

			// if(!(stringForCrypt[i] in symbolHash))
			// 	symbolHash[stringForCrypt[i]] = 1;

			// else
			// 	symbolHash[stringForCrypt[i]] += 1;
		}

		// populateModal(symbolElem, rebuildSymbolHash(symbolHash));

		cryptOutput.innerHTML = cryptedString;
	}


	function decrypt() {

		var decryptedString 	= '',
			symbolHash 			= {},
			stringForDecrypt 	= document.getElementById('decrypt-string').value,
			symbolElem 			= document.getElementById('symbol');

		while (symbolElem.firstChild) {
			symbolElem.removeChild(symbolElem.firstChild);
		}

		for(var i = 0, len = stringForDecrypt.length; i < len; i += 1) {
			for(var j = 0, len2 = alphabet.length; i < len; j += 1) {

				if(stringForDecrypt[i] == altAlph[j]) {

					decryptedString += alphabet[j];
					break;
				}
			}

			// if(!(stringForDecrypt[i] in symbolHash))
			// 	symbolHash[stringForDecrypt[i]] = 1;

			// else
			// 	symbolHash[stringForDecrypt[i]] += 1;
		}

		// populateModal(symbolElem, rebuildSymbolHash(symbolHash));

		decryptOut.innerHTML = decryptedString;
	}

})();