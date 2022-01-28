import logo from './logo.svg';
import './css/style.css';
import { useState, useEffect } from 'react';
import { Button } from "./Button.js";
import { getData } from './Data.js';

// Footer of the website.
const Footer = () => {
	return (
		<footer> 
			Created by&nbsp;<a href="https://github.com/josejovian" title="Jose Jovian">josejovian</a>&nbsp;-&nbsp;<a href="https://devchallenges.io/" title="Dev Challenges">devChallenges.io</a>
		</footer>
	);
}

// The "Country Quiz" text on top of the card.
const Title = () => {
	return (
		<span id='title'>
			COUNTRY QUIZ
		</span>
	);
}

// A reusable component, or the website's general template.
const Template = ({children}) => {
	return (
		<div className="App">
			<div className='card'>
				<Title />
				<div className='card-content'>
					{children}
				</div>
			</div>
			<Footer/>
			<script src='./Data.js'/>
		</div>
	);
}

// A loading component: https://loading.io/css/
const Loading = () => {
	return (
		<div class="lds-dual-ring">
		</div>
	)
}

// The main App component.
function App() {

	/*
		Some states.
		- init: to ensure fetching data is done only once.
		- countryData: to save the country data obtained from API or localstorage.
		- score: to save score of the quiz.
		- quiz: to save the current question.
		- variant: to control the state of the four choice buttons.
		- canAnswer: to control whether the user can answer the question or not.
		- isFinished: to control whether the user has to restart or not.
	*/
	const [init, setInit] = useState(false);
	const [countryData, setCountryData] = useState(null);
	const [score, setScore] = useState(0);
	const [quiz, setQuiz] = useState({
		question: null,
		type: null,
		thumbnail: null,
		correct: null,
		answers: []
	});
	const [variants, setVariants] = useState(['outline', 'outline', 'outline', 'outline']);
	const [canAnswer, setCanAnswer] = useState(false);
	const [isFinished, setIsFinished] = useState(false);

	/*
		Functions to generate a question.
	*/

	function getRandomCountry() {
		let randomCountry = parseInt(parseInt(1 + Math.random() * 1000) % countryData.length);
		return countryData[randomCountry];
	}
	
	function getType() {
		let currentType = parseInt(Math.random() * 100) % 2;
		return currentType;
	}
	
	function getChoice() {
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
			question = country['capital'] + ' is the capital of...';
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
	
		setQuiz({
			question: question,
			type: questionType,
			thumbnail: thumbnail,
			correct: correct,
			answers: answers
		});

		setCanAnswer(true);
	}

	/*
		Functions to handle getting the country data from the API.
		Only fetches data once, then saves it in localstorage.
		The second time the app is opened, the country data is opened from localstorage.
	*/

	function saveCountryData(data) {
		localStorage.setItem("countryJSON", JSON.stringify(data));
		setCountryData(data);
		setInit(true);
		console.log("OK");
		return "OK";
	}

	useEffect(() => {
		if(init === false) {
			const check = JSON.parse(localStorage.getItem("countryJSON"));
			if(check == null) {
				getData(saveCountryData);
			} else {
				saveCountryData(check);
			}
		}	
	});

	/*
		After initialization, generate the first ever question.
	*/
	useEffect(() => {
		if(init === true && canAnswer === false) {
			getQuestion();
		}
	}, [init]);

	/*
		If init is false, show loading circle.
	*/
	if(init === false) {
		return (
			<Template>
				<Loading />
			</Template>
		);
	}

	/*
		Functions related to game over screen.
		- toggleResult: show game over screen.
		- restart: allow the user to retake the quiz.
	*/

	function toggleResult() {
		setIsFinished(true);
	}

	function restart() {
		setScore(0);
		setIsFinished(false);
		getQuestion();
	}

	if(isFinished === true) {
		return (
			<Template>
				<div class="trophy"></div>
				<div id="results">Results</div>
				<div id="caption">You got <span id="score">{score}</span> correct answers</div>
				<Button variant="outline" color="dark-blue" size="medium" align="center" text="Try again" trigger={() => restart()}/>
			</Template>
		);
	}

	/*
		Functions related to game over screen.
		- resetVariant: revert all button back to the outline variant.
		- checkAnswer: compare user's answer with the correct answer.
	*/

	function resetVariant() {
		if(canAnswer === false) {
			
			if(!variants.includes('wrong')) {
				getQuestion();
				setCanAnswer(true);
			} else {
				toggleResult();
			}

			let arrayVariant = ['outline', 'outline', 'outline', 'outline'];
			setVariants(arrayVariant);
		}
	}

	function checkAnswer(x) {
		if(canAnswer === false)
			return;

		let arrayVariant = ['outline', 'outline', 'outline', 'outline'];
		arrayVariant[quiz.correct] = 'correct';
		if(x === quiz.correct) {
			setVariants(arrayVariant);
			setScore(score + 1);
		} else {
			arrayVariant[x] = 'wrong';
			setVariants(arrayVariant);
		}

		setCanAnswer(false);
	}

	/*
		A much cleaner method to generate a button for each answer.
	*/

	let choices = quiz.answers.map((choice, idx) => {
		return (
			<Button className="choice" variant={variants[idx]}
				startIcon={String.fromCharCode(65 + idx)} text={choice}
				trigger={() => checkAnswer(idx)} />
		);
	});

	/*
		Render the question, answers.
	*/
	return (
		<Template>
			<img class={(quiz.type === 0) ? "hidden" : "flag" } src={quiz.thumbnail} alt="Flag"/>
			<span id="question">
				{quiz.question}
			</span>
			{choices}
			<Button variant="btn" size="short" align="right" text="Next"
				hidden={(canAnswer === true) ? "hidden" : ""} trigger={() => resetVariant()}/>
		</Template>
	);
}

export default App;
