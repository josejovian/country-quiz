var countryJSON = [];

export async function processData(callback, rawData) {
	rawData = rawData.replace('[{', '');
	rawData = rawData.replace('}]', '');
	let tempData = rawData.split('},{');

	countryJSON.splice(0, countryJSON.length);

	for(var i = 0; i < tempData.length; i++) {
		let tempString = '{' + tempData[i] + '}';
		countryJSON.push(JSON.parse(tempString));
	}

	console.log("Done processing data!");
	console.log(countryJSON);
	localStorage.setItem("countryJSON", JSON.stringify(countryJSON));

	return callback(countryJSON);
}

export async function getData(callback) {
	// https://github.com/mdn/js-examples/blob/master/promises-test/index.html

	let prom = new Promise(function(reso, reje) {
		let req = new XMLHttpRequest();
		req.open('GET', 'https://restcountries.com/v2/all?fields=name,capital,flag');
		req.onload = function() {
			if (req.status === 200) {
				reso(req.response);
			} else {
				reje(new Error('Data could not be obtained. Error code: ' + req.statusText));
			}
		};
		req.send();
	});

	return processData(callback, await prom);
}