const questions = [
  {id:0, q: 'What color do I always wear on our movie nights?', a: 'blue'},
  {id:1, q: 'What city did we first visit together?', a: 'paris'},
  {id:2, q: "What's my favorite dessert?", a: 'chocolate'}
];

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
  const ans = (answerInput.value||'').trim().toLowerCase();
  const correct = questions[activeIndex].a.toLowerCase();
  if(ans === correct){
    feedback.textContent = 'Correct!';
    const card = cards[activeIndex];
    card.classList.remove('locked');
    card.classList.add('unlocked');
    unlocked.add(activeIndex);
    setTimeout(()=> closeQuestion(), 600);
    if(unlocked.size === cards.length) setTimeout(()=> showFinal(), 700);
  } else {
    feedback.textContent = 'Not quite — try again!';
    answerInput.classList.add('shake');
    setTimeout(()=> answerInput.classList.remove('shake'), 500);
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
