(function() {

	var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
		stringCryptSubmit = document.getElementById('crypt'),
		stringDecryptSubmit = document.getElementById('decrypt'),
		cryptOutput = document.getElementById('crypt-result'),
		decryptOut = document.getElementById('decrypt-result'),
		hashSubmit = document.getElementById('hash-btn'),
		alphLen = alphabet.length,
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

		cryptHash.j = 0;

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

			labels: alphabet,
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


	function mod(n, m) {
		return ((n % m) + m) % m;
	}


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


	function checkLetter(table, letter) {
		for(var i = 0; i < table.length; i += 1) {
			if(table[i] == letter.toLowerCase())
				return true;
		}
		return false;
	}


	function buildTable(key) {

		var newWSK = '',
			newkey,
			table = [],
			tab = [],
			iter = 0;

		for(var i = 0; i < key.length; i += 1)
			if(key[i] != ' ') newWSK += key[i];

		var newkey = newWSK.split('').reverse().filter(function (e, i, arr) {
			return arr.lastIndexOf(e) === i;
		}).reverse().join('');

		for(var i = 0; i < newkey.length; i += 1)
			tab.push(newkey[i]);

		for(var i = 0; i < alphabet.length; i += 1) {
			if(!checkLetter(tab, alphabet[i]) && alphabet[i] != 'j')
				tab.push(alphabet[i]);
		}

		for(var i = 0; i < 5; i += 1) {
			var row = [];
			for(var j = 0; j < 5; j += 1) {
				row.push(tab[iter]);
				iter++;
			}
			table.push(row);
		}

		return table;
	}


	function getPosition(letter1, letter2, table) {

		var position = {};
			position.first = {},
			position.second = {};

		for(var i = 0; i < 5; i += 1) {
			for(var j = 0; j < 5; j += 1) {
				if(letter1 == table[i][j]) {
					position.first.i = i;
					position.first.j = j;
				}
				if(letter2 == table[i][j]) {
					position.second.i = i;
					position.second.j = j;
				}
			}
		}

		return position;
	}


	function crypt() {

		var cryptedString 	= '',
			key 			= document.getElementById('crypt-key').value,
			stringForCrypt 	= document.getElementById('crypt-string').value.toLowerCase(),
			table 			= buildTable(key),
			cleanSFC 		= '',
			cleanSFCLen 	= 0;

		String.prototype.splice = function(idx, rem, str) {
			return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
		}

		for(var i = 0; i < stringForCrypt.length; i += 1) {
			if(checkLetter(alphabet, stringForCrypt[i])) cleanSFC += stringForCrypt[i].toLowerCase();
		}

		cleanSFCLen = cleanSFC.length;

		if(cleanSFCLen % 2 != 0) cleanSFC += 'x';

		for(var i = 0; i < cleanSFCLen; i += 1) {

			if(i % 2 == 0) {

				var position;

				if(cleanSFC[i] == cleanSFC[i + 1]) {
					cleanSFC = cleanSFC.splice(i + 1, 0, 'x');
					cleanSFCLen += 1;
				}

				position = getPosition(cleanSFC[i], cleanSFC[i + 1], table);

				if(position.first.i == position.second.i)
					cryptedString += (table[position.first.i][mod((position.first.j + 1), 5)] + table[position.second.i][mod((position.second.j + 1), 5)]);

				if(position.first.j == position.second.j)
					cryptedString += (table[mod((position.first.i + 1), 5)][position.first.j] + table[mod((position.second.i + 1), 5)][(position.second.j)]);

				if(position.first.j < position.second.j && position.first.i != position.second.i)
					cryptedString += (table[position.first.i][position.second.j] + table[position.second.i][position.first.j]);

				if(position.first.j > position.second.j && position.first.i != position.second.i)
					cryptedString += (table[position.first.i][position.second.j] + table[position.second.i][position.first.j]);
			}
		}

		cryptOutput.innerHTML = cryptedString;
	}


	function decrypt() {

		var decryptedString 	= '',
			key 				= document.getElementById('decrypt-key').value,
			stringForDecrypt 	= document.getElementById('decrypt-string').value.toLowerCase(),
			table 				= buildTable(key),
			cleanSFD 			= '';

		cryptHash = buildFreqHash(stringForDecrypt);


		for(var i = 0; i < stringForDecrypt.length; i += 1)
			if(stringForDecrypt[i] != ' ') cleanSFD += stringForDecrypt[i];

		for(var i = 0; i < cleanSFD.length; i += 1) {

			if(i % 2 == 0) {
				var position = getPosition(cleanSFD[i], cleanSFD[i + 1], table);

				if(position.first.i == position.second.i)
					decryptedString += (table[position.first.i][mod((position.first.j - 1), 5)] + table[position.second.i][mod((position.second.j - 1), 5)]);

				if(position.first.j == position.second.j)
					decryptedString += (table[mod((position.first.i - 1), 5)][(position.first.j)] + table[mod((position.second.i - 1), 5)][(position.second.j)]);

				if(position.first.j < position.second.j && position.first.i != position.second.i)
					decryptedString += (table[position.first.i][position.second.j] + table[position.second.i][position.first.j]);

				if(position.first.j > position.second.j && position.first.i != position.second.i)
					decryptedString += (table[position.first.i][position.second.j] + table[position.second.i][position.first.j]);
			}
		}

		decryptOut.innerHTML = decryptedString;
	}

})();