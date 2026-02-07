const questions = [
  {id:0, q: 'what restaurant was our first date at?', a: 'enotica sociale'},
  {id:1, q: 'Where was our first meal from?', a: 'boustan'},
  {id:2, q: "What's my favorite dessert?", a: 'you'}
];

// Messages shown when a photo is revealed
const revealMessages = {
  0: 'thank you for swiping right',
  1: 'thank you for being kind',
  2: 'thank you for keeping up'
};

const cards = Array.from(document.querySelectorAll('.card'));
const modal = document.getElementById('questionModal');
const qtext = document.getElementById('qtext');
const answerInput = document.getElementById('answerInput');
const submitAnswer = document.getElementById('submitAnswer');
const cancelAnswer = document.getElementById('cancelAnswer');
const feedback = document.getElementById('feedback');
const finalModal = document.getElementById('finalModal');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

let activeIndex = null;
let unlocked = new Set();
const attempts = {};

function openQuestion(i){
  activeIndex = i;
  qtext.textContent = questions[i].q;
  answerInput.value = '';
  feedback.textContent = '';
  modal.classList.remove('hidden');
  answerInput.focus();
}

function closeQuestion(){ modal.classList.add('hidden'); activeIndex = null; }

cards.forEach((c, i) => {
  c.querySelector('.ask').addEventListener('click', ()=> openQuestion(i));
});

submitAnswer.addEventListener('click', ()=>{
  if (activeIndex === null) return;
  const ans = (answerInput.value||'').trim().toLowerCase();
  const correct = questions[activeIndex].a.toLowerCase();
  attempts[activeIndex] = (attempts[activeIndex] || 0) + 1;
  const triesLeft = 2 - attempts[activeIndex];
  if(ans === correct){
    feedback.textContent = 'Correct!';
    const card = cards[activeIndex];
    card.classList.remove('locked');
    card.classList.add('unlocked');
    unlocked.add(activeIndex);
    showRevealOnCard(activeIndex, revealMessages[activeIndex]);
    setTimeout(()=> closeQuestion(), 600);
    if(unlocked.size === cards.length) setTimeout(()=> startRepeatingTimer(1, 10), 700);
  } else {
    if (attempts[activeIndex] < 2) {
      feedback.textContent = `Not quite — try again! (${triesLeft} left)`;
      answerInput.classList.add('shake');
      setTimeout(()=> answerInput.classList.remove('shake'), 500);
    } else {
      feedback.textContent = 'Revealing answer after 2 attempts.';
      const card = cards[activeIndex];
      card.classList.remove('locked');
      card.classList.add('unlocked');
      unlocked.add(activeIndex);
      showRevealOnCard(activeIndex, revealMessages[activeIndex]);
      setTimeout(()=> closeQuestion(), 600);
      if(unlocked.size === cards.length) setTimeout(()=> startRepeatingTimer(1, 10), 700);
    }
  }
});

cancelAnswer.addEventListener('click', closeQuestion);

function showFinal(){ finalModal.classList.remove('hidden'); }

noBtn.addEventListener('click', ()=>{
  noBtn.textContent = 'Oops';
  setTimeout(()=> finalModal.classList.add('hidden'),800);
});

yesBtn.addEventListener('click', ()=>{
  finalModal.classList.add('hidden');
  burstConfetti();
  showProposalAnimation();
});

function burstConfetti(){
  const stage = document.createElement('div');
  stage.className = 'confetti';
  document.body.appendChild(stage);
  for(let i=0;i<120;i++){
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.background = `hsl(${Math.random()*360} 90% 60%)`;
    el.style.left = Math.random()*100 + '%';
    el.style.top = (Math.random()*-20) + 'vh';
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    el.style.animationDelay = (Math.random()*400) + 'ms';
    el.style.width = (6+Math.random()*10)+'px';
    el.style.height = (8+Math.random()*12)+'px';
    stage.appendChild(el);
  }
  setTimeout(()=> stage.remove(), 3000);
}

function showProposalAnimation(){
  const big = document.createElement('div');
  big.style.position = 'fixed';
  big.style.inset = '0';
  big.style.display = 'flex';
  big.style.alignItems = 'center';
  big.style.justifyContent = 'center';
  big.style.background = 'rgba(0,0,0,0.35)';
  big.style.zIndex = '99999';
  big.innerHTML = `<div style="background:#fff;padding:30px;border-radius:18px;text-align:center;max-width:480px">
    <h1 style="margin:0 0 8px;color:#ff3b7a">Will you marry me?</h1>
    <p style="margin:0 0 12px">I'll make you the happiest person.</p>
    <button id="closeProposal" style="padding:10px 16px;border-radius:10px;border:0;background:var(--accent);color:#fff">Forever</button>
  </div>`;
  document.body.appendChild(big);
  document.getElementById('closeProposal').addEventListener('click', ()=>{
    big.remove();
  });
}

function showRevealOnCard(index, msg){
  if(typeof index !== 'number' || !msg) return;
  const card = cards[index];
  if(!card) return;
  if(card.querySelector('.photo-msg')) return; // already shown
  const el = document.createElement('div');
  el.className = 'photo-msg';
  const inner = document.createElement('div');
  inner.className = 'photo-msg-inner';
  inner.textContent = msg;
  el.appendChild(inner);
  card.appendChild(el);
}

/* Start a repeating countdown overlay: runs `seconds` seconds, repeats `repeats` times, then calls showFinal() */
function startRepeatingTimer(repeats, seconds){
  if (!repeats || !seconds) { showFinal(); return; }
  // avoid multiple overlays
  if (document.getElementById('repeatTimer')) return;
  const el = document.createElement('div');
  el.id = 'repeatTimer';
  el.className = 'repeat-timer';
  el.innerHTML = `
    <div class="repeat-inner">
      <div class="repeat-count">Round <span class="rnum">1</span> / ${repeats}</div>
      <div class="clock">
        <div class="repeat-seconds"><span class="secs">${seconds}</span></div>
      </div>
    </div>`;
  document.body.appendChild(el);

  let current = 1;
  function runRound(){
    const secsEl = el.querySelector('.secs');
    const rnumEl = el.querySelector('.rnum');
    let remaining = seconds;
    rnumEl.textContent = String(current);
    secsEl.textContent = String(remaining);
    el.classList.add('visible');
    const iv = setInterval(()=>{
      remaining -= 1;
      if (remaining >= 0) secsEl.textContent = String(remaining);
      if (remaining <= 0){
        clearInterval(iv);
        current += 1;
        if (current <= repeats){
          // small pause before next round
          setTimeout(runRound, 600);
        } else {
          // finished all repeats -> ask surprise question
          el.classList.remove('visible');
          setTimeout(()=> el.remove(), 400);
          setTimeout(()=> openSurpriseModal(), 600);
        }
      }
    }, 1000);
  }
  runRound();
}

function openSurpriseModal(){
  const m = document.getElementById('surpriseModal');
  if(!m) { showFinal(); return; }
  m.classList.remove('hidden');
}

// handle surprise yes button
document.addEventListener('click', (e)=>{
  if(e.target && e.target.id === 'surpriseYes'){
    const m = document.getElementById('surpriseModal');
    if(m) m.classList.add('hidden');
    runSurpriseSequence();
  }
});

function runSurpriseSequence(){
  // show photo5 full-screen with centered 'tatoo' text for 10 seconds
  const full = document.createElement('div');
  full.className = 'photo5-full';
  full.style.backgroundImage = `url('assets/photos/photo5.jpg')`;
  const label = document.createElement('div');
  label.className = 'photo5-full-label';
  label.textContent = 'tatoo';
  full.appendChild(label);
  document.body.appendChild(full);

  setTimeout(()=>{
    // animate zoom-out then remove
    full.classList.add('photo5-exit');
    full.addEventListener('animationend', ()=>{
      full.remove();
      // after removing full-screen photo show final compliment
      showFinalCompliment();
    }, { once: true });
  }, 10000);
}

function showFinalCompliment(){
  const box = document.createElement('div');
  box.className = 'final-compliment';
  box.innerHTML = `<div class="compliment-inner">you are cute you are funny you are kind you are hawt but most of all you are my home</div>`;
  document.body.appendChild(box);
  setTimeout(()=>{
    // keep it visible for a short while then remove
    setTimeout(()=> box.classList.add('fade-out'), 5000);
  }, 50);
}

/* Rotate multilingual romantic messages in the hero banner */
const _heroMessages = [
  'Every moment with you feels like home.',
  'तुम्हारे साथ हर लम्हा मेरे लिए खास है।',
  'నీతో ఉన్న ప్రతి క్షణం నా జీవితానికి రంగం.'
];
const _heroEl = document.getElementById('heroMessage');
let _heroIndex = 0;
function _rotateHero(){
  if(!_heroEl) return;
  _heroEl.style.opacity = '0';
  setTimeout(()=>{
    _heroEl.textContent = _heroMessages[_heroIndex];
    _heroEl.style.opacity = '1';
    _heroIndex = (_heroIndex + 1) % _heroMessages.length;
  }, 300);
}
_rotateHero();
setInterval(_rotateHero, 3500);

/* Fill background with poodle emoticons */
function createPoodleField(){
  // remove existing
  let field = document.getElementById('poodleField');
  if(field) field.remove();
  field = document.createElement('div');
  field.id = 'poodleField';
  field.className = 'poodle-field';
  document.body.appendChild(field);

  const spacing = 80; // px between emojis
  const cols = Math.ceil(window.innerWidth / spacing) + 1;
  const rows = Math.ceil(window.innerHeight / spacing) + 1;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const el = document.createElement('span');
      el.className = 'poodle';
      el.textContent = '🐩';
      const jitterX = (Math.random()-0.5) * 24;
      const jitterY = (Math.random()-0.5) * 24;
      const left = Math.round(c * spacing + jitterX);
      const top = Math.round(r * spacing + jitterY);
      el.style.left = left + 'px';
      el.style.top = top + 'px';
      el.style.opacity = (0.12 + Math.random()*0.3).toFixed(2);
      el.style.transform = `rotate(${(Math.random()*40-20).toFixed(1)}deg) scale(${(0.8+Math.random()*0.6).toFixed(2)})`;
      field.appendChild(el);
    }
  }
}

window.addEventListener('load', createPoodleField);
window.addEventListener('resize', ()=>{
  // throttle a bit
  clearTimeout(window.__poodleResize);
  window.__poodleResize = setTimeout(createPoodleField, 220);
});
