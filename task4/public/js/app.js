// ════════════════════════════════════════════════════
//  SECTION 1: CLIENT-SIDE ROUTING
//  Show/hide pages without reloading
// ════════════════════════════════════════════════════

function showPage(pageName) {
  // Hide ALL pages first
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.classList.remove("active-page");
  });

  // Show the selected page
  const targetPage = document.getElementById("page-" + pageName);
  if (targetPage) {
    targetPage.classList.add("active-page");
  }

  // Update active nav link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  // Find and activate the right nav link
  navLinks.forEach((link) => {
    if (
      link.getAttribute("onclick") &&
      link.getAttribute("onclick").includes(pageName)
    ) {
      link.classList.add("active");
    }
  });

  // Scroll to top
  window.scrollTo(0, 0);
}

// Toggle mobile hamburger menu
function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("open");
}

// ════════════════════════════════════════════════════
//  SECTION 2: REGISTRATION FORM VALIDATION
// ════════════════════════════════════════════════════

// Track which fields are valid
const fieldValidity = {
  name: false,
  email: false,
  phone: false,
  password: false,
  confirm: false,
  gender: false,
  skills: false,
  terms: false,
};

// ── Validate Name ─────────────────────────────────
function validateName(input) {
  const value = input.value.trim();
  const nameRegex = /^[a-zA-Z\s]{2,}$/;
  const errorEl = document.getElementById("regNameError");
  const statusEl = document.getElementById("regNameStatus");

  if (value === "") {
    setFieldError(input, errorEl, statusEl, "Name is required");
    fieldValidity.name = false;
  } else if (!nameRegex.test(value)) {
    setFieldError(
      input,
      errorEl,
      statusEl,
      "Name must be letters only, min 2 characters",
    );
    fieldValidity.name = false;
  } else {
    setFieldSuccess(input, errorEl, statusEl);
    fieldValidity.name = true;
  }
}

// ── Validate Email ────────────────────────────────
function validateEmail(input) {
  const value = input.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errorEl = document.getElementById("regEmailError");
  const statusEl = document.getElementById("regEmailStatus");

  if (value === "") {
    setFieldError(input, errorEl, statusEl, "Email is required");
    fieldValidity.email = false;
  } else if (!emailRegex.test(value)) {
    setFieldError(input, errorEl, statusEl, "Enter a valid email address");
    fieldValidity.email = false;
  } else {
    setFieldSuccess(input, errorEl, statusEl);
    fieldValidity.email = true;
  }
}

// ── Validate Phone ────────────────────────────────
function validatePhone(input) {
  const value = input.value.trim();
  const phoneRegex = /^[0-9]{10}$/;
  const errorEl = document.getElementById("regPhoneError");
  const statusEl = document.getElementById("regPhoneStatus");

  if (value === "") {
    setFieldError(input, errorEl, statusEl, "Phone number is required");
    fieldValidity.phone = false;
  } else if (!phoneRegex.test(value)) {
    setFieldError(input, errorEl, statusEl, "Phone must be exactly 10 digits");
    fieldValidity.phone = false;
  } else {
    setFieldSuccess(input, errorEl, statusEl);
    fieldValidity.phone = true;
  }
}

// ── Validate Password + Strength Meter ────────────
function validatePassword(input) {
  const value = input.value;
  const errorEl = document.getElementById("regPasswordError");

  // Check each rule
  const rules = {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
  };

  // Update each rule icon in the UI
  updateRule("rule-length", rules.length);
  updateRule("rule-upper", rules.upper);
  updateRule("rule-lower", rules.lower);
  updateRule("rule-number", rules.number);
  updateRule("rule-special", rules.special);

  // Count how many rules pass
  const passedRules = Object.values(rules).filter(Boolean).length;

  // Update strength bars
  updateStrengthBars(passedRules);

  // Set validity
  if (value === "") {
    errorEl.textContent = "Password is required";
    fieldValidity.password = false;
  } else if (passedRules < 3) {
    errorEl.textContent = "Password is too weak";
    fieldValidity.password = false;
  } else {
    errorEl.textContent = "";
    fieldValidity.password = true;
  }

  // Also re-validate confirm password
  const confirmInput = document.getElementById("regConfirm");
  if (confirmInput.value) {
    validateConfirm(confirmInput);
  }
}

// Update individual password rule icon
function updateRule(ruleId, passed) {
  const rule = document.getElementById(ruleId);
  const icon = rule.querySelector("i");

  if (passed) {
    rule.classList.add("rule-pass");
    rule.classList.remove("rule-fail");
    icon.className = "bi bi-check-circle-fill";
  } else {
    rule.classList.remove("rule-pass");
    rule.classList.add("rule-fail");
    icon.className = "bi bi-x-circle";
  }
}

// Update the 4 strength bars
function updateStrengthBars(passedCount) {
  const bars = ["bar1", "bar2", "bar3", "bar4"];
  const label = document.getElementById("strengthLabel");

  // Define strength levels
  const levels = [
    { count: 0, color: "#ddd", text: "Enter a password", textColor: "#aaa" },
    { count: 1, color: "#f44336", text: "Very Weak 😟", textColor: "#f44336" },
    { count: 2, color: "#ff9800", text: "Weak 😐", textColor: "#ff9800" },
    { count: 3, color: "#ffc107", text: "Fair 🙂", textColor: "#ffc107" },
    { count: 4, color: "#4caf50", text: "Strong 💪", textColor: "#4caf50" },
    {
      count: 5,
      color: "#2196f3",
      text: "Very Strong 🔒",
      textColor: "#2196f3",
    },
  ];

  // How many bars to fill
  const barsToFill =
    passedCount === 0
      ? 0
      : passedCount <= 1
        ? 1
        : passedCount <= 2
          ? 2
          : passedCount <= 3
            ? 3
            : 4;

  const level = levels[passedCount] || levels[0];

  bars.forEach((barId, index) => {
    const bar = document.getElementById(barId);
    if (index < barsToFill) {
      bar.style.background = level.color;
      bar.style.opacity = "1";
    } else {
      bar.style.background = "#ddd";
      bar.style.opacity = "0.4";
    }
  });

  label.textContent = level.text;
  label.style.color = level.textColor;
}

// ── Validate Confirm Password ─────────────────────
function validateConfirm(input) {
  const password = document.getElementById("regPassword").value;
  const confirm = input.value;
  const errorEl = document.getElementById("regConfirmError");

  if (confirm === "") {
    errorEl.textContent = "Please confirm your password";
    setInputBorder(input, "error");
    fieldValidity.confirm = false;
  } else if (confirm !== password) {
    errorEl.textContent = "❌ Passwords do not match";
    setInputBorder(input, "error");
    fieldValidity.confirm = false;
  } else {
    errorEl.textContent = "✅ Passwords match!";
    errorEl.style.color = "#4caf50";
    setInputBorder(input, "success");
    fieldValidity.confirm = true;
  }
}

// ── Update Form Progress Bar ──────────────────────
function updateProgress() {
  // Check gender
  const gender = document.querySelector('input[name="gender"]:checked');
  fieldValidity.gender = !!gender;

  // Check skills (at least 1)
  const skills = document.querySelectorAll(".checkbox-group input:checked");
  fieldValidity.skills = skills.length >= 1;

  // Check terms
  const terms = document.getElementById("regTerms");
  fieldValidity.terms = terms ? terms.checked : false;

  // Count valid fields
  const totalFields = Object.keys(fieldValidity).length;
  const validFields = Object.values(fieldValidity).filter(Boolean).length;
  const percent = Math.round((validFields / totalFields) * 100);

  // Update progress bar DOM elements
  document.getElementById("progressFill").style.width = percent + "%";
  document.getElementById("progressPercent").textContent = percent + "%";

  // Change color based on progress
  const fill = document.getElementById("progressFill");
  if (percent < 30) {
    fill.style.background = "#f44336";
  } else if (percent < 70) {
    fill.style.background = "#ff9800";
  } else if (percent < 100) {
    fill.style.background = "#ffc107";
  } else {
    fill.style.background = "#4caf50";
  }
}

// ── Handle Registration Submit ────────────────────
function handleRegistration(event) {
  event.preventDefault(); // Stop default form submission

  // Run all validations
  validateName(document.getElementById("regName"));
  validateEmail(document.getElementById("regEmail"));
  validatePhone(document.getElementById("regPhone"));
  validatePassword(document.getElementById("regPassword"));
  validateConfirm(document.getElementById("regConfirm"));
  updateProgress();

  // Check gender
  const gender = document.querySelector('input[name="gender"]:checked');
  if (!gender) {
    document.getElementById("regGenderError").textContent =
      "Please select a gender";
  } else {
    document.getElementById("regGenderError").textContent = "";
  }

  // Check skills
  const skills = document.querySelectorAll(".checkbox-group input:checked");
  if (skills.length === 0) {
    document.getElementById("regSkillsError").textContent =
      "Select at least 1 skill";
  } else {
    document.getElementById("regSkillsError").textContent = "";
  }

  // Check terms
  if (!document.getElementById("regTerms").checked) {
    document.getElementById("regTermsError").textContent =
      "You must agree to terms";
  } else {
    document.getElementById("regTermsError").textContent = "";
  }

  // Check if ALL fields are valid
  const allValid = Object.values(fieldValidity).every(Boolean);

  if (!allValid) {
    // Shake the submit button if invalid
    const btn = document.getElementById("submitRegBtn");
    btn.classList.add("shake");
    setTimeout(() => btn.classList.remove("shake"), 500);
    return;
  }

  // ✅ All valid — show success card
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const phone = document.getElementById("regPhone").value;
  const selectedSkills = [...skills].map((s) => s.value);

  // Hide the form
  document.getElementById("registrationForm").style.display = "none";
  document.querySelector(".form-header").style.display = "none";
  document.querySelector(".form-progress").style.display = "none";

  // Show success card with user's data
  const successCard = document.getElementById("registrationSuccess");
  successCard.style.display = "block";

  document.getElementById("successMessage").textContent =
    `Welcome, ${name}! Your account has been created successfully.`;

  // Build user info card dynamically
  document.getElementById("userCard").innerHTML = `
    <div class="user-info-row">
      <span class="user-label">👤 Name</span>
      <span>${name}</span>
    </div>
    <div class="user-info-row">
      <span class="user-label">📧 Email</span>
      <span>${email}</span>
    </div>
    <div class="user-info-row">
      <span class="user-label">📞 Phone</span>
      <span>${phone}</span>
    </div>
    <div class="user-info-row">
      <span class="user-label">⚡ Skills</span>
      <span>${selectedSkills.join(", ")}</span>
    </div>
    <div class="user-info-row">
      <span class="user-label">🚻 Gender</span>
      <span>${gender.value}</span>
    </div>
  `;
}

// Reset registration form
function resetRegistration() {
  document.getElementById("registrationForm").reset();
  document.getElementById("registrationForm").style.display = "block";
  document.querySelector(".form-header").style.display = "block";
  document.querySelector(".form-progress").style.display = "block";
  document.getElementById("registrationSuccess").style.display = "none";

  // Reset all validity
  Object.keys(fieldValidity).forEach((k) => (fieldValidity[k] = false));
  updateProgress();
  updateStrengthBars(0);
}

// ════════════════════════════════════════════════════
//  SECTION 3: LOGIN FORM
// ════════════════════════════════════════════════════

let loginAttempts = 3;

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const resultEl = document.getElementById("loginResult");
  let isValid = true;

  // Validate email
  if (!email) {
    document.getElementById("loginEmailError").textContent =
      "Email is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById("loginEmailError").textContent =
      "Enter a valid email";
    isValid = false;
  }

  // Validate password
  if (!password) {
    document.getElementById("loginPasswordError").textContent =
      "Password is required";
    isValid = false;
  }

  if (!isValid) return;

  // Simulate login check
  // In a real app this would call an API
  const isCorrect = email === "test@example.com" && password === "Test@1234";

  if (isCorrect) {
    // Show success message dynamically
    resultEl.style.display = "block";
    resultEl.innerHTML = `
      <div class="login-success">
        <div style="font-size: 48px;">👋</div>
        <h3>Welcome back!</h3>
        <p>You logged in as <strong>${email}</strong></p>
        <p style="font-size: 12px; color: #aaa; margin-top: 8px;">
          (This is a demo login)
        </p>
      </div>
    `;
    loginAttempts = 3;
    updateAttemptCounter();
  } else {
    // Reduce attempts
    loginAttempts--;
    updateAttemptCounter();

    resultEl.style.display = "block";

    if (loginAttempts <= 0) {
      // Lock out the user
      resultEl.innerHTML = `
        <div class="login-error">
          🔒 Account temporarily locked.<br/>
          Too many failed attempts.<br/>
          <small>Try: test@example.com / Test@1234</small>
        </div>
      `;
      document.querySelector('#loginForm button[type="submit"]').disabled =
        true;
    } else {
      resultEl.innerHTML = `
        <div class="login-error">
          ❌ Invalid email or password.<br/>
          <small>Hint: test@example.com / Test@1234</small>
        </div>
      `;
    }
  }
}

// Update the attempt counter display
function updateAttemptCounter() {
  const el = document.getElementById("attemptText");
  const counter = document.getElementById("attemptCounter");

  if (loginAttempts <= 0) {
    el.textContent = "Account locked!";
    counter.style.background = "#fff0f0";
    counter.style.borderColor = "#f44336";
    counter.style.color = "#f44336";
  } else if (loginAttempts === 1) {
    el.textContent = `⚠️ ${loginAttempts} attempt remaining!`;
    counter.style.background = "#fff3e0";
    counter.style.borderColor = "#ff9800";
    counter.style.color = "#ff9800";
  } else {
    el.textContent = `${loginAttempts} attempts remaining`;
  }
}

function clearFieldError(id) {
  document.getElementById(id).textContent = "";
}

// ════════════════════════════════════════════════════
//  SECTION 4: TODO LIST — Full DOM Manipulation
// ════════════════════════════════════════════════════

// Array that stores all todos
let todos = [];
let todoIdCounter = 1;
let currentFilter = "all";

// Add a new todo
function addTodo() {
  const input = document.getElementById("todoInput");
  const priority = document.getElementById("todoPriority").value;
  const text = input.value.trim();
  const errorEl = document.getElementById("todoError");

  if (text === "") {
    errorEl.textContent = "⚠ Please enter a task first";
    input.focus();
    setTimeout(() => (errorEl.textContent = ""), 2000);
    return;
  }

  if (text.length < 3) {
    errorEl.textContent = "⚠ Task must be at least 3 characters";
    setTimeout(() => (errorEl.textContent = ""), 2000);
    return;
  }

  // Create todo object
  const todo = {
    id: todoIdCounter++,
    text: text,
    priority: priority,
    done: false,
    createdAt: new Date().toLocaleTimeString(),
  };

  todos.push(todo);

  // Clear input
  input.value = "";
  errorEl.textContent = "";

  // Re-render the todo list
  renderTodos();
  updateTodoStats();

  // Focus back on input for easy entry
  input.focus();
}

// Render todos to the DOM
function renderTodos() {
  const list = document.getElementById("todoList");
  const emptyEl = document.getElementById("emptyState");

  // Filter todos based on current filter
  let filtered = todos;
  if (currentFilter === "active") {
    filtered = todos.filter((t) => !t.done);
  } else if (currentFilter === "completed") {
    filtered = todos.filter((t) => t.done);
  } else if (currentFilter === "high") {
    filtered = todos.filter((t) => t.priority === "high");
  }

  // Show empty state if no todos
  if (filtered.length === 0) {
    list.innerHTML = "";
    list.appendChild(createEmptyState());
    return;
  }

  // Build HTML for each todo
  list.innerHTML = "";
  filtered.forEach((todo) => {
    const item = createTodoItem(todo);
    list.appendChild(item);
  });
}

// Create a single todo item element
function createTodoItem(todo) {
  const div = document.createElement("div");
  div.className = `todo-item priority-${todo.priority} ${todo.done ? "todo-done" : ""}`;
  div.id = `todo-${todo.id}`;

  const priorityEmoji = {
    low: "🟢",
    medium: "🟡",
    high: "🔴",
  };

  div.innerHTML = `
    <div class="todo-left">
      <button
        class="todo-check ${todo.done ? "checked" : ""}"
        onclick="toggleTodo(${todo.id})"
        title="${todo.done ? "Mark incomplete" : "Mark complete"}"
      >
        ${todo.done ? '<i class="bi bi-check-lg"></i>' : ""}
      </button>
      <div class="todo-text-wrap">
        <p class="todo-text ${todo.done ? "strikethrough" : ""}">
          ${priorityEmoji[todo.priority]} ${todo.text}
        </p>
        <span class="todo-time">${todo.createdAt}</span>
      </div>
    </div>
    <div class="todo-actions">
      <span class="priority-tag priority-tag-${todo.priority}">
        ${todo.priority}
      </span>
      <button
        class="todo-delete"
        onclick="deleteTodo(${todo.id})"
        title="Delete task"
      >
        <i class="bi bi-trash"></i>
      </button>
    </div>
  `;

  return div;
}

// Create empty state element
function createEmptyState() {
  const div = document.createElement("div");
  div.className = "empty-state";
  div.innerHTML = `
    <i class="bi bi-inbox"></i>
    <p>No tasks here!</p>
  `;
  return div;
}

// Toggle todo complete/incomplete
function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    renderTodos();
    updateTodoStats();
  }
}

// Delete a todo
function deleteTodo(id) {
  // Add fade-out animation first
  const item = document.getElementById("todo-" + id);
  if (item) {
    item.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => {
      todos = todos.filter((t) => t.id !== id);
      renderTodos();
      updateTodoStats();
    }, 300);
  }
}

// Filter todos
function filterTodos(filter, btn) {
  currentFilter = filter;

  // Update active filter button
  document.querySelectorAll(".filter-btn").forEach((b) => {
    b.classList.remove("active");
  });
  btn.classList.add("active");

  renderTodos();
}

// Clear all completed todos
function clearCompleted() {
  todos = todos.filter((t) => !t.done);
  renderTodos();
  updateTodoStats();
}

// Update the stats counters
function updateTodoStats() {
  const total = todos.length;
  const done = todos.filter((t) => t.done).length;
  const active = total - done;

  document.getElementById("totalCount").textContent = total;
  document.getElementById("activeCount").textContent = active;
  document.getElementById("doneCount").textContent = done;
  document.getElementById("remainingText").textContent =
    `${active} task${active !== 1 ? "s" : ""} remaining`;
}

// ════════════════════════════════════════════════════
//  SECTION 5: QUIZ APP — Dynamic DOM
// ════════════════════════════════════════════════════

// Quiz questions data
const questions = [
  {
    question: "What does DOM stand for?",
    options: [
      "Document Object Model",
      "Data Object Management",
      "Document Order Model",
      "Display Object Method",
    ],
    correct: 0,
  },
  {
    question: "Which method selects an element by its ID?",
    options: [
      "document.querySelector()",
      "document.getElement()",
      "document.getElementById()",
      "document.findById()",
    ],
    correct: 2,
  },
  {
    question: "What does 'event.preventDefault()' do?",
    options: [
      "Deletes the event",
      "Stops the default browser action",
      "Creates a new event",
      "Pauses JavaScript execution",
    ],
    correct: 1,
  },
  {
    question: "Which is the correct way to add a CSS class in JS?",
    options: [
      "element.style.add('class')",
      "element.addClass('class')",
      "element.classList.add('class')",
      "element.class = 'class'",
    ],
    correct: 2,
  },
  {
    question: "What does 'innerHTML' do?",
    options: [
      "Adds an event listener",
      "Gets or sets the HTML inside an element",
      "Removes an element",
      "Changes the element's style",
    ],
    correct: 1,
  },
];

let currentQuestion = 0;
let score = 0;
let timerInterval = null;
let timeLeft = 30;
let userAnswers = [];

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  timeLeft = 30;
  userAnswers = [];

  // Hide start, show question
  document.getElementById("quizStart").style.display = "none";
  document.getElementById("quizQuestion").style.display = "block";
  document.getElementById("quizResult").style.display = "none";

  showQuestion();
}

function showQuestion() {
  const q = questions[currentQuestion];

  // Update question number and progress
  document.getElementById("questionNumber").textContent =
    `Question ${currentQuestion + 1}/${questions.length}`;

  const progress = (currentQuestion / questions.length) * 100;
  document.getElementById("quizProgress").style.width = progress + "%";

  // Set question text
  document.getElementById("questionText").textContent = q.question;

  // Build answer buttons dynamically
  const optionsEl = document.getElementById("answerOptions");
  optionsEl.innerHTML = "";

  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = option;
    btn.onclick = () => selectAnswer(index);
    optionsEl.appendChild(btn);
  });

  // Hide feedback and next button
  document.getElementById("quizFeedback").style.display = "none";
  document.getElementById("nextBtn").style.display = "none";

  // Start timer
  startTimer();
}

function startTimer() {
  timeLeft = 30;
  document.getElementById("timerCount").textContent = timeLeft;

  const timerEl = document.getElementById("quizTimer");
  timerEl.style.color = "#333";
  timerEl.style.background = "#f0f0f5";

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timerCount").textContent = timeLeft;

    // Turn red when under 10 seconds
    if (timeLeft <= 10) {
      timerEl.style.color = "#f44336";
      timerEl.style.background = "#fff0f0";
    }

    // Time's up
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeUp();
    }
  }, 1000);
}

function timeUp() {
  // Disable all answer buttons
  document.querySelectorAll(".answer-btn").forEach((btn) => {
    btn.disabled = true;
  });

  // Highlight correct answer
  const correctIndex = questions[currentQuestion].correct;
  const btns = document.querySelectorAll(".answer-btn");
  btns[correctIndex].classList.add("correct");

  // Show feedback
  const feedback = document.getElementById("quizFeedback");
  feedback.style.display = "block";
  feedback.className = "quiz-feedback feedback-wrong";
  feedback.innerHTML = `⏰ Time's up! The correct answer was: <strong>${questions[currentQuestion].options[correctIndex]}</strong>`;

  userAnswers.push({ selected: -1, correct: correctIndex });

  // Show next button
  document.getElementById("nextBtn").style.display = "block";
  document.getElementById("nextBtn").textContent =
    currentQuestion === questions.length - 1
      ? "See Results"
      : "Next Question →";
}

function selectAnswer(selectedIndex) {
  clearInterval(timerInterval);

  const q = questions[currentQuestion];
  const isCorrect = selectedIndex === q.correct;

  // Record answer
  userAnswers.push({ selected: selectedIndex, correct: q.correct });

  if (isCorrect) score++;

  // Disable all buttons
  const btns = document.querySelectorAll(".answer-btn");
  btns.forEach((btn) => (btn.disabled = true));

  // Color correct and wrong answers
  btns[q.correct].classList.add("correct");
  if (!isCorrect) {
    btns[selectedIndex].classList.add("wrong");
  }

  // Show feedback
  const feedback = document.getElementById("quizFeedback");
  feedback.style.display = "block";

  if (isCorrect) {
    feedback.className = "quiz-feedback feedback-correct";
    feedback.innerHTML = `✅ Correct! Well done!`;
  } else {
    feedback.className = "quiz-feedback feedback-wrong";
    feedback.innerHTML = `❌ Wrong! Correct: <strong>${q.options[q.correct]}</strong>`;
  }

  // Show next button
  const nextBtn = document.getElementById("nextBtn");
  nextBtn.style.display = "block";
  nextBtn.textContent =
    currentQuestion === questions.length - 1
      ? "🏁 See Results"
      : "Next Question →";
}

function nextQuestion() {
  currentQuestion++;

  if (currentQuestion >= questions.length) {
    showResult();
  } else {
    showQuestion();
  }
}

function showResult() {
  clearInterval(timerInterval);

  // Hide question, show result
  document.getElementById("quizQuestion").style.display = "none";
  document.getElementById("quizResult").style.display = "block";

  // Update progress to 100%
  document.getElementById("quizProgress").style.width = "100%";

  // Score display
  document.getElementById("scoreNumber").textContent = score;

  // Message based on score
  let emoji, title, message;
  if (score === 5) {
    emoji = "🏆";
    title = "Perfect Score!";
    message = "Outstanding! You got everything right!";
  } else if (score >= 4) {
    emoji = "🎉";
    title = "Excellent!";
    message = "Great job! Almost perfect!";
  } else if (score >= 3) {
    emoji = "👍";
    title = "Good Job!";
    message = "You passed! Keep practicing.";
  } else if (score >= 2) {
    emoji = "😐";
    title = "Not Bad";
    message = "You need more practice.";
  } else {
    emoji = "😟";
    title = "Keep Trying!";
    message = "Study more and try again!";
  }

  document.getElementById("resultEmoji").textContent = emoji;
  document.getElementById("resultTitle").textContent = title;
  document.getElementById("scoreMessage").textContent = message;

  // Build answer review
  const review = document.getElementById("answerReview");
  review.innerHTML = '<h4 style="margin-bottom: 16px;">Answer Review:</h4>';

  questions.forEach((q, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer && userAnswer.selected === q.correct;

    review.innerHTML += `
      <div class="review-item ${isCorrect ? "review-correct" : "review-wrong"}">
        <div class="review-q">
          ${isCorrect ? "✅" : "❌"}
          Q${index + 1}: ${q.question}
        </div>
        <div class="review-a">
          Your answer: <strong>
            ${
              userAnswer.selected >= 0
                ? q.options[userAnswer.selected]
                : "No answer (time up)"
            }
          </strong>
          ${!isCorrect ? `<br/>Correct: <strong style="color:#4caf50">${q.options[q.correct]}</strong>` : ""}
        </div>
      </div>
    `;
  });
}

function restartQuiz() {
  document.getElementById("quizResult").style.display = "none";
  document.getElementById("quizStart").style.display = "block";
}

// ════════════════════════════════════════════════════
//  SECTION 6: HELPER FUNCTIONS
// ════════════════════════════════════════════════════

// Set field to error state
function setFieldError(input, errorEl, statusEl, message) {
  errorEl.textContent = message;
  errorEl.style.color = "#f44336";
  setInputBorder(input, "error");
  if (statusEl) {
    statusEl.innerHTML =
      '<i class="bi bi-x-circle-fill" style="color:#f44336"></i>';
  }
}

// Set field to success state
function setFieldSuccess(input, errorEl, statusEl) {
  errorEl.textContent = "";
  setInputBorder(input, "success");
  if (statusEl) {
    statusEl.innerHTML =
      '<i class="bi bi-check-circle-fill" style="color:#4caf50"></i>';
  }
}

// Change input border color
function setInputBorder(input, state) {
  if (state === "error") {
    input.style.borderColor = "#f44336";
    input.style.boxShadow = "0 0 0 3px rgba(244,67,54,0.1)";
  } else {
    input.style.borderColor = "#4caf50";
    input.style.boxShadow = "0 0 0 3px rgba(76,175,80,0.1)";
  }
}

// Toggle password show/hide
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon = btn.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon.className = "bi bi-eye-slash";
  } else {
    input.type = "password";
    icon.className = "bi bi-eye";
  }
}
