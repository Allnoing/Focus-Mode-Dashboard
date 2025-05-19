// --- Clock ---
function updateClock() {
  const now = new Date();
  const timeString = now
    .toLocaleTimeString('en-US', { hour12: true });
  document.getElementById('clock').textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// --- Greeting ---
function updateGreeting() {
  const hour = new Date().getHours();
  let greeting = "Welcome";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";
  document.getElementById('greeting').textContent = greeting;
}
updateGreeting();

// --- To-Do List ---
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
let pomodoroTime = 25 * 60; 
let timerInterval = null; // help strack whether the timer is running
let isPaused = false;

function updateTimerDisplay() {
  const min = String(Math.floor(pomodoroTime / 60)).padStart(2, '0');
  const sec = String(pomodoroTime % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${min}:${sec}`;
}
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
function pauseTimer() {
  isPaused = !isPaused;
  document.getElementById('pause').textContent = isPaused ? 'Resume' : 'Pause';
}
function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  pomodoroTime = 25 * 60;
  isPaused = false;
  document.getElementById('pause').textContent = 'Pause';
  updateTimerDisplay();
}
document.getElementById('start').onclick = startTimer;
document.getElementById('pause').onclick = pauseTimer;
document.getElementById('reset').onclick = resetTimer;
updateTimerDisplay();

// --- Motivation Quote ---
function setRandomQuote() {
  fetch("https://type.fit/api/quotes")
    .then(response => response.json())
    .then(data => {
      const random = Math.floor(Math.random() * data.length);
      const quote = data[random];
      document.getElementById('quote-text').textContent = `"${quote.text}" — ${quote.author || "Unknown"}`;
    })
    .catch(() => {
      document.getElementById('quote-text').textContent = '"Could not load quote."';
    });
}
document.getElementById('new-quote').onclick = setRandomQuote;
setRandomQuote();