(function() {

	var drawBtn = document.getElementById('draw-btn'),
		id = 1,
		container = document.getElementById('graph-cont');

	drawBtn.onclick = newChart;



	function newChart() {

		var canvas = document.createElement('canvas');
		var titleInCont = document.createElement('h3');
		var textHash = document.getElementById("hash").value,
			title = document.getElementById("title").value,
			hash = JSON.parse(textHash),
			letterNum = [];

		var sortedObj = sortObject(hash);
		var labelKeys = Object.keys(sortedObj);

		for(var i = 0; i < labelKeys.length; i += 1)
			if(labelKeys[i] == ' ') labelKeys.splice(i, 1);

		for(var i = 0; i < labelKeys.length; i += 1)
			letterNum.push(hash[labelKeys[i]]);


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

		titleInCont.innerHTML = title;

		canvas.id = 'canvas-' + id++;
		canvas.width = 800;
		canvas.height = 200;
		container.appendChild(titleInCont);
		container.appendChild(canvas);

		var can = document.getElementById('canvas-' + id);
		var ctx = canvas.getContext("2d");


		var newChart = new Chart(ctx).Bar({

			labels: labelKeys,
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

		document.getElementById("hash").value = '';
		document.getElementById("title").value = '';
	}

})();