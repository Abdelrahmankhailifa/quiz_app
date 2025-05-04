// Quiz questions for different categories
const quizData = {
  general: {
    title: "General Knowledge Quiz",
    questions: [
      {
        question: "What is the capital of France?",
        choices: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2,
      },
      {
        question: "Which planet is known as the Red Planet?",
        choices: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1,
      },
      {
        question: "What is the largest mammal in the world?",
        choices: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correct: 1,
      },
      {
        question: "Who painted the Mona Lisa?",
        choices: [
          "Vincent van Gogh",
          "Pablo Picasso",
          "Leonardo da Vinci",
          "Michelangelo",
        ],
        correct: 2,
      },
      {
        question: "What is the chemical symbol for gold?",
        choices: ["Ag", "Fe", "Au", "Cu"],
        correct: 2,
      },
    ],
  },
  science: {
    title: "Science Quiz",
    questions: [
      {
        question: "What is the hardest natural substance on Earth?",
        choices: ["Gold", "Iron", "Diamond", "Platinum"],
        correct: 2,
      },
      {
        question: "What is the speed of light?",
        choices: [
          "299,792 km/s",
          "199,792 km/s",
          "399,792 km/s",
          "499,792 km/s",
        ],
        correct: 0,
      },
      {
        question: "Which gas makes up the majority of Earth's atmosphere?",
        choices: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        correct: 2,
      },
      {
        question: "What is the smallest unit of matter?",
        choices: ["Atom", "Molecule", "Cell", "Electron"],
        correct: 0,
      },
      {
        question: "What is the process by which plants make their food?",
        choices: ["Photosynthesis", "Respiration", "Digestion", "Absorption"],
        correct: 0,
      },
    ],
  },
  history: {
    title: "History Quiz",
    questions: [
      {
        question: "In which year did World War II end?",
        choices: ["1943", "1944", "1945", "1946"],
        correct: 2,
      },
      {
        question: "Who was the first President of the United States?",
        choices: [
          "Thomas Jefferson",
          "John Adams",
          "George Washington",
          "Benjamin Franklin",
        ],
        correct: 2,
      },
      {
        question: "Which ancient wonder was located in Egypt?",
        choices: [
          "Hanging Gardens",
          "Colossus of Rhodes",
          "Great Pyramid of Giza",
          "Temple of Artemis",
        ],
        correct: 2,
      },
      {
        question: "Who wrote 'Romeo and Juliet'?",
        choices: [
          "Charles Dickens",
          "William Shakespeare",
          "Jane Austen",
          "Mark Twain",
        ],
        correct: 1,
      },
      {
        question: "Which empire was ruled by the Aztecs?",
        choices: ["Mexican", "Peruvian", "Brazilian", "Colombian"],
        correct: 0,
      },
    ],
  },
  geography: {
    title: "Geography Quiz",
    questions: [
      {
        question: "What is the largest continent by land area?",
        choices: ["North America", "Africa", "Asia", "Europe"],
        correct: 2,
      },
      {
        question: "Which country has the largest population?",
        choices: ["India", "China", "USA", "Indonesia"],
        correct: 1,
      },
      {
        question: "What is the longest river in the world?",
        choices: ["Amazon", "Nile", "Mississippi", "Yangtze"],
        correct: 1,
      },
      {
        question: "Which desert is the largest in the world?",
        choices: ["Gobi", "Sahara", "Arabian", "Antarctic"],
        correct: 3,
      },
      {
        question: "What is the capital of Australia?",
        choices: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correct: 2,
      },
    ],
  },
};

// DOM Elements
const quizSelection = document.getElementById("quiz-selection");
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const backBtn = document.getElementById("back-btn");
const homeBtn = document.getElementById("home-btn");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const timeEl = document.getElementById("time");
const finalScoreEl = document.getElementById("final-score");
const highScoreEl = document.getElementById("high-score");
const progressBar = document.querySelector(".progress-bar");
const quizTitle = document.getElementById("quiz-title");

// Additional DOM Elements
const scoreForm = document.getElementById("score-form");
const registerScoreBtn = document.getElementById("register-score-btn");
const playerNameInput = document.getElementById("player-name");
const playerEmailInput = document.getElementById("player-email");

// Quiz state
let currentQuiz = null;
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;

// Initialize high scores from localStorage
const highScores = JSON.parse(localStorage.getItem("highScores")) || {};
const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

// Create leaderboard container
const leaderboardContainer = document.createElement("div");
leaderboardContainer.className = "leaderboard";
leaderboardContainer.innerHTML = `
  <h3>Leaderboard</h3>
  <div class="leaderboard-list"></div>
`;
document.body.appendChild(leaderboardContainer);

function updateLeaderboard() {
  const leaderboardList = document.querySelector(".leaderboard-list");
  leaderboardList.innerHTML = "";

  // Sort leaderboard by score in descending order
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.score - a.score);

  // Display top 5 scores
  sortedLeaderboard.slice(0, 5).forEach((entry, index) => {
    const entryElement = document.createElement("div");
    entryElement.className = "leaderboard-entry";
    entryElement.innerHTML = `
      <span class="rank">#${index + 1}</span>
      <span class="name">${entry.name}</span>
      <span class="score">${entry.score}</span>
    `;
    leaderboardList.appendChild(entryElement);
  });
}

// Call updateLeaderboard when the page loads
updateLeaderboard();

// Event Listeners
document.querySelectorAll(".quiz-card").forEach((card) => {
  card.addEventListener("click", () => selectQuiz(card.dataset.quiz));
});

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", () => {
  // Reset all quiz state
  currentQuestion = 0;
  score = 0;
  timeLeft = 30;
  clearInterval(timer);

  // Hide result screen and show quiz screen
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  // Start the quiz again
  showQuestion();
});
backBtn.addEventListener("click", showQuizSelection);
homeBtn.addEventListener("click", showQuizSelection);

function selectQuiz(quizType) {
  currentQuiz = quizType;
  quizTitle.textContent = quizData[quizType].title;

  // Show the start screen
  quizSelection.classList.add("hidden");
  startScreen.classList.remove("hidden");

  // Update high score display for selected quiz
  highScoreEl.textContent = highScores[quizType] || 0;
}

function showQuizSelection() {
  quizSelection.classList.remove("hidden");
  startScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  clearInterval(timer);
}

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  const question = quizData[currentQuiz].questions[currentQuestion];
  questionEl.textContent = question.question;

  // Clear previous choices
  choicesEl.innerHTML = "";

  // Create choice buttons
  question.choices.forEach((choice, index) => {
    const button = document.createElement("div");
    button.className = "choice";
    button.textContent = choice;
    button.addEventListener("click", () => checkAnswer(index));
    choicesEl.appendChild(button);
  });

  // Update progress bar
  const progress =
    ((currentQuestion + 1) / quizData[currentQuiz].questions.length) * 100;
  progressBar.style.width = `${progress}%`;

  // Start timer
  timeLeft = 30;
  timeEl.textContent = timeLeft;
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
}

function checkAnswer(choiceIndex) {
  clearInterval(timer);
  const question = quizData[currentQuiz].questions[currentQuestion];
  const choices = choicesEl.children;

  // Disable all choices
  Array.from(choices).forEach((choice) => {
    choice.style.pointerEvents = "none";
  });

  // Show correct/wrong
  if (choiceIndex === question.correct) {
    choices[choiceIndex].classList.add("correct");
    score++;
  } else {
    choices[choiceIndex].classList.add("wrong");
    choices[question.correct].classList.add("correct");
  }

  // Move to next question after delay
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizData[currentQuiz].questions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 1500);
}

function updateTimer() {
  timeLeft--;
  timeEl.textContent = timeLeft;

  if (timeLeft <= 0) {
    clearInterval(timer);
    currentQuestion++;
    if (currentQuestion < quizData[currentQuiz].questions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }
}

function showResults() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  // Update final score
  finalScoreEl.textContent = score;

  // Update high score if needed
  const currentHighScore = highScores[currentQuiz] || 0;
  if (score > currentHighScore) {
    highScores[currentQuiz] = score;
    localStorage.setItem("highScores", JSON.stringify(highScores));
    highScoreEl.textContent = score;
  }

  // Reset form and remove any existing success message
  scoreForm.reset();
  const existingSuccessMessage = document.querySelector(".form-success");
  if (existingSuccessMessage) {
    existingSuccessMessage.remove();
  }
}

// Handle score registration
scoreForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const playerData = {
    name: playerNameInput.value,
    email: playerEmailInput.value,
    quiz: currentQuiz,
    score: score,
    date: new Date().toLocaleDateString(),
  };

  // Add to leaderboard
  leaderboard.push(playerData);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  // Update leaderboard display
  updateLeaderboard();

  // Show success message
  const successMessage = document.createElement("p");
  successMessage.className = "form-success";
  successMessage.textContent = "Score registered successfully!";
  scoreForm.appendChild(successMessage);

  // Clear the form instead of disabling it
  scoreForm.reset();

  // Remove success message after 3 seconds
  setTimeout(() => {
    if (successMessage.parentNode) {
      successMessage.remove();
    }
  }, 3000);
});
