(function($M, jq) {

	var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','!','.',' '],

		stringCryptSubmit = document.getElementById('crypt'),
		stringDecryptSubmit = document.getElementById('decrypt'),
		generateKeySubmit = document.getElementById('generate'),
		showMatrixFormSubmit = document.getElementById('show-matrix-form'),
		getKeySubmit = document.getElementById('get-key'),

		decryptMatrixForm = document.getElementById('matrix-form'),
		cryptOutput = document.getElementById('crypt-result'),
		decryptOut = document.getElementById('decrypt-result'),

		size = document.getElementById('matrix-size'),
		decryptSize = document.getElementById('matrix-decrypt-size'),

		openTextInput = document.getElementById('part-open'),
		closedTextInput = document.getElementById('part-closed'),
		foundKeyPlace = document.getElementById('found-Key'), 

		keyCrypt = document.getElementById('key-place'),
		keyDecrypt = document.getElementById('decrypt-key'),
		keyMatrix;


	stringCryptSubmit.onclick = crypt;
	generateKeySubmit.onclick = showKeyMatrix;
	showMatrixFormSubmit.onclick = generateMatrixForm;
	stringDecryptSubmit.onclick = decrypt;
	getKeySubmit.onclick = getKey;

	openTextInput.oninput = function() { document.getElementById('part-open-count').innerHTML = openTextInput.value.length; }
	closedTextInput.oninput = function() { document.getElementById('part-closed-count').innerHTML = closedTextInput.value.length; }

	// Mod bug fix
	function mod(n, m) {
		return ((n % m) + m) % m;
	}

	function showKeyMatrix() {
		jq(keyCrypt).empty();
		keyMatrix = generateKeyMatrix(size.value);

		for(var i = 0; i < size.value; i++) {
			for(var j = 0; j < size.value; j++)
				jq(keyCrypt).append(keyMatrix[i][j] + ' ');
			jq(keyCrypt).append('<br>');
		}
	}

	function showFoundKey(container, matrix) {
		var len = matrix[0].length;

		jq(container).empty();

		for(var i = 0; i < len; i++) {
			for(var j = 0; j < len; j++)
				jq(container).append(matrix[i][j] + ' ');
			jq(container).append('<br>');
		}
	}

	function generateMatrixForm() {

		var iter = 0;
		jq(decryptMatrixForm).empty();

		for(var i = 0; i < decryptSize.value; i++) {
			for(var j = 0; j < decryptSize.value; j++) {
				iter++;
				jq(decryptMatrixForm).append('<div class="col-sm-' + (12 / decryptSize.value) + '"><input id="inp-' + iter + '" >');
			}
		}

	}

	function clearText(text) {
		var newText = '';

		for(var i = 0; i < text.length; i++)
			for(var j = 0; j < alphabet.length; j++)
				if(text[i] === alphabet[j]) newText += text[i];

		return newText;
	}

	function getAlphabetNum(letter) {
		for(var i = 0; i < alphabet.length; i++)
			if(alphabet[i] == letter) return i;
	}

	function getAlphabetLetter(num) {
		for(var i = 0; i < alphabet.length; i++)
			if(i == num) return alphabet[i];
	}

	function getKeyInForm(elem, n) {

		var matrix = [],
			iter = 0,
			inputs = jq(elem).children();

		for(var i = 0; i < n; i++) {
			matrix[i] = [];
			for(var j = 0; j < n; j++) {
				matrix[i][j] = inputs[iter].children[0].value;
				iter++;
			}
		}

		return matrix;
	}

	function generateKeyMatrix(n) {

		var matrix = [],
			matr;

		do {

			for(var i = 0; i < n; i++) {
				matrix[i] = [];
				for(var j = 0; j < n; j++)
					matrix[i][j] = Math.round(Math.random() * 26);
			}

			matr = $M(matrix);

		} while(Math.round(matr.determinant()) != 1);

		return matrix;
	}

	function sliceText(text, n) {
		var blocks = [],
			firstBlock = [],
			len,
			plainText = text,
			blocksCount;

		plainText = clearText(text);
		len = plainText.length;

		while(len % n != 0) {
			plainText += 'x';
			len++;
		}

		blocksCount = len / n;

		for(var i = 0; i < len; i++) {
			firstBlock.push(getAlphabetNum(plainText[i]));
			if((i + 1) % n == 0 && i != 0) {
				blocks.push(firstBlock);
				firstBlock = [];
			}
		}

		return blocks;
	}


	function transposeMatrix(matrix) {

		var m = matrix.length,
			trm = new Array(m);

		for(var i = 0; i < m; i++)
			trm[i] = new Array(m);

		for (var i = 0; i < m; i++) {
			for (var j = 0; j < m; j++)
				trm[j][i] = matrix[i][j];
		}

		return trm;
	}


	function inverseByMod(matrix, det) {

		var m = matrix.length,
			result = new Array(m);

		for(var i = 0; i < m; i++)
			result[i] = new Array(m);

		var limit = 65536;

		for (var i = 0; i < m; i++) {
			for (var j = 0; j < m; j++) {
				result[i][j] = limit;
				for (var k = 0; k < limit; k++) {
					if (((matrix[i][j] + k * alphabet.length) < 0) || mod(matrix[i][j] + k * alphabet.length, det) != 0) continue;
					result[i][j] = mod((matrix[i][j] + k * alphabet.length) / det, alphabet.length);
					break;
				}
				if (k == limit && result[i][j] == limit) return null;
			}
		}
		return result;
	}


	function getMinor(matrix, p, q) {

		var m = matrix[0].length;

		if (p >= m || q >= m) return 65536;

		var minor = new Array(m - 1),
			sign;

		for(var i = 0; i < m - 1; i++)
			minor[i] = new Array(m - 1);

		for (var j = 0; j < q; j++) {
			for (var i = 0; i < p; i++)
				minor[i][j] = matrix[i][j];
			for (var i = p + 1; i < m; i++)
				minor[i - 1][j] = matrix[i][j];
		}
		for (var j = q + 1; j < m; j++) {
			for (var i = 0; i < p; i++) {
				minor[i][j - 1] = matrix[i][j];
			}
			for (var i = p + 1; i < m; i++)
				minor[i - 1][j - 1] = matrix[i][j];
		}

		if (mod((p + q), 2) == 0) sign = 1;
		else sign = -1;

		return sign * $M(minor).determinant();
	}


	function inverseMatrix(matrix) {

		var det = Math.round($M(matrix).determinant()),
			m = matrix[0].length,
			inv = [];

		if(det == 0) {
			alert('Determinant equals 0');
			return false;
		}

		for (var i = 0; i < m; i++) {
			inv[i] = [];
			for (var j = 0; j < m; j++)
				inv[i][j] = Math.round(getMinor(matrix, i, j));
		}
		inv = transposeMatrix(inv);
		inv = inverseByMod(inv, det);

		return inv;
	}


	function getKey() {

		var openText = document.getElementById('part-open').value.toLowerCase() || '',
			closedText = document.getElementById('part-closed').value.toLowerCase() || '',
			keySize = decryptSize.value,
			openTextMatrix = [],
			closedTextMatrix = [],
			iter = 0,
			key = [];

		if(openText.length != 0 || closedText.length != 0) {

			for(var i = 0; i < keySize; i++) {

				openTextMatrix[i] = [];
				closedTextMatrix[i] = [];

				for (var j = 0; j < keySize; j++) {
					openTextMatrix[i][j] = getAlphabetNum(openText[iter]);
					closedTextMatrix[i][j] = getAlphabetNum(closedText[iter]);
					iter++;
				};
			}
		}

		openTextMatrix = inverseMatrix(openTextMatrix);

		if (openTextMatrix == null) alert('Обратная матрица не может быть найдена');

		for (var i = 0; i < keySize; i++) {
			key[i] = [];
			for (var j = 0; j < keySize; j++) {
				key[i][j] = 0;
				for (var k = 0; k < keySize; k++)
					key[i][j] += (openTextMatrix[i][k] * closedTextMatrix[k][j]);

				key[i][j] = key[i][j] % alphabet.length;
			}
		}

		showFoundKey(foundKeyPlace, transposeMatrix(key));
	}


	function crypt() {

		var openText = document.getElementById('crypt-string').value,
			cryptedText = '';

		var slicedText = sliceText(openText.toLowerCase(), size.value),
			matr = $M(keyMatrix);

		for(var i = 0; i < slicedText.length; i++) {

			var block = $M(slicedText[i]),
				tmpBlock = matr.multiply(block);

			for(var j = 0; j < size.value; j++)
				cryptedText += getAlphabetLetter(mod(tmpBlock.elements[j], alphabet.length));
		}

		cryptOutput.innerHTML = cryptedText;
	}


	function decrypt() {

		var cryptedText = document.getElementById('decrypt-string').value,
			key = $M(getKeyInForm(decryptMatrixForm, decryptSize.value)).inverse();

			decryptText = '';

		var slicedText = sliceText(cryptedText.toLowerCase(), decryptSize.value);

		for(var i = 0; i < slicedText.length; i++) {

			var block = $M(slicedText[i]),
				tmpBlock = key.multiply(block);

			for(var j = 0; j < decryptSize.value; j++)
				decryptText += getAlphabetLetter( mod( Math.round(tmpBlock.elements[j] ), alphabet.length) );
		}

		decryptOut.innerHTML = decryptText;
	}



})($M, jQuery);