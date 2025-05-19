
const capitalise = s => s.charAt(0).toUpperCase() + s.slice(1);

function addFact(text) {
  return `\n\n<div class="fact">${text}</div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    const burgerIcon = document.getElementById('burger-icon');
    const navLinksContainer = document.getElementById('nav-links-container');

    if (burgerIcon && navLinksContainer) {
        burgerIcon.addEventListener('click', () => {
            // Toggle the .active class on the nav links container
            navLinksContainer.classList.toggle('active');

            // Toggle the .active class on the burger icon itself (for X animation)
            burgerIcon.classList.toggle('active');

            // Update ARIA attribute for accessibility
            const isExpanded = navLinksContainer.classList.contains('active');
            burgerIcon.setAttribute('aria-expanded', isExpanded);
        });
    }
});

/* cookie helpers */
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}
function getCookie(name) {
  const eq = `${name}=`;
  return document.cookie
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(eq))
    ?.substring(eq.length) || null;
}

function yesNoConfirm(msg) {
  return new Promise(res => {
    const o = document.createElement('div');
    o.className = 'modal-overlay';
    o.innerHTML = `
      <div class="modal">
        <p>${msg}</p>
        <button id="yesBtn">Yes</button>
        <button id="noBtn">No</button>
      </div>`;
    document.body.appendChild(o);
    o.querySelector('#yesBtn').onclick = () => { o.remove(); res(true); };
    o.querySelector('#noBtn').onclick = () => { o.remove(); res(false); };
  });
}

/* random reply for confront path */
function randomResponse() {
  const r = [
    'Hey wena leave me alone!',
    "I can't afford electricity",
    'V**tsek wena!',
    "I'm not scared of you",
    'Who are you?',
    '*waves finger at you*'
  ];
  return r[Math.floor(Math.random() * r.length)];
}

/* =========  DATA  ========= */

class CitizenType {
  constructor(role, motivations, frustrations, techSavviness) {
    Object.assign(this, { role, motivations, frustrations, techSavviness });
  }
  describe() {
    return `As a ${this.role}. Motivations: ${this.motivations.join(', ')}. ` +
           `Frustrations: ${this.frustrations.join(', ')}. ` +
           `Tech‑savviness: ${this.techSavviness}.`;
  }
}

const citizenTypes = [
  new CitizenType(
    'concerned citizen',
    ['upholding the law', 'community well‑being', 'safety of essential services'],
    ['occasional power cuts', 'increasing electricity bills', 'injustice'],
    'Comfortable with basic smartphone use and social media'),
  new CitizenType(
    'struggling parent',
    ["providing for your child's needs", 'having electricity for basic needs'],
    ['worries about money', 'unreliable electricity supply', 'feeling marginalised'],
    'Basic mobile phone user'),
  new CitizenType(
    'apathetic resident',
    ['your own convenience', 'avoiding conflict'],
    ['power cuts disrupting work/leisure', 'getting involved in community issues'],
    'Highly tech‑savvy, passive observer on social media')
];

/* =========  SCENES  ========= */

const storyScenes = {
  introduction: {
    text: `In the vibrant community of Randburg, a hidden danger lurks: illegal electrical connections. Choose what kind of citizen you are:`,
    choices: citizenTypes.map((type, index) => ({
      text: type.role.charAt(0).toUpperCase() + type.role.slice(1),
      next: `citizen_intro_${index}`
    }))
  },
  citizen_intro_0: {
    text: citizenTypes[0].describe() + "\nToday, you notice something suspicious...",
    choices: [{ text: "Continue", next: "start" }]
  },
  citizen_intro_1: {
    text: citizenTypes[1].describe() + "\nDesperation is growing, and today you see something that catches your eye...",
    choices: [{ text: "Continue", next: "start" }]
  },
  citizen_intro_2: {
    text: citizenTypes[2].describe() + "\nYou happen to notice something unusual...",
    choices: [{ text: "Continue", next: "start" }]
  },
  start: {
    text: "Someone is climbing a pylon, illegally connecting to the power supply. What do you do?"+
    addFact('⚡ Did you know? Illegal connections cost South Africa roughly <strong>R15 billion</strong> in lost revenue each year.'),
    choices: [
      { text: "Report it", next: "report_area_check" },
      { text: "Walk past", next: "walk_past" },
      { text: "Confront the person", next: "confront_prompt" }
    ]
  },
  // —— Reporting path —— //
  report_area_check: {
    text: "You realise they're connecting to your area's supply for free electricity. Do you still want to report this?",
    type: "confirm",
    choices: [
      { text: "Yes", next: "report_yes" },
      { text: "No", next: "report_no" }
    ]
  },
  report_yes: {
    text: "Authorities arrive, educate the community about legal alternatives, and illegal connections reduce over time." +
    addFact('📉 Areas that remove unsafe wiring see an average <strong>25 % drop</strong> in unplanned outages within six months.'),
    choices: [],
    postText: "cta"
  },
  report_no: {
    text: "You ignore it, but weeks later power surges cause widespread damage. You now have to pay for repairs, and you realise illegal connections cause more harm than good."+
     addFact('🕯️ A single substation failure can leave up to <strong>8 000 homes</strong> without power.'),
    choices: [],
    postText: "table" // triggers alternatives table
  },
  // —— Walk past path —— //
  walk_past: {
    text: "Municipal workers stop you and ask if you've seen anything. Do you tell them?",
    choices: [
      { text: "Yes, report it", next: "walk_past_report" },
      { text: "No, stay quiet", next: "walk_past_quiet" }
    ]
  },
  walk_past_report: {
    text: "The workers disconnect the wiring and organise a community meeting about safer alternatives.",
    choices: [],
   postText: "cta"
  },
  walk_past_quiet: {
    text: "A few hours later, a massive blackout hits due to system failure. Now the entire area suffers, including you. At a town meeting, they discuss ways to prevent future blackouts, the importance of reporting and you realise you could have spoken up sooner."+
    addFact('💡 Eskom’s <strong>Home Solar Programme</strong> can cut household bills by up to <strong>40 %</strong>.'),
    choices: [],
    postText: "table"
  },
  // —— Confront path —— //
  confront_prompt: {
    text: "You decide to confront the person. What do you say?",
    type: "prompt",
    promptText: "Enter your message:",
    choices: [{ text: "Continue", next: "confront_random_response" }]
  },
  confront_random_response: {
    text: "", // Filled dynamically with random response
    type: "alert",
    choices: [{ text: "Continue", next: "confront" }]
  },
  confront: {
    text: "After that response, do you report or help?",
    choices: [
      { text: "Report them", next: "confront_report" },
      { text: "Help them find legal alternatives", next: "confront_help" }
    ]
  },
  confront_report: {
    text: "Authorities arrive, and the person faces legal trouble. However, at a local meeting, you hear about subsidy programmes that could have helped them. Did they deserve to know?",
    choices: [],
    postText: "table"
  },
  confront_help: {
    text: "You help them apply for subsidies. Weeks later, they have safe electricity and help others too.",
    choices: [],
    postText: "cta"
  }
};
/* =========  ENGINE  ========= */

const storyTextElement = document.getElementById('story-text');
const choicesContainer = document.getElementById('choices');
const progressBar      = document.getElementById('progress-bar');

let currentScene = 'introduction';
let sceneHistory = ['introduction'];

function updateProgressBar() {
  if (!progressBar) return;
  const pct = (sceneHistory.length - 1) /
              (Object.keys(storyScenes).length - 1) * 100; // ← Fix #2
  progressBar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
}

/* main driver */
async function updateStory(sceneName) {
  currentScene = sceneName;
  sceneHistory.push(sceneName);
  updateProgressBar();

  const scene = storyScenes[sceneName];
  if (!scene) return;

  /* special scene types */
  if (scene.type === 'alert') {
    alert(scene.text || '');                           // ← small safety
    return updateStory(scene.choices[0].next);
  }
  if (scene.type === 'confirm') {
    const ok = await yesNoConfirm(scene.text);
    return updateStory(ok ? scene.choices[0].next : scene.choices[1].next);
  }
  if (scene.type === 'prompt') {
    const resp = prompt(scene.promptText);
    if (resp !== null) {
      storyScenes.confront_random_response.text = randomResponse();
      return updateStory(scene.choices[0].next);
    }
    return updateStory('start'); // cancelled prompt
  }

  /* normal scene */
  if (storyTextElement) storyTextElement.innerHTML = scene.text;
  if (choicesContainer) choicesContainer.innerHTML = '';

  // end‑scenes
  if (scene.choices.length === 0) {
    if (scene.postText === 'cta')   return displayCTA();
    if (scene.postText === 'table') return displayAlternativesTable(); // ← Fix #1
    return;
  }

  scene.choices.forEach(ch => {
    const btn = document.createElement('button');
    btn.textContent = ch.text;
    btn.onclick = () => updateStory(ch.next);
    choicesContainer.appendChild(btn);
  });
}

/* end‑screen CTA */
function displayCTA() {
  if (!storyTextElement || !choicesContainer) return;
  storyTextElement.innerHTML = `
    <h2>Stay Informed & Take Action</h2>
    <p>Explore safer, cost‑saving electricity options, then sign up for updates:</p>
    <ul>
      <li><a href="https://www.eskom.co.za/solar-rebate" target="_blank">Apply for the Home‑Solar Rebate</a></li>
      <li><a href="https://www.energy.gov.za/free-meter" target="_blank">Find your nearest free‑meter rollout</a></li>
      <li><a href="mailto:safegrid@randburg.gov.za">Report unsafe wiring anonymously</a></li>
    </ul>
    <hr>
    <form id="feedback-form">
      <label for="fullname">Full Name:</label>
      <input type="text" id="fullname" required><br>

      <label for="email">E‑mail:</label>
      <input type="email" id="email" placeholder="name@gmail.com" required><br>

      <label for="location">Location:</label>
      <input type="text" id="location" required><br>

      <label for="rating">Which alternatives interest you?</label>
      <select id="rating" required>
        <option>Government Subsidies</option>
        <option>Solar Energy</option>
        <option>Pre‑paid Meter</option>
        <option>Community Initiatives</option>
      </select><br><br>

      <label for="thoughts">Any other comments?</label><br>
      <textarea id="thoughts" rows="4" cols="50"></textarea><br><br>

      <button type="submit">Sign up</button>
    </form>`;
  
  choicesContainer.innerHTML = '';
  const restart = document.createElement('button');
  restart.textContent = 'Play again';
  restart.onclick = restartGame;
  choicesContainer.appendChild(restart);

  document.getElementById('feedback-form').onsubmit = e => {
    e.preventDefault();
    console.log('Alt:', document.getElementById('rating').value,
                'Thoughts:', document.getElementById('thoughts').value);
    storyTextElement.innerHTML =
      'Thanks for signing up! Check your e‑mail for more information on the alternatives you selected.';
    choicesContainer.innerHTML = '';
    choicesContainer.appendChild(restart);
  };
}

/* new table‑display helper */
function displayAlternativesTable() {
  if (!storyTextElement || !choicesContainer) return;
  storyTextElement.innerHTML = `
    <h2>Legal Electricity Alternatives</h2>
    <table>
      <tr><th>Option</th><th>Cost</th><th>Benefits</th></tr>
      <tr><td>Government Subsidy</td><td>Low</td><td>Reduced monthly bill</td></tr>
      <tr><td>Solar Panels</td><td>High initial</td><td>Long‑term savings</td></tr>
      <tr><td>Pre‑paid Meter</td><td>None</td><td>Pay‑as‑you‑go, no surprise bills</td></tr>
    </table>`;
  choicesContainer.innerHTML = '';
  const restart = document.createElement('button');
  restart.textContent = 'Play again';
  restart.onclick = restartGame;
  choicesContainer.appendChild(restart);
}

function restartGame() {
  currentScene = 'introduction';
  sceneHistory = ['introduction'];
  updateStory('introduction');
}

/* =========  BOOTSTRAP  ========= */

function startGame() {
  const cookie = getCookie('username');

  if (!storyTextElement || !choicesContainer) return;

  if (cookie) {
    storyTextElement.textContent = `Welcome back, ${cookie}!`;
    choicesContainer.innerHTML = '';
    const btn = document.createElement('button');
    btn.textContent = 'Continue to Introduction';
    btn.onclick = () => updateStory('introduction');
    choicesContainer.appendChild(btn);
  } else {
    storyTextElement.textContent =
      'Welcome to the interactive story set in Randburg, Gauteng!';
    choicesContainer.innerHTML = `
      <form id="name-form">
        <label for="username">Please enter your name:</label>
        <input type="text" id="username" name="username" required><br><br>
        <button type="submit">Continue to the Story</button>
      </form>`;
    document.getElementById('name-form').onsubmit = e => {
      e.preventDefault();
      const u = document.getElementById('username').value.trim();
      if (!u) return alert('Please enter your name to continue.');
      setCookie('username', u, 30);
      startGame(); // reload with cookie now set
    };
  }
}

window.onload = startGame;
