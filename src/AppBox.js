import React, { useState, useEffect, useCallback } from 'react';

import Button from './Button.js';

import './AppBox.css';

var allowAnswers = true;
var userChoice = null;
var height = 256;
var arrayVariant;

function checkUndefined(x) {
	return (x !== undefined) ? x : "";
}

function AppBox(props) {

	var [status, setStatus] = useState(0);
	var [request, setRequest] = useState(0);
	var [variants, setVariants] = useState(['outline', 'outline', 'outline', 'outline']);

	if((props.question.type === 1) ^ (allowAnswers === false)) {
		height = parseInt(256 + 32);
	} else if((props.question.type === 1) && (allowAnswers === false)) {
		height = parseInt(256 + 64);
	} else {
		height = parseInt(256);
	}

	const checkQuestion = useCallback(() => {
		if(allowAnswers === true) {
			if(request < 1 && props.question.question === "null") {
				props.reset(true);
				setStatus(0);
				setTimeout(() => {setRequest(request + 1)}, 500);
			} else if(props.question.question !== "null") {
				setStatus(1);
			} else if(props.question.question === "null") {
				setStatus(3);
			}
		}
	}, [props, request, status]);

	useEffect(() => {
		checkQuestion();
	}, [checkQuestion]);

	function restart() {
		setStatus(1);
		props.reset(false);
		allowAnswers = true;
	}

	function toggleResult() {
		allowAnswers = false;
		setStatus(2);
		height = 320;
	}

	function resetVariant() {
		if(allowAnswers === false) {
			allowAnswers = true;
			arrayVariant = ['outline', 'outline', 'outline', 'outline'];
			setVariants(arrayVariant);
			
			if(userChoice === props.question.correct) {
				props.reset(true);
			} else {
				toggleResult();
			}
		}
	}

	function checkAnswer(x) {
		if(allowAnswers === true) {
			userChoice = x;
			arrayVariant = ['outline', 'outline', 'outline', 'outline'];
			arrayVariant[props.question.correct] = 'correct';
			if(x === props.question.correct) {
				setVariants(arrayVariant);
				props.checkAnswer(true);
			} else {
				arrayVariant[x] = 'wrong';
				setVariants(arrayVariant);
				props.checkAnswer(false);
			}

			allowAnswers = !allowAnswers;
		}
	}

	return (
		<div class="text-box" style={{height: height + "px"}}>
			<div class={"content-box " + ((status === 0) ? "" : "hidden")}>
				<img id="loading" src="//github.com/josejovian/country-quiz/blob/master/public/logo192.png?raw=true" alt="React"/>
				<div id="results">Loading...</div>
			</div>
			<div class={"content-box " + ((status === 1) ? "" : "hidden")}>
				<img class={(props.question.type === 0) ? "hidden" : "flag" } src={props.question.thumbnail} alt="Flag"/>
				<span class="question">
					{props.question.question}
				</span>
				<Button variant={variants[0]} startIcon="A" text={checkUndefined(props.question.answers[0])} trigger={() => checkAnswer(0)}/>
				<Button variant={variants[1]} startIcon="B" text={checkUndefined(props.question.answers[1])} trigger={() => checkAnswer(1)}/>
				<Button variant={variants[2]} startIcon="C" text={checkUndefined(props.question.answers[2])} trigger={() => checkAnswer(2)}/>
				<Button variant={variants[3]} startIcon="D" text={checkUndefined(props.question.answers[3])} trigger={() => checkAnswer(3)}/>
				<Button variant="btn" size="short" align="right" text="Next" hidden={(allowAnswers === true) ? "hidden" : ""} trigger={() => resetVariant()}/>
			</div>
			<div class={"content-box " + ((status === 2) ? "" : "hidden")}>
				<div class="img"></div>
				<div id="results">Results</div>
				<div id="caption">You got <span id="score">{props.score}</span> correct answers</div>
				<Button variant="outline" color="dark-blue" size="medium" align="center" text="Try again" trigger={() => restart()}/>
			</div>
			<div class={"content-box " + ((status === 3) ? "" : "hidden")}>
				<div id="results">Error</div>
				<div id="caption">Could not fetch the country data.</div>
				<Button variant="outline" color="dark-blue" size="medium" align="center" text="Refresh" trigger={() => window.location.reload(false)}/>
			</div>
		</div>

	);
}

export default AppBox;
