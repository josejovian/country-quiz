import React, { useState } from 'react';

import getData from './Data.js';
import Question from './Question.js';
import Header from './Header.js';
import AppBox from './AppBox.js';
import Footer from './Footer.js';

import './App.css';

var initialized = 0;
var score = 0;
var status = 0;
var currentQuestion = new Question('null', 0, ['null', 'null', 'null', 'null'], 'null', 0);

function App() {

	const [question, setQuestion] = useState(currentQuestion);
	
	const getQuestion = async () => {
		currentQuestion = await getData();
		setQuestion(currentQuestion);
		status = 1;
	}

	function checkAnswer(isTrue) {
		if(isTrue === true) {
			score++;
		}
	}

	function reset(isTrue) {
		if(isTrue === false)
			score = 0;
		getQuestion();
	}

	if(initialized === 0) {
		getQuestion();
		status = 1;
		initialized++;
	}

	return (
		<div class="App">
			<img id="decoration" src="//raw.githubusercontent.com/josejovian/country-quiz/gh-pages/globe.png" alt="Globe"/>
			<Header />
			<AppBox checkAnswer={checkAnswer} reset={reset} question={question} score={score}/>
			<Footer />
		</div>
	);
}

export default App;
