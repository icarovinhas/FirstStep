let currentQ = 0;
let answers  = new Array(25).fill(null);

function initTest() {
  currentQ = 0;
  answers  = new Array(25).fill(null);
  document.getElementById('resultCard').classList.remove('show');
  document.getElementById('questionContainer').style.display = '';
  document.getElementById('testProgress').style.display = '';
  document.getElementById('testNavBar').style.display = '';
  renderQuestion();
}

function renderQuestion() {
  const q     = QUESTIONS[currentQ];
  const total = QUESTIONS.length;

  document.getElementById('progressCount').textContent = `${currentQ + 1} de ${total}`;
  document.getElementById('progressFill').style.width  = `${((currentQ + 1) / total) * 100}%`;

  const letters = ['A', 'B', 'C', 'D', 'E'];
  let html = `<div class="question-card">
    <div class="q-area-tag">${q.area}</div>
    <div class="q-num">Questão ${currentQ + 1} de ${total}</div>
    <div class="q-text">${q.text}</div>
    <div class="options">`;

  q.opts.forEach((opt, i) => {
    const sel = answers[currentQ] === i ? 'selected' : '';
    html += `<div class="option ${sel}" onclick="selectAnswer(${i})">
      <div class="opt-letter">${letters[i]}</div>
      <div class="opt-text">${opt}</div>
    </div>`;
  });

  html += `</div></div>`;
  document.getElementById('questionContainer').innerHTML = html;

  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const navInfo = document.getElementById('testNavInfo');

  btnPrev.style.display = currentQ > 0 ? 'inline-flex' : 'none';

  if (answers[currentQ] !== null) {
    btnNext.style.display  = 'inline-flex';
    btnNext.textContent    = currentQ < total - 1 ? 'Próxima →' : 'Ver Resultado →';
    navInfo.textContent    = '';
  } else {
    btnNext.style.display  = 'none';
    navInfo.textContent    = 'Selecione uma resposta para continuar';
  }
}

function selectAnswer(idx) {
  answers[currentQ] = idx;
  renderQuestion();
}

function nextQuestion() {
  if (answers[currentQ] === null) return;
  if (currentQ < QUESTIONS.length - 1) {
    currentQ++;
    renderQuestion();
  } else {
    showResult();
  }
}

function prevQuestion() {
  if (currentQ > 0) {
    currentQ--;
    renderQuestion();
  }
}

function retakeTest() {
  initTest();
  document.getElementById('resultCard').classList.remove('show');
  document.getElementById('questionContainer').style.display = '';
  document.getElementById('testProgress').style.display      = '';
  document.getElementById('testNavBar').style.display        = '';
}

function showResult() {
  const scores    = { exatas: 0, saude: 0, criativo: 0, negocios: 0 };
  const scoreKeys = ['exatas', 'saude', 'criativo', 'negocios'];

  answers.forEach((ansIdx, qIdx) => {
    if (ansIdx === null) return;
    const p = QUESTIONS[qIdx].pts[ansIdx];
    scores.exatas   += p[0];
    scores.saude    += p[1];
    scores.criativo += p[2];
    scores.negocios += p[3];
  });

  const MAX_PTS  = 50;
  const maxScore = Math.max(...Object.values(scores));
  const winners  = AREA_KEYS.filter(k => scores[k] === maxScore);
  const total    = Object.values(scores).reduce((s, v) => s + v, 0);
  const isMixed  = (total === 0) || (winners.length >= 3) || (maxScore <= 6 && winners.length > 1);
  const winner   = isMixed ? 'misto' : winners[0];
  const res      = RESULTS[winner];

  document.getElementById('questionContainer').style.display = 'none';
  document.getElementById('testProgress').style.display      = 'none';
  document.getElementById('testNavBar').style.display        = 'none';

  document.getElementById('resultIcon').textContent  = res.icon;
  document.getElementById('resultBadge').textContent = res.badge;
  document.getElementById('resultTitle').textContent = res.title;
  document.getElementById('resultDesc').textContent  = res.desc;

  let barsHtml = '';
  AREA_KEYS.forEach((k, i) => {
    const pct = Math.round((scores[k] / MAX_PTS) * 100);
    barsHtml += `<div class="score-bar-row">
      <div class="score-bar-label">
        <span>${AREA_NAMES[i]}</span>
        <span>${scores[k]} pts de 50</span>
      </div>
      <div class="score-bar-track">
        <div class="score-bar-fill" style="width:${pct}%"></div>
      </div>
    </div>`;
  });
  document.getElementById('scoreBarsContainer').innerHTML = barsHtml;

  document.getElementById('resultCourses').innerHTML = res.courses.map(c => `<div class="pill">${c}</div>`).join('');
  document.getElementById('resultJobs').innerHTML    = res.jobs.map(j => `<div class="pill">${j}</div>`).join('');

  document.getElementById('resultCard').classList.add('show');
  window.scrollTo({ top: 200, behavior: 'smooth' });
}
