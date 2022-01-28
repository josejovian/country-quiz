import logo from './logo.svg';
import './css/style.css';
import { useState, useEffect } from 'react';
import { Button } from "./Button.js";
import { getData } from './Data.js';

const Footer = () => {
	return (
		<footer> 
			Created by&nbsp;<a href="https://github.com/josejovian" title="Jose Jovian">josejovian</a>&nbsp;-&nbsp;<a href="https://devchallenges.io/" title="Dev Challenges">devChallenges.io</a>
		</footer>
	);
}

const Title = () => {
	return (
		<span id='title'>
			COUNTRY QUIZ
		</span>
	);
}

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

const Loading = () => {
	return (
		<div class="lds-dual-ring">
		</div>
	)
}

function App() {

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

	useEffect(() => {
		console.log(score);
	})

	useEffect(() => {
		if(init === true && canAnswer === false) {
			getQuestion();
		}
	}, [init]);

	if(init === false) {
		return (
			<Template>
				<Loading />
			</Template>
		);
	}

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

	let choices = quiz.answers.map((choice, idx) => {
		return (
			<Button className="choice" variant={variants[idx]}
				startIcon={String.fromCharCode(65 + idx)} text={quiz.answers[idx]}
				trigger={() => checkAnswer(idx)} />
		);
	});

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
