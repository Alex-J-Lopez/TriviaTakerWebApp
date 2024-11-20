const server = "localhost";
const port = 3000;

const getTriviaURL = `http://${server}:${[port]}/trivia`;
let questions = [];

window.onload = () =>{
    document.getElementById("startButton").onclick = startClicked;
    document.getElementById("checkQuiz").onclick = checkAnswers;
}

class TriviaQuestion {
    constructor(type, difficulty, category, question, correctAnswer, incorrectAnswers) {
        this.type = type;
        this.difficulty = difficulty;
        this.category = category;
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.incorrectAnswers = incorrectAnswers;
    }

    createHtmlElement() {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';

        const categoryElement = document.createElement('h3');
        categoryElement.textContent = `Category: ${this.category}`;
        questionDiv.appendChild(categoryElement);

        const difficultyElement = document.createElement('p');
        difficultyElement.textContent = `Difficulty: ${this.difficulty}`;
        questionDiv.appendChild(difficultyElement);

        const questionElement = document.createElement('p');
        /* 
        Definitely would want to take a look at this for security issues 
        since I am using .innerHTML to allow the question text to format correctly.
        */
        questionElement.innerHTML = this.question;
        questionDiv.appendChild(questionElement);

        const answerForm = document.createElement('form');
        answerForm.className = 'answerForm';

        const trueLabel = document.createElement('label');
        trueLabel.textContent = 'True';
        const trueInput = document.createElement('input');
        trueInput.type = 'radio';
        trueInput.name = this.question;
        trueInput.value = 'True';
        trueLabel.appendChild(trueInput);
        answerForm.appendChild(trueLabel);

        // answerForm.appendChild(document.createElement('br'));

        const falseLabel = document.createElement('label');
        falseLabel.textContent = 'False';
        const falseInput = document.createElement('input');
        falseInput.type = 'radio';
        falseInput.name = this.question;
        falseInput.value = 'False';
        falseLabel.appendChild(falseInput);
        answerForm.appendChild(falseLabel);

        questionDiv.appendChild(answerForm);

        return questionDiv;
    }

    checkAnswer(givenAnswer) { 
        return givenAnswer === this.correctAnswer;
    }
}

const getTrivia = async(number, category, difficulty) =>{
    try{
        let response = await fetch(getTriviaURL+`?num=${number}&cat=${category}&dif=${difficulty}`);
        let responseJSON = await response.json();
        if(responseJSON["status"] === "error"){ //This is never going to happen since I didn't do any error checking in the server code for times sake
            throw new Error(responseJSON["message"]);
        } else {
            return responseJSON;
        }
    } catch (error){
        throw error;
    }
}

const refresh = () =>{
    document.getElementById("triviaArea").innerHTML = "";
    questions = [];
}

const startClicked = async() =>{
    const number = document.getElementById("trivia_amount").value;
    const cat = document.getElementById("trivia_category").value;
    const dif = document.getElementById("trivia_difficulty").value;

    const resultList = await getTrivia(number, cat, dif);

    refresh(); //Clear the page and questions array

    if(resultList !== undefined && resultList !== null){
        resultList.forEach(result => {
            const triviaQuestion = new TriviaQuestion(
                result.type, 
                result.difficulty, 
                result.category, 
                result.question, 
                result.correct_answer, 
                result.incorrect_answers 
            );
            const node = triviaQuestion.createHtmlElement();
            questions.push(triviaQuestion)
            document.getElementById("triviaArea").appendChild(node);
        });
    }
}

const checkAnswers = () => {
    let score = 0;
    questions.forEach(question => {
        // Get all input elements and iterate through them
        // Certainly less than ideal since this is O(n^2). Ideally I would use a dictionary where each question maps to the answer and then iterate over each question object in the html.
        const inputs = document.querySelectorAll('.answerForm input');
        inputs.forEach(input => {
            // Find the checked input for the current question
            //This is O(n^2) which is less than ideal if I want to make this not true false in the future.
            if (input.name === question.question && input.checked) {
                const userAnswer = input.value;
                if (question.checkAnswer(userAnswer)) {
                    score++;
                }
            }
        });
    });

    alert(`You scored ${score} out of ${questions.length}`); 
    //Just let the user know what they scored here. For better user experience I would implement a new function that adds an html element and sets it to a fixed position in the center of the screen until its dismissed.
}
