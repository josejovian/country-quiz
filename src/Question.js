class Question {
	constructor(question, type, answers, thumbnail, correct) {
		this.question = question;
		this.type = type;
		this.thumbnail = thumbnail;
		this.answers = answers;
		this.correct = correct;
	}
}

export default Question;