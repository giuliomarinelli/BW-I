const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// Variables
let currentQuestionIndex = 0;
let score = 0;
let n = generateRandomNumber(20, 30);
localStorage.setItem('n', n);
let unansweredQuestions = 0;
let timerInterval;
let difficulty = "easy"
let promiseCheckbox = document.querySelector("#myApp #promise");
let difficultySelect = document.querySelector(".difficultySelect");

function showDifficultySelect(promiseCheckbox, difficultySelect) {
    if (promiseCheckbox.checked) {
        difficultySelect.style.display = "block";
    } else {
        difficultySelect.style.display = "none";
      }
}

promiseCheckbox.addEventListener("change", function() {
    showDifficultySelect(promiseCheckbox, difficultySelect);
  });

let difficultyBtn = document.querySelectorAll(".difficultyValue");

difficultyBtn.forEach( function(btn) {
    btn.addEventListener("click", function() {
        difficulty = btn.ariaValueMax;
        btn.classList.add("")
    })
})





// Store the correct answer
let correctAnswer = "";

let timerStarted = false;


const updateQuestionNumber = () => {
    let questionNumberElement = document.querySelector(".questions-number");
    if (questionNumberElement) {
        questionNumberElement.innerHTML = `QUESTION ${currentQuestionIndex + 1} <span class="purple">/ ${n}</span>`;
    }
};

const handleAnswer = (answerButton) => {
    if (answerButton) {
        if (answerButton.textContent === correctAnswer) {
            score++;
        }
    } else {
        unansweredQuestions++;
    }

    currentQuestionIndex++;

    updateQuestionNumber();

    if (currentQuestionIndex <= n) {
        fetchRandomQuestion();
        resetTimer();
    } else {
        const answeredQuestions = n - unansweredQuestions;
        const percentage = (score / answeredQuestions) * 100;
        localStorage.setItem("quizScore", score);
        window.location.href = "result-page.html";
    }
};

const updateAnswerButtons = () => {
    const answerButtons = document.querySelectorAll(".answer-button");
    answerButtons.forEach((button) => {
        button.addEventListener("click", () => {
            handleAnswer(button);
        });
    });
};

const apiUrl = `https://opentdb.com/api.php?amount=${n}&category=18&difficulty=${difficulty}`;

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const fetchRandomQuestion = () => {
    if (currentQuestionIndex >= n) {
        const answeredQuestions = n - unansweredQuestions;
        const percentage = (score / answeredQuestions) * 100;
        localStorage.setItem("quizScore", score);
        window.location.href = "result-page.html";
        return;
    }

    fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
            if (currentQuestionIndex >= n) {
                const answeredQuestions = n - unansweredQuestions;
                const percentage = (score / answeredQuestions) * 100;
                localStorage.setItem("quizScore", score);
                window.location.href = "result-page.html";
                return;
            }

            if (data.results.length > 0) {
                const randomQuestion = data.results[generateRandomNumber(0, data.results.length - 1)];
                const questionElement = document.querySelector(".question");
                const answerButtonsContainer = document.querySelector(".answer-buttons");

                questionElement.innerHTML = randomQuestion.question;
                answerButtonsContainer.innerHTML = "";

                // Store the correct answer
                correctAnswer = randomQuestion.correct_answer;

                const answers = [...randomQuestion.incorrect_answers, correctAnswer];
                shuffleArray(answers);

                answers.forEach((answer) => {
                    const answerButton = document.createElement("button");
                    answerButton.className = "answer-button";
                    answerButton.innerHTML = answer;
                    answerButtonsContainer.appendChild(answerButton);
                });

                updateAnswerButtons();

                startTimer2();
            }
        })
        .catch((error) => {
            console.error("Error fetching questions:", error);
        });
};

// Timer related code starts here
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
    }
};

const TIME_LIMIT = 45;
let timeLeft = TIME_LIMIT;
let timerInterval2 = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("countdown").innerHTML = `
<div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
            <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path
                id="base-timer-path-remaining"
                stroke-dasharray="283"
                class="base-timer__path-remaining ${remainingPathColor}"
                d="
                M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
                "
            ></path>
        </g>
    </svg>
    
    <div id="base-timer-label" class="base-timer__label">
    
    ${formatTime(timeLeft)}</div>

</div>`;

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `<div>SECONDS</div><span class="seconds">${seconds}</span><div>REMAINING</div>`;
}

function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
        remainingPathColor = alert.color;
    } else if (timeLeft <= warning.threshold) {
        remainingPathColor = warning.color;
    } else {
        remainingPathColor = info.color;
    }
    document.getElementById("base-timer-path-remaining").classList.remove(alert.color, warning.color, info.color);
    document.getElementById("base-timer-path-remaining").classList.add(remainingPathColor);
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray", circleDasharray);
}

function onTimesUp() {
    clearInterval(timerInterval2);
    timeLeft = TIME_LIMIT;
    timerStarted = false;
    resetTimer();
    handleAnswer(null, null);
}

// Function to reset the timer when it reaches 0 seconds
function resetTimer() {
    timeLeft = TIME_LIMIT;
    remainingPathColor = COLOR_CODES.info.color;
    setRemainingPathColor(timeLeft);
    setCircleDasharray();
    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    
}


// Function to handle the timer expiration
function handleTimeUp() {
    clearInterval(timerInterval2);
    onTimesUp();
    fetchRandomQuestion();
}

// Start the timer and reset it when it reaches 0 seconds
function startTimer2() {
    if (!timerStarted) {
        resetTimer();
        timerStarted = true;
        timerInterval2 = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
                setRemainingPathColor(timeLeft);
                setCircleDasharray();
            } else {
                handleTimeUp();
            }
        }, 1000);
    }
}

fetchRandomQuestion();
updateQuestionNumber();
