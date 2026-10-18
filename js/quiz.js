import { lockNavigation, unlockNavigation } from "./navigation.js";

const questions = [
  [
    "What was the primary aim of the Propaganda Movement?",
    [
      "Immediate armed independence",
      "Peaceful reform and equal rights",
      "Replacing Spanish with American rule",
      "Ending all public education",
    ],
    1,
    "The reformists sought representation, civil rights, and better governance.",
  ],
  [
    "Which publication became the movement's leading voice?",
    ["La Solidaridad", "El Filibusterismo", "Kalayaan", "The Manila Times"],
    0,
    "La Solidaridad published reformist essays and arguments.",
  ],
  [
    "Who were key figures alongside Rizal in the reform campaign?",
    [
      "Bonifacio and Aguinaldo",
      "Del Pilar and López Jaena",
      "Luna and Mabini",
      "Sakay and Jacinto",
    ],
    1,
    "Marcelo H. del Pilar and Graciano López Jaena were leading propagandists.",
  ],
  [
    "Why did Rizal found La Liga Filipina?",
    [
      "To organize a civic society for unity",
      "To command the Katipunan",
      "To become governor",
      "To open a military academy",
    ],
    0,
    "The Liga aimed at unity, mutual aid, and social improvement.",
  ],
  [
    "When was La Liga Filipina founded?",
    ["1889", "3 July 1892", "August 1896", "30 December 1896"],
    1,
    "Rizal founded it in Tondo on 3 July 1892.",
  ],
  [
    "Where was Rizal exiled?",
    ["Cebu", "Dapitan", "Hong Kong", "Madrid"],
    1,
    "Dapitan was in Zamboanga, Mindanao.",
  ],
  [
    "Which role did Rizal perform in Dapitan?",
    ["Doctor", "Colonial governor", "Ship captain", "Banker"],
    0,
    "He practiced medicine, especially ophthalmology.",
  ],
  [
    "What organization led the 1896 armed revolution?",
    ["La Solidaridad", "Katipunan", "La Liga Filipina", "Propaganda Club"],
    1,
    "The Katipunan organized for independence through armed struggle.",
  ],
  [
    "When did the Philippine Revolution break into open revolt?",
    ["1889", "3 July 1892", "August 1896", "1901"],
    2,
    "The discovery of the Katipunan helped trigger revolt in August 1896.",
  ],
  [
    "What was Rizal's position toward the revolution?",
    [
      "He led the armed uprising",
      "He advocated reform and did not lead the revolt",
      "He supported Spanish absolutism",
      "He had no political ideas",
    ],
    1,
    "Rizal and the revolutionaries shared opposition to colonial abuse but differed on method and timing.",
  ],
];

const PASSING_SCORE = 8;
let currentQuestion = 0;
let answers = Array(questions.length).fill(null);
let submitted = false;
let validationTimer;

function escapeHTML(value) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char],
  );
}

function renderCurrentQuestion() {
  const question = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];
  document.querySelector("#questions-container").innerHTML = `
    <fieldset class="question-block">
      <legend><h3>${currentQuestion + 1}. ${escapeHTML(question[0])}</h3></legend>
      <div class="answers">
        ${question[1]
          .map(
            (answer, choice) => `
              <label>
                <input type="radio" name="current-question" value="${choice}" ${selectedAnswer === choice ? "checked" : ""}>
                <span>${escapeHTML(answer)}</span>
              </label>`,
          )
          .join("")}
      </div>
    </fieldset>`;

  document
    .querySelectorAll('input[name="current-question"]')
    .forEach((input) => {
      input.addEventListener("change", (event) => {
        answers[currentQuestion] = Number(event.target.value);
        updateQuizUI();
        clearValidation();
      });
    });
}

function updateQuizUI() {
  const answeredCount = answers.filter((answer) => answer !== null).length;
  document.querySelector("#question-count").textContent =
    `Question ${String(currentQuestion + 1).padStart(2, "0")} of ${questions.length}`;
  document.querySelector("#quiz-score").textContent =
    `Answered ${answeredCount} / ${questions.length}`;
  document.querySelector("#quiz-progress-bar").style.width =
    `${((currentQuestion + 1) / questions.length) * 100}%`;
  document.querySelector("#previous-question").disabled =
    currentQuestion === 0 || submitted;
  document.querySelector("#next-question").hidden =
    currentQuestion === questions.length - 1 || submitted;
  document.querySelector("#next-question").disabled =
    answers[currentQuestion] === null;
  document.querySelector("#quiz-form .submit-button").hidden =
    currentQuestion !== questions.length - 1 || submitted;
}

function clearValidation() {
  window.clearTimeout(validationTimer);
  const validation = document.querySelector("#quiz-validation");
  validation.hidden = true;
  validation.innerHTML = "";
}

function showValidation(unanswered) {
  const validation = document.querySelector("#quiz-validation");
  validation.hidden = false;
  validation.innerHTML = `<strong>You still have ${unanswered.length} unanswered question${unanswered.length === 1 ? "" : "s"}.</strong> Please answer every question before submitting.<div class="unanswered-links">${unanswered.map((index) => `<button type="button" data-question-index="${index}">Question ${index + 1}</button>`).join("")}</div>`;
  validation.querySelectorAll("[data-question-index]").forEach((button) => {
    button.addEventListener("click", () => {
      clearValidation();
      currentQuestion = Number(button.dataset.questionIndex);
      renderCurrentQuestion();
      updateQuizUI();
    });
  });
  validationTimer = window.setTimeout(clearValidation, 10000);
}

function showResult(score) {
  const percentage = Math.round((score / questions.length) * 100);
  const passed = score >= PASSING_SCORE;
  const result = document.querySelector("#quiz-result");
  document.querySelector("#answer-sheet-placeholder").hidden = true;
  result.hidden = false;
  result.innerHTML = `<p class="section-label">Final result</p><h3>${score} / ${questions.length}</h3><p class="result-percentage">${percentage}% · <strong class="result-status ${passed ? "passed" : "failed"}">${passed ? "Passed" : "Needs review"}</strong></p><p class="result-threshold">Passing mark: ${PASSING_SCORE} / ${questions.length} (80%).</p><div class="review"><p class="section-label">Answer review</p>${questions.map((q, i) => `<p><strong>${i + 1}. ${escapeHTML(q[1][q[2]])}</strong> — ${escapeHTML(q[3])}</p>`).join("")}</div><button class="primary-button" id="retry-quiz" type="button">Retry quiz <span>↻</span></button>`;
  document.querySelector("#retry-quiz").addEventListener("click", startQuiz);
}

function submitQuiz(event) {
  event.preventDefault();
  if (submitted) return;
  const unanswered = answers.reduce((missing, answer, index) => {
    if (answer === null) missing.push(index);
    return missing;
  }, []);
  if (unanswered.length) {
    showValidation(unanswered);
    return;
  }
  const score = questions.reduce(
    (total, question, index) =>
      total + (answers[index] === question[2] ? 1 : 0),
    0,
  );
  submitted = true;
  showResult(score);
  updateQuizUI();
}

function resetQuizState() {
  currentQuestion = 0;
  answers = Array(questions.length).fill(null);
  submitted = false;
  document.querySelector("#answer-sheet-placeholder").hidden = false;
  document.querySelector("#quiz-result").hidden = true;
  clearValidation();
  renderCurrentQuestion();
  updateQuizUI();
}

let startQuiz;
export function initQuiz() {
  const start = document.querySelector("#start-quiz"),
    intro = document.querySelector("#quiz-intro"),
    active = document.querySelector("#quiz-active"),
    form = document.querySelector("#quiz-form"),
    previous = document.querySelector("#previous-question"),
    next = document.querySelector("#next-question"),
    exit = document.querySelector("#exit-quiz");
  startQuiz = () => {
    document.body.classList.add("quiz-mode");
    intro.hidden = true;
    active.hidden = false;
    resetQuizState();
    lockNavigation();
    document.querySelector("#quiz").scrollIntoView({ behavior: "auto" });
  };
  previous.addEventListener("click", () => {
    if (currentQuestion === 0 || submitted) return;
    clearValidation();
    currentQuestion -= 1;
    renderCurrentQuestion();
    updateQuizUI();
  });
  next.addEventListener("click", () => {
    if (
      currentQuestion === questions.length - 1 ||
      answers[currentQuestion] === null ||
      submitted
    )
      return;
    clearValidation();
    currentQuestion += 1;
    renderCurrentQuestion();
    updateQuizUI();
  });
  exit.addEventListener("click", () => {
    document.body.classList.remove("quiz-mode");
    active.hidden = true;
    intro.hidden = false;
    resetQuizState();
    unlockNavigation();
    document.querySelector("#quiz").scrollIntoView({ behavior: "smooth" });
  });
  start.addEventListener("click", startQuiz);
  form.addEventListener("submit", submitQuiz);
}
