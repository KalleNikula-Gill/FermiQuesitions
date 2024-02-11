var currentScore = 0;
var currentQuestion = 0;
var numQuestions = 0;
var questions_and_answers = [];
var q_and_a = []
var highscore = 0;

function setHighscore(highscore) {
    document.cookie =  "highscore=" + highscore + "; expires=1 Jan 2030 01:01:01";
}

function getHighscore() {
    var decoded = decodeURIComponent(document.cookie);
    if (decoded == "") {
        return "";
    }
    else {
        return decoded.substring(10);
    }
}

function loadData() {
    fetch("data.txt")
    .then((res) => res.text())
    .then((text) => {
        questions_and_answers = text.split('\n');
        var temp = [];
        for (var i = 1; i < questions_and_answers.length; i+=2) {
            temp.push([questions_and_answers[i-1], questions_and_answers[i]]);
        }
        q_and_a = temp
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
        numQuestions = q_and_a.length
        document.getElementById("answeredFraction").innerText = "0/" + numQuestions.toString() + " questions answered";
        if (getHighscore()!="") {
            highscore=getHighscore();
        }
        else {
            setHighscore(0);
        }
        document.getElementById("highscore").innerText = "Highscore: " + highscore;
        setQuestion();
    })
}

function getInput() {
    document.getElementById("answeredFraction").innerText = Math.min(currentQuestion+1,numQuestions).toString() + "/" + numQuestions.toString() + " questions answered";
    var input = document.getElementById("quantity").value;
    if (input == '') {
        input = 0;
    }
    if (currentQuestion < numQuestions) {
        var correctAnswer = parseInt(q_and_a[currentQuestion][1])
        if (Math.abs(input - correctAnswer) == 2) {
            currentScore += 1;
            document.getElementById("score").innerText = "Score: " + currentScore.toString();
            document.getElementById("scoreDescription").innerText = "+1 (You guessed " + input.toString() + " and the correct answer was " + correctAnswer.toString() + ")";
            document.getElementById("scoreDescription").style.color = "#DC4D01";
        }
        else if (Math.abs(input - correctAnswer) == 1) {
            currentScore += 3;
            document.getElementById("score").innerText = "Score: " + currentScore.toString();
            document.getElementById("scoreDescription").innerText = "+3 (You guessed " + input.toString() + " and the correct answer was " + correctAnswer.toString() + ")";
            document.getElementById("scoreDescription").style.color = "blue";
        }
        else if (input == correctAnswer) {
            currentScore += 5;
            document.getElementById("score").innerText = "Score: " + currentScore.toString();
            document.getElementById("scoreDescription").innerText = "+5 (You guessed " + input.toString() + " and the correct answer was " + correctAnswer.toString() + ")";
            document.getElementById("scoreDescription").style.color = "green";
        }
        else {
            document.getElementById("score").innerText = "Score: " + currentScore.toString();
            document.getElementById("scoreDescription").innerText = "+0 (You guessed " + input.toString() + " and the correct answer was " + correctAnswer.toString() + ")";
            document.getElementById("scoreDescription").style.color = "red";
        }
    }
    if (currentScore > highscore) {
        highscore = currentScore;
        setHighscore(currentScore);
        document.getElementById("highscore").innerText = "Highscore: " + highscore;
    }
    currentQuestion+=1;
    setQuestion();
    document.getElementById("quantity").value = 0;
}

function setQuestion() {
    if (currentQuestion >= numQuestions) {
        document.getElementById("question").innerText = "You've completed all the questions!";
        document.getElementById("scoreDescription").innerText = "";
    }
    else {
        document.getElementById("question").innerText = q_and_a[currentQuestion][0];
    }
}

function keyPress(key) {
    if (key.code == 'Enter') {
        getInput()
    }
}

window.onload = function() {
    loadData();
}
