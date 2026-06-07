import { router } from '/shared/router.js';
import { state }  from '/shared/state.js';

// Inject stylesheet into <head> to bypass innerHTML caching issues
(function injectStyle() {
  document.querySelectorAll('link[data-scene="leaderboard"]').forEach(el => el.remove());
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/scenes/leaderboard/style.css?v=' + Date.now();
  link.dataset.scene = 'leaderboard';
  document.head.appendChild(link);
}());

const AVATARS = ['🌸','🌼','🌻','🍀','🌿','🦋','🐝','🌱','🍃','🌾'];
const PODIUM_TITLES = ['Garden Guard', 'Bloom Seeker', 'Root Reclaimer'];
const RANKS = ['gold', 'silver', 'bronze'];

// ── Render ────────────────────────────────────────────────────────────────────
const scores   = state.leaderboard;
const podiumEl = document.getElementById('lb-podium');
const listEl   = document.getElementById('lb-list');
const emptyEl  = document.getElementById('lb-empty');

if (scores.length === 0) {
  emptyEl.style.display = 'flex';
} else {
  // Podium — top 3 in visual order: 2nd, 1st, 3rd
  const top3  = scores.slice(0, 3);
  const order = top3.length >= 3 ? [top3[1], top3[0], top3[2]]
              : top3.length === 2 ? [top3[1], top3[0]]
              : [top3[0]];

  order.forEach(entry => {
    const i    = scores.indexOf(entry);
    const rank = RANKS[i] || '';
    const div  = document.createElement('div');
    div.className = 'podium-item';
    div.innerHTML = `
      <div class="podium-rank-num ${rank}">${i + 1}</div>
      <div class="podium-badge ${rank}">${AVATARS[i] || '🌱'}</div>
      <div class="podium-title">${PODIUM_TITLES[i] || ''}</div>
      <div class="podium-name">${entry.name}</div>
      <div class="podium-score">${entry.score.toLocaleString()}</div>
    `;
    podiumEl.appendChild(div);
  });

  // Full ranked list
  scores.forEach((entry, i) => {
    const li = document.createElement('li');
    li.className = 'lb-entry';
    li.innerHTML = `
      <div class="lb-entry-rank ${RANKS[i] || ''}">${i + 1}</div>
      <div class="lb-entry-avatar">${AVATARS[i % AVATARS.length]}</div>
      <span class="lb-entry-name">${entry.name}</span>
      <span class="lb-entry-score">${entry.score.toLocaleString()}</span>
    `;
    listEl.appendChild(li);
  });
}

// ── Navigation ────────────────────────────────────────────────────────────────
const btnHome = document.getElementById('btn-home');
function onHome() { router.navigate('start'); }
btnHome.addEventListener('click', onHome);

export function cleanup() {
  btnHome.removeEventListener('click', onHome);
}
