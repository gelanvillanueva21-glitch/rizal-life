import { lockNavigation } from "./navigation.js";
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
    "What forms did the Propaganda Movement use most?",
    [
      "Secret raids",
      "Writing and journalism",
      "Tax collection",
      "Military drills",
    ],
    1,
    "Print culture gave reform ideas a broad public audience.",
  ],
  [
    "What larger idea did the movement help develop?",
    [
      "A shared Filipino identity",
      "A return to feudalism",
      "Spanish royalism",
      "Isolation from Asia",
    ],
    0,
    "Its work helped Filipinos imagine shared political belonging.",
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
    "Which was a goal of the Liga?",
    [
      "Mutual assistance",
      "Censorship of books",
      "Private wealth for members",
      "Foreign conquest",
    ],
    0,
    "Mutual aid was central to the association.",
  ],
  [
    "What happened to Rizal soon after the Liga was founded?",
    [
      "He became president",
      "He was arrested and exiled",
      "He fled to Japan permanently",
      "He joined the army",
    ],
    1,
    "His arrest was followed by exile to Dapitan.",
  ],
  [
    "How is La Liga historically significant?",
    [
      "It modeled organized civic solidarity",
      "It ended Spanish rule immediately",
      "It was a newspaper in Madrid",
      "It opposed education",
    ],
    0,
    "Its civic vision outlasted the short-lived organization.",
  ],
  [
    "Where was Rizal exiled?",
    ["Cebu", "Dapitan", "Hong Kong", "Madrid"],
    1,
    "Dapitan was in Zamboanga, Mindanao.",
  ],
  [
    "How long did his exile last?",
    ["1890—1892", "1892—1896", "1896—1898", "1882—1887"],
    1,
    "Rizal lived in Dapitan from 1892 until 1896.",
  ],
  [
    "Which role did Rizal perform in Dapitan?",
    ["Doctor", "Colonial governor", "Ship captain", "Banker"],
    0,
    "He practiced medicine, especially ophthalmology.",
  ],
  [
    "What did Rizal do as an educator in Dapitan?",
    [
      "Taught boys practical subjects",
      "Banned local schools",
      "Opened a military prison",
      "Only taught in Spain",
    ],
    0,
    "His school connected learning with practical work and character.",
  ],
  [
    "Which best describes his community work?",
    [
      "Water, agriculture, and public improvements",
      "Building warships",
      "Tax farming",
      "Closing the town market",
    ],
    0,
    "He applied science and labor to improve local life.",
  ],
  [
    "What organization led the 1896 armed revolution?",
    ["La Solidaridad", "Katipunan", "La Liga Filipina", "Propaganda Club"],
    1,
    "The Katipunan organized for independence through armed struggle.",
  ],
  [
    "Who was a principal founder of the Katipunan?",
    ["Andrés Bonifacio", "Marcelo del Pilar", "Pedro Paterno", "Antonio Luna"],
    0,
    "Bonifacio was a principal founder and leader.",
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
  [
    "Why did Rizal's execution matter to nationalism?",
    [
      "It made him a powerful symbol",
      "It ended all resistance",
      "It made him governor",
      "It erased his writings",
    ],
    0,
    "His martyrdom intensified the emotional and moral force of the national cause.",
  ],
];
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
function renderQuestions() {
  document.querySelector("#questions-container").innerHTML = questions
    .map(
      (q, index) =>
        `<fieldset class="question-block"><legend><h3>${index + 1}. ${escapeHTML(q[0])}</h3></legend><div class="answers">${q[1].map((answer, choice) => `<label><input type="radio" name="question-${index}" value="${choice}"> <span>${escapeHTML(answer)}</span></label>`).join("")}</div></fieldset>`,
    )
    .join("");
}
function showResult(score) {
  const result = document.querySelector("#quiz-result");
  result.hidden = false;
  result.innerHTML = `<h3>You scored ${score} / 20.</h3><p>${score >= 16 ? "A strong reading of the exhibit." : score >= 10 ? "A thoughtful start — revisit the chapters to deepen the connections." : "The archive is worth another visit. Try again and follow the through-line."}</p><div class="review">${questions.map((q, i) => `<p><strong>${i + 1}. ${escapeHTML(q[1][q[2]])}</strong> — ${escapeHTML(q[3])}</p>`).join("")}</div><button class="primary-button" id="retry-quiz" type="button">Retry quiz <span>↻</span></button>`;
  document.querySelector("#retry-quiz").addEventListener("click", startQuiz);
}
function submitQuiz(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const unanswered = questions.findIndex((_, i) => !form.get(`question-${i}`));
  if (unanswered !== -1) {
    alert(`Please answer question ${unanswered + 1} before submitting.`);
    document
      .querySelectorAll(".question-block")
      [unanswered].scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  let score = 0;
  questions.forEach((q, i) => {
    if (Number(form.get(`question-${i}`)) === q[2]) score++;
  });
  document.querySelector("#quiz-score").textContent = `Score ${score} / 20`;
  showResult(score);
  event.target.querySelector(".submit-button").hidden = true;
}
let startQuiz;
export function initQuiz() {
  const start = document.querySelector("#start-quiz"),
    intro = document.querySelector("#quiz-intro"),
    active = document.querySelector("#quiz-active"),
    form = document.querySelector("#quiz-form");
  startQuiz = () => {
    intro.hidden = true;
    active.hidden = false;
    renderQuestions();
    form.querySelector(".submit-button").hidden = false;
    document.querySelector("#quiz-result").hidden = true;
    document.querySelector("#quiz-score").textContent = "Score —";
    lockNavigation();
    document.querySelector("#quiz").scrollIntoView({ behavior: "smooth" });
  };
  start.addEventListener("click", startQuiz);
  form.addEventListener("submit", submitQuiz);
}
