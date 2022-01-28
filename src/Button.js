import React from 'react';
import './css/button.css';

function checkUndefined(x) {
	return (x !== undefined) ? x : "";
}

export const Button = (props) => {

	let getClass = "btn";

	const variant = checkUndefined(props.variant);
	const disableShadow = (props.disableShadow === true) ? "no-shadow" : "";
	const color = checkUndefined(props.color);
	let startIcon = (props.startIcon !== undefined && props.startIcon.length > 2) ? "material-icons material-icons-outlined" : "material-icons";
	let endIcon = (props.endIcon !== undefined  && props.startIcon.length > 2) ? "material-icons material-icons-outlined" : "material-icons";
	let conStartIcon = checkUndefined(props.startIcon);
	let conEndIcon = checkUndefined(props.endIcon);
	const size = checkUndefined(props.size);
	const stretch = (props.text.length > 20) ? "condensed" : "";
	
	const text = checkUndefined(props.text);
	const align = checkUndefined(props.align);
	const hidden =  checkUndefined(props.hidden);

	if(variant === "correct") {
		conEndIcon = "check_circle_outline";
		endIcon = "material-icons material-icons-outlined";
	}

	if(variant === "wrong") {
		conEndIcon = "remove_circle_outline";
		endIcon = "material-icons material-icons-outlined";
	}

	if(startIcon === endIcon && startIcon === "") {
		startIcon = endIcon = "hidden";
	}

	getClass = props.className + " " +  getClass + " " + variant + " " + disableShadow + " " + color + " " + size + " " + align + " " + stretch + " " + hidden;

	if(props.disabled === true) {
		return (
			<button class={getClass} disabled>
				<span>{text}</span>
			</button>
		);
	} else {
		return (
			<button class={getClass} onClick={props.trigger}>
				<span class={startIcon}>{conStartIcon}</span>
				<span>{text}</span>
				<span class={endIcon}>{conEndIcon}</span>
			</button>
		);
	}
}