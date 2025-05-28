// --- Clock ---
// Updates the clock every second
function updateClock() {
  const now = new Date();
  const timeString = now
    .toLocaleTimeString('en-US', { hour12: true });
  document.getElementById('clock').textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// --- Greeting ---
// Sets a greeting based on the current hour and user's name
function updateGreeting() {
  const hour = new Date().getHours();
  let greeting = "Welcome";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";
  const name = localStorage.getItem('focusUserName');
  document.getElementById('greeting').textContent = name ? `${greeting}, ${name}` : greeting;
}
updateGreeting();

// --- To-Do List ---
// Handles loading, adding, and deleting todos with localStorage persistence
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todoList.innerHTML = '';
  todos.forEach((todo, idx) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = todo;
    li.appendChild(span);
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => {
      todos.splice(idx, 1);
      localStorage.setItem('todos', JSON.stringify(todos));
      loadTodos();
    };
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });
}
todoForm.onsubmit = function(e) {
  e.preventDefault();
  const value = todoInput.value.trim();
  if (value) {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    todos.push(value);
    localStorage.setItem('todos', JSON.stringify(todos));
    todoInput.value = '';
    loadTodos();
  }
};
loadTodos();

// --- Pomodoro Timer ---
// Simple Pomodoro timer with start, pause/resume, and reset functionality
let pomodoroTime = 25 * 60; 
let timerInterval = null; // Tracks if the timer is running
let isPaused = false;

// Updates the timer display in mm:ss format
function updateTimerDisplay() {
  const min = String(Math.floor(pomodoroTime / 60)).padStart(2, '0');
  const sec = String(pomodoroTime % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${min}:${sec}`;
}

// Starts the Pomodoro timer
function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    if (!isPaused && pomodoroTime > 0) {
      pomodoroTime--;
      updateTimerDisplay();
      if (pomodoroTime === 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        alert('Pomodoro finished!');
      }
    }
  }, 1000);
}

// Pauses or resumes the Pomodoro timer
function pauseTimer() {
  isPaused = !isPaused;
  document.getElementById('pause').textContent = isPaused ? 'Resume' : 'Pause';
}

// Resets the Pomodoro timer to 25:00
function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  pomodoroTime = 25 * 60;
  isPaused = false;
  document.getElementById('pause').textContent = 'Pause';
  updateTimerDisplay();
}

// Attach Pomodoro button events
document.getElementById('start').onclick = startTimer;
document.getElementById('pause').onclick = pauseTimer;
document.getElementById('reset').onclick = resetTimer;
updateTimerDisplay();

// --- Motivational Quote Section ---
// Generates fake motivational quotes using templates and random names/concepts
const speakers = [
  "Albert Einstein",
  "Carl Sagan",
  "Isaac Newton",
  "Marie Curie",
  "Stephen Hawking",
  "Nikola Tesla",
  "Alan Turing",
  "Galileo Galilei",
  "Ada Lovelace",
  "Leonardo da Vinci"
];

const quoteTemplates = [
  "The pursuit of knowledge is the path to ___.",
  "Without ___, progress is impossible.",
  "___ is the foundation of all scientific discovery.",
  "To question ___ is to begin to understand it.",
  "Only through ___ can we achieve greatness."
];

const keyWordPool = ["curiosity", "doubt", "observation", "logic", "experiment", "failure", "wonder", "understanding"];

// Returns a random fake quote
function generateFakeQuote() {
  const person = speakers[Math.floor(Math.random() * speakers.length)];
  const template = quoteTemplates[Math.floor(Math.random() * quoteTemplates.length)];
  const concept = keyWordPool[Math.floor(Math.random() * keyWordPool.length)];
  const quote = template.replace("___", concept);
  return `"${quote}" — ${person}`;
}

// --- Animated Loader for Quotes ---
// Shows animated "Loading..." text while waiting for the next quote
let quoteTimeout = null;
let loaderInterval = null;

function showAnimatedLoader() {
  const quoteText = document.getElementById('quote-text');
  let dots = 0;
  quoteText.textContent = 'Loading';
  loaderInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    quoteText.textContent = 'Loading' + '.'.repeat(dots);
  }, 300);
}

// Hides the animated loader
function hideAnimatedLoader() {
  clearInterval(loaderInterval);
  loaderInterval = null;
}

// Handles the "New Quote" button: shows loader, waits 1.5s, then shows a new quote
document.getElementById('new-quote').onclick = () => {
  const quoteText = document.getElementById('quote-text');
  showAnimatedLoader();

  if (quoteTimeout) clearTimeout(quoteTimeout);

  quoteTimeout = setTimeout(() => {
    hideAnimatedLoader();
    quoteText.textContent = generateFakeQuote();
  }, 1500);
};

// Show an initial quote on page load
document.getElementById('quote-text').textContent = generateFakeQuote();
