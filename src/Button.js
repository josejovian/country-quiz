import React from 'react';
import './Button.css';

function checkUndefined(x) {
	return (x !== undefined) ? x : "";
}

function Button(props) {

	var getClass = "btn";

	const variant = checkUndefined(props.variant);
	const disableShadow = (props.disableShadow === true) ? "no-shadow" : "";
	const color = checkUndefined(props.color);
	var startIcon = (props.startIcon !== undefined && props.startIcon.length > 2) ? "material-icons material-icons-outlined" : "material-icons";
	var endIcon = (props.endIcon !== undefined  && props.startIcon.length > 2) ? "material-icons material-icons-outlined" : "material-icons";
	var conStartIcon = checkUndefined(props.startIcon);
	var conEndIcon = checkUndefined(props.endIcon);
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

	if(props.class === undefined) {
		getClass = getClass + " " + variant + " " + disableShadow + " " + color + " " + size + " " + align + " " + stretch + " " + hidden;
	} else {
		getClass = getClass + " " + props.class;
	}

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

export default Button;