import Question from './Question.js';

var countryJSON = [];
var initialized = 0;

function getRandomCountry() {
	let randomCountry = parseInt(parseInt(1 + Math.random() * 1000) % countryJSON.length);
	return countryJSON[randomCountry];
}

function getType() {
	let currentType = parseInt(Math.random() * 100) % 2;
	return currentType;
}

function getChoice() {
	// let choice = ['a', 'b', 'c', 'd'];
	let currentType = parseInt(Math.random() * 100) % 4;
	return currentType;
}

function getQuestion() {

	let questionType = getType();
	let country = getRandomCountry();

	let question;
	let thumbnail;
	let answers = ['a', 'b', 'c', 'd'];
	let correct = getChoice();

	if(questionType === 1) {
		question = 'Which country does this flag belong to?';
		thumbnail = country['flag'];
		answers[correct] = country['name'];
	} else {
		question = country['capital'] + ' is the capital of';
		answers[correct] = country['name'];
	}

	for(var i = 0; i < 4; i++) {
		if(i !== correct) {
			let wrongAnswer = getRandomCountry();
			while(wrongAnswer === country) {
				wrongAnswer = getRandomCountry();
			}
			answers[i] = wrongAnswer['name'];
		}
	}

	return new Question(question, questionType, answers, thumbnail, correct);
}

function initialize(rawData) {

	if(initialized === 0) {
		rawData = rawData.replace('[{', '');
		rawData = rawData.replace('}]', '');
		let tempData = rawData.split('},{');

		countryJSON.splice(0, countryJSON.length);

		for(var i = 0; i < tempData.length; i++) {
			let tempString = '{' + tempData[i] + '}';
			countryJSON.push(JSON.parse(tempString));
		}

		initialized++;
	}
	return getQuestion();
}

async function getData() {

	// https://github.com/mdn/js-examples/blob/master/promises-test/index.html

	let prom = new Promise(function(reso, reje) {
		let req = new XMLHttpRequest();
		req.open('GET', 'https://restcountries.eu/rest/v2/all?fields=name;capital;flag');
		req.onload = function() {
			if (req.status === 200) {
				reso(req.response);
			} else {
				reje(new Error('Data could not be obtained. Error code: ' + req.statusText));
			}
		};
		req.send();
	});

	return initialize(await prom);
}

export default getData;