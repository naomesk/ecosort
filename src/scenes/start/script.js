/**
 * scenes/start/script.js
 * No inline onclick handlers — all listeners attached here after the DOM is ready.
 */

import { router }            from '/shared/router.js';
import { state, resetState } from '/shared/state.js';
import { audioManager }      from '/shared/audioManager.js';

// ── i18n ──────────────────────────────────────────────────────────────────────
const strings = {
  en: {
    'lang-label':  'EN ↔ 한글',
    't-title':     'Eco Sort',
    't-sub':       'Learn to Sort, Grow to Bloom',
    't-start':     'Start Game',
    't-lb':        'Leaderboard',
    't-htp':       'How to Play',
    't-lb-title':  'Leaderboard',
    't-htp-title': 'How to Play',
    't-h1':        'Sort the waste',
    't-h1d':       'Click each item into the correct bin — recyclables, food waste, general, or hazardous.',
    't-h2':        'Click to sort',
    't-h2d':       'An item appears at the top. Click the correct bin at the bottom to classify it.',
    't-h3':        'Blossom lifeline',
    't-h3d':       'Each wrong answer wilts a petal. Three lost and the round ends!',
    't-h4':        'Earn points',
    't-h4d':       'Correct sorts add to your score. Climb the leaderboard!',
    't-htp-start': "Let's Play! 🌿",
    'd-easy':      'Easy',
    'd-medium':    'Medium',
    'd-hard':      'Hard',
    'lb-empty-h':  'No scores yet!',
    'lb-empty-p':  'Play your first round and your score will appear here.',
    'lb-play-now': 'Play now',
  },
  ko: {
    'lang-label':  '한글 ↔ EN',
    't-title':     'Eco Sort',
    't-sub':       '분류하고 꽃을 피워요',
    't-start':     '게임 시작',
    't-lb':        '리더보드',
    't-htp':       '게임 방법',
    't-lb-title':  '리더보드',
    't-htp-title': '게임 방법',
    't-h1':        '쓰레기 분류',
    't-h1d':       '각 아이템을 올바른 통에 넣으세요.',
    't-h2':        '클릭으로 분류',
    't-h2d':       '위쪽에 아이템이 나타납니다. 아래쪽 올바른 통을 클릭하세요.',
    't-h3':        '꽃잎 생명선',
    't-h3d':       '실수할 때마다 꽃잎이 시들어요. 꽃잎 세 개를 잃으면 라운드가 끝납니다!',
    't-h4':        '점수 획득',
    't-h4d':       '올바른 분류로 점수를 쌓으세요.',
    't-htp-start': '시작해볼까요! 🌿',
    'd-easy':      '쉬움',
    'd-medium':    '보통',
    'd-hard':      '어려움',
    'lb-empty-h':  '아직 점수가 없어요!',
    'lb-empty-p':  '첫 번째 게임을 플레이하면 여기에 점수가 표시됩니다.',
    'lb-play-now': '지금 플레이',
  },
};

// ── Language ──────────────────────────────────────────────────────────────────
let lang = localStorage.getItem('ecosort-lang') || 'en';

function applyLang() {
  const s = strings[lang];
  Object.keys(s).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = s[id];
  });
  document.documentElement.lang = lang === 'ko' ? 'ko' : 'en';
}

document.getElementById('lang-toggle').addEventListener('click', () => {
  lang = lang === 'en' ? 'ko' : 'en';
  localStorage.setItem('ecosort-lang', lang);
  applyLang();
  playTap();
});

// ── Difficulty ────────────────────────────────────────────────────────────────
let difficulty = localStorage.getItem('ecosort-diff') || 'easy';

function initDifficulty() {
  document.querySelectorAll('.diff-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.diff === difficulty);
  });
}

document.querySelectorAll('.diff-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.diff-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    difficulty = pill.dataset.diff;
    localStorage.setItem('ecosort-diff', difficulty);
    playTap();
  });
});

// ── Tap sound ─────────────────────────────────────────────────────────────────
let audioCtx = null;
function initAudio() {
  if (audioCtx) return;
  try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
  catch (e) { audioCtx = null; }
}
function playTap() {
  initAudio(); if (!audioCtx) return;
  try {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(520, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.08);
    g.gain.setValueAtTime(0.18, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
    o.start(); o.stop(audioCtx.currentTime + 0.13);
  } catch (e) {}
}

// ── Ripple ────────────────────────────────────────────────────────────────────
function addRipple(btn, e) {
  const r = btn.getBoundingClientRect();
  const size = Math.max(r.width, r.height);
  const span = document.createElement('span');
  span.className = 'ripple-circle';
  span.style.cssText = `width:${size}px;height:${size}px;left:${(e.clientX-r.left)-size/2}px;top:${(e.clientY-r.top)-size/2}px`;
  btn.appendChild(span);
  setTimeout(() => span.remove(), 600);
}
document.querySelectorAll('.btn, .diff-pill').forEach(btn => {
  btn.addEventListener('click', e => { addRipple(btn, e); });
});

// ── Overlays ──────────────────────────────────────────────────────────────────
function openOverlay(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeOverlay(id) {
  document.getElementById(id)?.classList.remove('open');
  document.body.style.overflow = '';
}

// Open buttons
document.getElementById('t-lb').addEventListener('click',  () => { renderLeaderboard(); openOverlay('overlay-lb'); });
document.getElementById('t-htp').addEventListener('click', () => openOverlay('overlay-htp'));

// Close buttons
document.getElementById('close-lb').addEventListener('click',  () => closeOverlay('overlay-lb'));
document.getElementById('close-htp').addEventListener('click', () => closeOverlay('overlay-htp'));

// Click backdrop to close
document.getElementById('overlay-lb').addEventListener('click',  e => { if (e.target === e.currentTarget) closeOverlay('overlay-lb'); });
document.getElementById('overlay-htp').addEventListener('click', e => { if (e.target === e.currentTarget) closeOverlay('overlay-htp'); });

// Escape key
function onKeydown(e) {
  if (e.key !== 'Escape') return;
  closeOverlay('overlay-lb');
  closeOverlay('overlay-htp');
}
document.addEventListener('keydown', onKeydown);

// ── Leaderboard render ────────────────────────────────────────────────────────
function renderLeaderboard() {
  const s       = strings[lang];
  const scores  = state.leaderboard;
  const container = document.getElementById('lb-content');
  if (scores.length === 0) {
    container.innerHTML = `
      <div class="lb-empty">
        <span class="lb-emoji">🌱</span>
        <p><strong>${s['lb-empty-h']}</strong><br>${s['lb-empty-p']}</p>
      </div>`;
    return;
  }
  const ranks = ['gold','silver','bronze'];
  container.innerHTML = `<ul class="lb-list">
    ${scores.slice(0,10).map((entry, i) => `
      <li class="lb-row">
        <div class="lb-rank ${ranks[i]||''}">${i+1}</div>
        <span class="lb-name">${entry.name || 'Player'}</span>
        <span class="lb-score">${entry.score.toLocaleString()}</span>
      </li>`).join('')}
  </ul>`;
}

// ── Play navigation ───────────────────────────────────────────────────────────
function onPlay() {
  const nameInput = document.getElementById('player-name');
  const name = nameInput.value.trim();
  if (!name) { nameInput.focus(); nameInput.style.borderColor = '#e53935'; return; }
  nameInput.style.borderColor = '';
  resetState();
  state.playerName   = name;
  state.currentLevel = 1;
  state.difficulty   = difficulty;
  audioManager.stop();
  router.navigate('game');
}

document.getElementById('t-start').addEventListener('click', e => {
  addRipple(document.getElementById('t-start'), e);
  playTap();
  onPlay();
});

document.getElementById('t-htp-start').addEventListener('click', () => {
  closeOverlay('overlay-htp');
  setTimeout(onPlay, 350);
});

document.getElementById('player-name').addEventListener('keydown', e => {
  if (e.key === 'Enter') onPlay();
});

// ── Restore saved name ────────────────────────────────────────────────────────
const nameInput = document.getElementById('player-name');
if (state.playerName) nameInput.value = state.playerName;

// ── Petal canvas ──────────────────────────────────────────────────────────────
const petalCanvas = document.getElementById('petal-canvas');
const pCtx        = petalCanvas.getContext('2d');
let   petalRafId  = null;

function resizePetalCanvas() {
  petalCanvas.width  = window.innerWidth;
  petalCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizePetalCanvas);
resizePetalCanvas();

const PETAL_COLORS = ['#F8BBD0','#FCE4EC','#F48FB1','#FFB7C5','#FADADD'];
function makePetal() {
  return {
    x: Math.random() * petalCanvas.width,
    y: -20 - Math.random() * 80,
    size:  6 + Math.random() * 8,
    speed: 0.5 + Math.random() * 0.9,
    drift: (Math.random() - 0.5) * 0.6,
    rot:   Math.random() * Math.PI * 2,
    rotV:  (Math.random() - 0.5) * 0.03,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    sway:  Math.random() * Math.PI * 2,
    swayS: 0.008 + Math.random() * 0.012,
  };
}
const petals = Array.from({ length: 22 }, () => {
  const p = makePetal(); p.y = Math.random() * petalCanvas.height; return p;
});

function animatePetals() {
  pCtx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
  petals.forEach(p => {
    p.sway += p.swayS; p.x += p.drift + Math.sin(p.sway) * 0.5;
    p.y += p.speed; p.rot += p.rotV;
    if (p.y > petalCanvas.height + 20) Object.assign(p, makePetal(), { y: -20 });
    pCtx.save();
    pCtx.translate(p.x, p.y); pCtx.rotate(p.rot);
    pCtx.fillStyle = p.color; pCtx.globalAlpha = 0.75;
    pCtx.beginPath(); pCtx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
    pCtx.fill(); pCtx.restore();
  });
  petalRafId = requestAnimationFrame(animatePetals);
}
petalRafId = requestAnimationFrame(animatePetals);

// ── Boot ──────────────────────────────────────────────────────────────────────
applyLang();
initDifficulty();

// ── Cleanup ───────────────────────────────────────────────────────────────────
export function cleanup() {
  if (petalRafId !== null) cancelAnimationFrame(petalRafId);
  window.removeEventListener('resize', resizePetalCanvas);
  document.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
}