
// * functions to get vars
function selector(selector) {
    return document.querySelector(selector)
}
function selectors(selectors) {
    return document.querySelectorAll(selectors)
}
// * Dom variables 
let overlay = selector('.overlay');
let overlaySubmit = selector('.overlay input[type="submit"]');
let overlayInput = selector('.overlay input[type="text"]');
let timeCounter = selector('.timer span')
let nameDiv = selector('.name')
let bullet = selector('.bullet')
let endExamBtn = selector('.end-exam')
let questionDiv = selector('.question')
let answersArray = Array.from(selectors('.answers p'))
let controls = Array.from(selectors('.controls button'))
// * Logic variables
let name = ''
let answeredQuestion = [];
let CorrectAnswerIndex = 0;
let currentQuestion = '';
let questionsLis = []
let bulletCounter = 0
let questionsToReview = new Set()
let score = 0

// * Handle form
overlaySubmit.onclick = function (e) {
    e.preventDefault()
    if (overlayInput.value.trim() !== '') {
        nameDiv.textContent = overlayInput.value
        overlay.remove()
        //* Trigger Timer
        countdown();
    } else {
        window.alert('Please Enter Your Name')
    }
}
// * handle end exam button 
endExamBtn.onclick = () => displayScore()
getQuestions()
// * Get all Questions 
function getQuestions() {
    fetch("./data.json")
        .then(response => response.json())
        .then(json => {
            displayBullet(json.questions)
        });

}

// * Display bullets and questions
function displayBullet(questions) {
    questionsCount = questions.length
    // * dispaly first question
    displayCurrentQuestion(questions[0])
    // * Display bullets base of questions
    for (let i = 0; i < questions.length; i++) {
        let li = document.createElement('li');
        li.textContent = String(i + 1);
        bullet.appendChild(li)
        questionsLis.push(li)
        li.addEventListener('click', () => displayCurrentQuestion(questions[i]))
    }
}

function displayCurrentQuestion(q) {
    currentQuestion = q;
    questionDiv.textContent = q.question
    for (let i = 0; i < q.answers.length; i++) {
        answersArray[i].textContent = q.answers[i]
        CorrectAnswerIndex = q.correctIndex
        answersArray[i].addEventListener('click', () => checkAnswer(i, q))
    }
}

//* Set the time for the countdown (in seconds)
const initialTime = 30 * 60;
let time = initialTime;
function updateTimer() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timeCounter.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
function countdown() {
    updateTimer();
    if (time > 0) {
        time--;
        setTimeout(countdown, 1000); // Update every 1 second
    } else {
        displayScore()
    }
}

//* Start the countdown when the page loads

function checkAnswer(index, question) {
    let flag = true
    answeredQuestion.forEach(el => {
        if (el.question == question) {
            flag = false
        }
    })
    if (index == CorrectAnswerIndex) {
        flag && answeredQuestion.push({ checkAnswer: true, question: question, status: '' })
        score++;
    } else {
        flag && answeredQuestion.push({ checkAnswer: false, question: question, status: '' })
    }
}

// * handle controls
controls.forEach(el => {
    el.addEventListener('click', () => addStatusToQuestions(el.className));
})
// * add status to question
function addStatusToQuestions(status) {
    answeredQuestion.forEach(el => {
        if (el.question.question == currentQuestion.question) {
            el.status = status
            bulletCounter++;
        }
    })
    // //* display question that answered
    let bullets = Array.from(selectors('.bullet li'))
    if (bulletCounter === bullets.length) {
        //*  disable will review and skip buttons
        selector('.controls .will-review').classList.add('none')
        selector('.controls .skip').classList.add('none')
        selector('.review-label').textContent = 'Review Section'
        displayQuestionsToReview()
        displayBulletInReview(answeredQuestion)
    }
}

// * display questions to review
function displayQuestionsToReview() {
    bullet.textContent = ''
    questionDiv.textContent = ''
    answersArray.forEach(el => {
        el.textContent = ''
    })
}

// * Display bullets and questions
function displayBulletInReview(questions) {
    // * dispaly first question
    displayCurrentQuestionToReview(questions[0])
    // * Display bullets base of questions
    for (let i = 0; i < questions.length; i++) {
        let li = document.createElement('li');
        li.textContent = String(i + 1);
        bullet.appendChild(li)
        questionsLis.push(li)
        li.addEventListener('click', () => displayCurrentQuestionToReview(questions[i]))
    }

}
function displayCurrentQuestionToReview(q) {
    const question = q.question
    questionDiv.textContent = question.question
    for (let i = 0; i < question.answers.length; i++) {
        answersArray[i].textContent = question.answers[i]
        CorrectAnswerIndex = question.correctIndex
        answersArray[i].addEventListener('click', () => checkAnswer(i, q))
    }
}

function displayScore() {
    selector('.end').style.display = 'flex';
    selector('.result-msg').textContent = `Your Score Is ${score} From ${questionsCount}`;
}

// * handle try again btn
selector('.try-again').onclick = () => window.location.reload()