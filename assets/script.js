const ROADMAP = {

  "July":      { icon: "💻", tasks: ["JavaScript basics","HTML + CSS advanced","Portfolio website","Git + GitHub"] },

  "August":    { icon: "⚙️", tasks: ["Node.js basics","Express APIs","MongoDB / Firebase","Login system"] },

  "September": { icon: "🧠", tasks: ["Python basics","Neural networks intro","PyTorch basics","Small AI model"] },

  "October":   { icon: "🤖", tasks: ["Transformers deep dive","Tokenization","Hugging Face","Chatbot project"] },

  "November":  { icon: "🔍", tasks: ["RAG systems","Embeddings","Vector DB basics","AI assistant project"] },

  "December":  { icon: "🚀", tasks: ["Deployment","Capstone project","AI portfolio site","Revision + polish"] }

};



function loadState() {

  try { return JSON.parse(localStorage.getItem("roadmap_dark") || "{}"); } catch { return {}; }

}

function saveState(s) {

  try { localStorage.setItem("roadmap_dark", JSON.stringify(s)); } catch {}

}



let state = loadState();



function toggle(month, task) {

  if (!state[month]) state[month] = {};

  state[month][task] = !state[month][task];

  saveState(state);

  render();

}



function getOverall() {

  let total = 0, done = 0;

  for (const m in ROADMAP) {

    ROADMAP[m].tasks.forEach(t => { total++; if (state[m]?.[t]) done++; });

  }

  return { total, done, pct: total ? Math.round((done/total)*100) : 0 };

}



function getMonthStats(month) {

  const tasks = ROADMAP[month].tasks;

  const done = tasks.filter(t => state[month]?.[t]).length;

  return { done, total: tasks.length, pct: Math.round((done/tasks.length)*100) };

}



function getMonthsComplete() {

  return Object.keys(ROADMAP).filter(m => {

    const { done, total } = getMonthStats(m);

    return done === total;

  }).length;

}



function render() {

  const { total, done, pct } = getOverall();

  const monthsComplete = getMonthsComplete();



  // Stats

  const statsRow = document.getElementById("stats-row");

  statsRow.innerHTML = `

    <div class="stat-card">

      <div class="stat-label">Tasks done</div>

      <div class="stat-value accent">${done}</div>

      <div class="stat-sub">of ${total} total</div>

    </div>

    <div class="stat-card">

      <div class="stat-label">Months complete</div>

      <div class="stat-value">${monthsComplete}</div>

      <div class="stat-sub">of ${Object.keys(ROADMAP).length} months</div>

    </div>

    <div class="stat-card">

      <div class="stat-label">Progress</div>

      <div class="stat-value accent">${pct}%</div>

      <div class="stat-sub">overall completion</div>

    </div>

    <div class="stat-card">

      <div class="stat-label">Remaining</div>

      <div class="stat-value">${total - done}</div>

      <div class="stat-sub">tasks left</div>

    </div>

  `;



  // Overall bar

  document.getElementById("overall-fill").style.width = pct + "%";

  document.getElementById("overall-pct").textContent = pct + "%";



  // Month dots

  const dotsEl = document.getElementById("month-dots");

  dotsEl.innerHTML = Object.entries(ROADMAP).map(([month]) => {

    const { done: md, total: mt } = getMonthStats(month);

    const allDone = md === mt;

    const cls = allDone ? "month-dot done-dot" : "month-dot";

    return `<span class="${cls}" onclick="document.getElementById('card-${month}').scrollIntoView({behavior:'smooth',block:'nearest'})">${month} ${md}/${mt}</span>`;

  }).join("");



  // Sidebar nav

  const nav = document.getElementById("sidebar-nav");

  nav.innerHTML = Object.entries(ROADMAP).map(([month]) => {

    const { done: md, total: mt } = getMonthStats(month);

    const allDone = md === mt;

    return `<a class="nav-item${allDone ? " done-nav" : ""}" onclick="document.getElementById('card-${month}').scrollIntoView({behavior:'smooth',block:'start'})" href="#">

      <span class="dot"></span>${month} <span style="margin-left:auto;font-size:10.5px;color:var(--text-muted)">${md}/${mt}</span>

    </a>`;

  }).join("");



  // Cards

  const grid = document.getElementById("months-grid");

  grid.innerHTML = "";



  Object.entries(ROADMAP).forEach(([month, { icon, tasks }], idx) => {

    const { done: md, total: mt, pct: mp } = getMonthStats(month);

    const allDone = md === mt;



    const card = document.createElement("div");

    card.className = "month-card" + (allDone ? " all-done" : "");

    card.id = "card-" + month;

    card.style.animationDelay = (idx * 0.07) + "s";



    const badge = allDone

      ? `<span class="month-badge badge-done">Complete ✓</span>`

      : `<span class="month-badge badge-default">${md} / ${mt}</span>`;



    const taskItems = tasks.map(task => {

      const isDone = !!state[month]?.[task];

      return `<div class="task-item${isDone ? " done" : ""}" onclick="toggle('${month}','${task.replace(/'/g,"\\'")}')" role="button" tabindex="0" aria-pressed="${isDone}" aria-label="${task}">

        <div class="task-check" aria-hidden="true">

          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

            <polyline points="1.5,5 4,7.5 8.5,2.5"/>

          </svg>

        </div>

        <span class="task-label">${task}</span>

      </div>`;

    }).join("");



    card.innerHTML = `

      <div class="card-header">

        <div class="card-header-left">

          <div class="month-icon" aria-hidden="true">${icon}</div>

          <div>

            <div class="month-title">${month}</div>

            <div class="month-num">${md} of ${mt} tasks</div>

          </div>

        </div>

        ${badge}

      </div>

      <div class="task-list">${taskItems}</div>

      <div class="card-footer">

        <div class="card-mini-bar">

          <div class="card-mini-fill" style="width:${mp}%"></div>

        </div>

        <div class="card-footer-text">

          <span>${mp}% complete</span>

          ${allDone ? '<span style="color:var(--complete-text)">All done ✓</span>' : `<span>${mt - md} remaining</span>`}

        </div>

      </div>`;



    grid.appendChild(card);

  });



  card_keyboard();

}



function card_keyboard() {

  document.querySelectorAll('.task-item').forEach(el => {

    el.addEventListener('keydown', e => {

      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }

    });

  });

}



// Date

const d = new Date();

document.getElementById("sidebar-date").textContent = d.toLocaleDateString("en-IN", {

  weekday: "short", year: "numeric", month: "short", day: "numeric"

});



// Goal input

const goalInput = document.getElementById("goal-input");

try { goalInput.value = localStorage.getItem("goal_dark") || ""; } catch {}

goalInput.addEventListener("input", e => {

  try { localStorage.setItem("goal_dark", e.target.value); } catch {}

});



render();
