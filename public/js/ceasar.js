(function($) {

	var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',' '],
		engFreqHash = {
			a: 0.0626, 
			b: 0.0150, 
			c: 0.0239, 
			d: 0.0280, 
			e: 0.0930, 
			f: 0.0199, 
			g: 0.0163, 
			h: 0.0428, 
			i: 0.0696, 
			j: 0.0011, 
			k: 0.0067, 
			l: 0.0324, 
			m: 0.0185, 
			n: 0.0526, 
			o: 0.0567, 
			p: 0.0135, 
			q: 0.0010, 
			r: 0.0462, 
			s: 0.0485, 
			t: 0.0747, 
			u: 0.0209, 
			v: 0.0076, 
			w: 0.0177, 
			x: 0.0015, 
			y: 0.0144, 
			z: 0.0002, 
			' ': 0.1743
		},
		stringCryptSubmit = document.getElementById('crypt'),
		stringDecryptSubmit = document.getElementById('decrypt'),
		cryptOutput = document.getElementById('crypt-result'),
		trueKey = document.getElementById('true-key'),
		decryptOut = document.getElementById('decrypt-result');

	stringCryptSubmit.onclick = crypt;
	stringDecryptSubmit.onclick = showDecryptResult;
	document.getElementById('check-key').onclick = checkKey;
	document.getElementById('crypt-string').oninput = inputOnChange;
	document.getElementById('decrypt-string').oninput = inputOnChange;


	// Modulo bug fix
	function mod(n, m) {
		return ((n % m) + m) % m;
	}


	function buildFreqHash(string) {

		var symbolHash = {},
			freqHash = {},
			len = string.length;

		for(var i = 0; i < len; i += 1) {

			if(!(string[i] in symbolHash))
				symbolHash[string[i]] = 1;
			else
				symbolHash[string[i]] += 1;
		}

		for(var j = 0; j < alphabet.length; j += 1) {

			if(symbolHash.hasOwnProperty(alphabet[j]))
				freqHash[alphabet[j]] = (symbolHash[alphabet[j]] / len).toFixed(4);
		}

		return freqHash;
	}


	function checkKey() {

		var element = document.getElementById('decrypt-string').value.toLowerCase(),
			symbolHash = {},
			freqHash = {},
			sumHash = {},
			max = 0,
			finalKey,
			len = element.length;


		for(var k = 1; k < alphabet.length; k += 1) {

			var sum = 0,
				decryptedStr = decrypt(k),
				decryptedStrHash = buildFreqHash(decryptedStr);

			for(var sym in engFreqHash) {
				for(var sym2 in decryptedStrHash) {
					if(sym == sym2)
						sum += parseFloat(engFreqHash[sym] * decryptedStrHash[sym2]);
				}
			}

			sumHash[k] = sum;
		}

		Object.keys(sumHash).forEach(function(i) {
			if(sumHash[i] > max) max = sumHash[i];
		});

		for(var key in sumHash) {
			if(sumHash[key] == max) finalKey = key;
		}

		trueKey.innerHTML = 'Key = ' + finalKey;
	}


	function inputOnChange(e) {

		var element;

		if(e.target.id == 'crypt-string')
			element = document.getElementById('crypt-string').value.toLowerCase();
		else
			element = document.getElementById('decrypt-string').value.toLowerCase();

		symbolHash = {},
		symbolElem = document.getElementById('symbol'),
		alphSymbolElem 	= document.getElementById('alphSymbol');

		while (symbolElem.firstChild) {
			symbolElem.removeChild(symbolElem.firstChild);
		}

		while(alphSymbolElem.firstChild) {
			alphSymbolElem.removeChild(alphSymbolElem.firstChild);
		}

		for(var i = 0, len = element.length; i < len; i += 1) {

			if(!(element[i] in symbolHash))
				symbolHash[element[i]] = 1;

			else
				symbolHash[element[i]] += 1;
		}

		populateModal(symbolElem, rebuildSymbolHash(symbolHash), element);
	}


	function sortEngHashByFreq() {

		var newHash = {},
			hashArr = [];

		for(var sym in engFreqHash) {

			for(var i = 0; i < alphabet.length; i += 1) {

				if(sym == alphabet[i]) {

					hashArr.push([sym, engFreqHash[sym]]);
					hashArr.sort(function(a, b) { return a[1] - b[1]; });
				}
			}
		}

		hashArr.reverse();

		for(var i = 0; i < hashArr.length; i += 1)
			newHash[hashArr[i][0]] = hashArr[i][1];

		return newHash;
	}


	function rebuildSymbolHash(hash) {

		var newHash = {},
			hashArr = [];

		for(var sym in hash) {

			for(var i = 0; i < alphabet.length; i += 1) {

				if(sym == alphabet[i]) {

					hashArr.push([sym, hash[sym]]);
					hashArr.sort(function(a, b) { return a[1] - b[1]; });
				}
			}
		}

		hashArr.reverse();

		for(var i = 0; i < hashArr.length; i += 1)
			newHash[hashArr[i][0]] = hashArr[i][1];

		return newHash;
	}


	function populateModal(symbolElem, symbolHash, string) {

		var alphTable = document.getElementById('alphSymbol'),
			symArrLen = Object.keys(symbolHash).length,
			newAlphHash = sortEngHashByFreq();
			alphIter = 0;


		for(var sym in newAlphHash) {

			alphIter++;

			var table = document.createElement('tr'),
				symbol = document.createElement('td'),
				freq = document.createElement('td');

			if(sym == " ")
				symbol.innerHTML = "space";
			else
				symbol.innerHTML = sym;

			freq.innerHTML = newAlphHash[sym].toFixed(4);

			alphTable.appendChild(table);
			table.appendChild(symbol);
			table.appendChild(freq);

			if(alphIter == symArrLen)
				break;
		}


		for(var sym in symbolHash) {

			var table = document.createElement('tr'),
				symbol = document.createElement('td'),
				quantity = document.createElement('td'),
				freq = document.createElement('td');

			if(sym == " ")
				symbol.innerHTML = "space";
			else
				symbol.innerHTML = sym;

			quantity.innerHTML = symbolHash[sym];

			freq.innerHTML = (symbolHash[sym] / string.length).toFixed(4);


			symbolElem.appendChild(table);
			table.appendChild(symbol);
			table.appendChild(quantity);
			table.appendChild(freq);
		}
	}


	function crypt() {

		var cryptedString 	= [],
			symbolHash 		= {},
			qwe 			= 0,
			key 			= document.getElementById('crypt-key').value,
			stringForCrypt 	= document.getElementById('crypt-string').value.toLowerCase(),
			symbolElem 		= document.getElementById('symbol'),
			alphSymbolElem 	= document.getElementById('alphSymbol');

		while (symbolElem.firstChild) {
			symbolElem.removeChild(symbolElem.firstChild);
		}

		for(var i = 0, len = stringForCrypt.length; i < len; i += 1) {
			for(var j = 0, len2 = alphabet.length; j < len2; j += 1) {

				if(stringForCrypt[i] == alphabet[j])
					cryptedString += alphabet[(j + +key) % alphabet.length];
			}

			if(!(stringForCrypt[i] in symbolHash))
				symbolHash[stringForCrypt[i]] = 1;

			else
				symbolHash[stringForCrypt[i]] += 1;
		}

		populateModal(symbolElem, rebuildSymbolHash(symbolHash), stringForCrypt);

		cryptOutput.innerHTML = cryptedString;
	}


	function decrypt(ke) {

		var decryptedString 	= '',
			symbolHash 			= {},
			key 				= document.getElementById('decrypt-key').value,
			stringForDecrypt 	= document.getElementById('decrypt-string').value,
			symbolElem 			= document.getElementById('symbol');

		if(key == '' && ke)
			key = ke;

		while (symbolElem.firstChild) {
			symbolElem.removeChild(symbolElem.firstChild);
		}

		for(var i = 0, len = stringForDecrypt.length; i < len; i += 1) {
			for(var j = 0, len2 = alphabet.length; j < len2; j += 1) {

				if(stringForDecrypt[i] == alphabet[j])
					decryptedString += alphabet[ mod( (j - key), alphabet.length )];
			}

			if(!(stringForDecrypt[i] in symbolHash))
				symbolHash[stringForDecrypt[i]] = 1;

			else
				symbolHash[stringForDecrypt[i]] += 1;
		}

		populateModal(symbolElem, rebuildSymbolHash(symbolHash), stringForDecrypt);

		return decryptedString;
	}


	function showDecryptResult() {

		var decryptedString = decrypt();
		decryptOut.innerHTML = decryptedString;
	}


	function upload() {}





})(jQuery);