document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const welcomeSection = document.getElementById('welcome-section');
    const startBtn = document.getElementById('start-btn');
    const quizSection = document.getElementById('quiz-section');
    const resultSection = document.getElementById('result-section');
    const usernameInput = document.getElementById('username');
    const quizImage = document.getElementById('quiz-image');
    const quizForm = document.getElementById('quiz-form');
    const nextBtn = document.getElementById('next-btn');

    let quizData = []; // Array to store quiz questions and answers
    let currentQuestionIndex = 0;
    let userScore = 0;
    let username = '';
    let allOptions = ["Ashif","Bushra","Chandan","Diganta","Divy","Jasmeet","Lekha","Madhushree","Nita","Vineeth"]
    let quizOptions = '';
    // Event listener for start button click
    startBtn.addEventListener('click', function() {
        username = usernameInput.value.trim();
        if (username === '') {
            alert('Please enter your name to start the quiz.');
            return;
        }
        welcomeSection.style.display = 'none'; // Hide welcome section
        quizSection.style.display = 'block'; // Show quiz section
        loadQuizData(); // Load quiz data from JSON file
    });

    // Load quiz data from JSON file
    function loadQuizData() {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {

                // Shuffle the array using Fisher-Yates algorithm
                for (let i = data.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [data[i], data[j]] = [data[j], data[i]];
                }

                quizData = data;
                displayQuizQuestion(); // Display the first quiz question
            })
            .catch(error => console.error('Error loading quiz data:', error));
    }

    // Display the current quiz question
    function displayQuizQuestion() {
        if (currentQuestionIndex >= quizData.length) {
            displayResult(); // Display result if all questions are answered
            return;
        }

        const quizItem = quizData[currentQuestionIndex];
        quizImage.src = quizItem.image; // Set image source
        quizForm.innerHTML = ''; // Clear previous options

        quizOptions = generateOptions(allOptions, quizData[currentQuestionIndex].name,5);

        quizOptions.forEach(option => {
            const optionHTML = `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="answer" value="${option}" id="option-${option}">
                    <label class="form-check-label" for="option-${option}">
                        ${option}
                    </label>
                </div>
            `;
            quizForm.innerHTML += optionHTML;
        });
    }

    // Event listener for next button click
    nextBtn.addEventListener('click', function() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (!selectedOption) {
            alert('Please select an option.');
            return;
        }

        const userAnswer = selectedOption.value;
        const correctAnswer = quizData[currentQuestionIndex].name;

        if (userAnswer === correctAnswer) {
            userScore++; // Increment score for correct answer
        }

        currentQuestionIndex++; // Move to the next question
        displayQuizQuestion(); // Display the next question
    });

    // Display quiz result
    function displayResult() {
        quizSection.style.display = 'none'; // Hide quiz section
        resultSection.style.display = 'block'; // Show result section
        const resultHTML = `
            <h2 class="display-4">Quiz Result</h2>

            <p class="lead bLead">${username}'s score in the Anime Quiz Game is ${userScore} out of ${quizData.length}</p>
            <p class="lead bLead">Looks like ${username} is ${getFunName(userScore)}!</p>

            <button class="btn btn-success share-btn" onclick="shareScore()">Share Score to WhatsApp</button>
            `;
            resultSection.innerHTML = resultHTML;
            // <p class="lead bLead">${username}, your score is: ${userScore}/${quizData.length}</p>
            // <p class="lead cLead">You are a ${getFunName(userScore)}!</p>
        }

    // Get a fun name based on the user's score
    function getFunName(score) {
        if (score === quizData.length) {
            return '🏆 Quiz Master';
        } else if (score >= quizData.length * 0.8) {
            return '🎉 Anime Expert';
        } else if (score >= quizData.length * 0.6) {
            return '😊 Anime Fan';
        } else {
            return '👶 Anime Novice';
        }
    };


    //Generate random opotions
    function generateOptions(allOptions, correctOption,length){

        console.log("All Options",allOptions)
        console.log("Correct Option", correctOption)

        // Create a shuffled array of length 5 with the correct option included
        let shuffledOptions = [];
        for (let i = 0; i < length - 1; i++) {
            let randomOption = allOptions[Math.floor(Math.random() * allOptions.length)];
            if (shuffledOptions.indexOf(randomOption) === -1 && randomOption !== correctOption) {
                shuffledOptions.push(randomOption);
            } else {
                i--; // Retry if the random option is already in the array or is the correct option
            }
        }

        console.log("Suffeled Options",shuffledOptions)

        shuffledOptions.push(correctOption); // Add the correct option to the array

        //Shuffel the array
        let shuffleArray = shuffledOptions;
        for (let i = shuffleArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffleArray[i], shuffleArray[j]] = [shuffleArray[j], shuffleArray[i]];
        }

        return shuffleArray;

    }

    // Share score to WhatsApp
    window.shareScore = function() {
        

        //`${username}'s score in the Anime Quiz Game is *${userScore} out of ${quizData.length}. Looks like ${username} is an *${getFunName(userScore)}*!`
        const shareText = `Hi,\n\n*${username}'s* score in the Anime Quiz Game is *${userScore} out of ${quizData.length}*. \nLooks like ${username} is *${getFunName(userScore)}*!\n-------------------------------------------------------
        \n\nLet's play: ${window.location.href}`;
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
        window.location.href = whatsappUrl;


    };



});
