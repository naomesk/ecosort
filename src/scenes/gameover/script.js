import { router }                          from '/shared/router.js';
import { state, resetState, saveToLeaderboard } from '/shared/state.js';
import { audioManager }                    from '/shared/audioManager.js';

// Inject stylesheet into <head> to bypass innerHTML caching issues
(function injectStyle() {
  document.querySelectorAll('link[data-scene="gameover"]').forEach(el => el.remove());
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/scenes/gameover/style.css?v=' + Date.now();
  link.dataset.scene = 'gameover';
  document.head.appendChild(link);
}());

const TIPS = [
  'Even if an item is plastic, if it is stained with food, it belongs in General Waste.',
  'Rinse bottles and cans before recycling — food residue can contaminate a whole batch.',
  'Aerosol cans are hazardous waste. Never puncture or throw them in the general bin.',
  'Paper that is wet or greasy cannot be recycled. When in doubt, general waste it is.',
  'Banana peels and vegetable scraps are perfect for composting — they become fertiliser!',
  'Wooden chopsticks are not recyclable. They belong in the general waste bin.',
  'Milk cartons are recyclable once rinsed and flattened.',
  'Ceramics like mugs cannot be melted down with glass — they go in general waste.',
];

// ── Populate stats ─────────────────────────────────────────────────────────────
const total    = state.correctCount + state.incorrectCount;
const accuracy = total > 0 ? Math.round((state.correctCount / total) * 100) : 0;
const lives    = Math.max(0, state.livesRemaining);

document.getElementById('go-score').textContent    = state.score.toLocaleString();
document.getElementById('go-level').textContent    = `Level ${state.currentLevel}`;
document.getElementById('go-accuracy').textContent = `${accuracy}%`;
document.getElementById('go-correct').textContent  = state.correctCount;
document.getElementById('go-incorrect').textContent = state.incorrectCount;

// ── Heading based on outcome ───────────────────────────────────────────────────
const heading = document.getElementById('go-heading');
if (lives === 0) {
  heading.textContent = "Winter's Return";
} else if (state.currentLevel >= 3) {
  heading.textContent = 'Garden in Full Bloom!';
} else {
  heading.textContent = 'Round Complete!';
}

// ── Blossoms (lives remaining) ─────────────────────────────────────────────────
const BLOSSOM_FULL  = '🌸';
const BLOSSOM_EMPTY = '❀';
document.getElementById('go-blossoms').textContent =
  BLOSSOM_FULL.repeat(lives) + BLOSSOM_EMPTY.repeat(3 - lives);
document.getElementById('go-blossoms-label').textContent =
  lives === 1 ? '1 Blossom Preserved' : `${lives} Blossoms Preserved`;

// ── Random tip ─────────────────────────────────────────────────────────────────
document.getElementById('go-tip').textContent =
  TIPS[Math.floor(Math.random() * TIPS.length)];

// ── Save to leaderboard ────────────────────────────────────────────────────────
saveToLeaderboard();
audioManager.stop();

// ── Buttons ────────────────────────────────────────────────────────────────────
const btnRetry       = document.getElementById('btn-retry');
const btnLeaderboard = document.getElementById('btn-leaderboard');
const btnHome        = document.getElementById('btn-home');

function onRetry() {
  resetState();
  router.navigate('game');
}
function onLeaderboard() { router.navigate('leaderboard'); }
function onHome()        { router.navigate('start'); }

btnRetry.addEventListener('click', onRetry);
btnLeaderboard.addEventListener('click', onLeaderboard);
btnHome.addEventListener('click', onHome);

export function cleanup() {
  btnRetry.removeEventListener('click', onRetry);
  btnLeaderboard.removeEventListener('click', onLeaderboard);
  btnHome.removeEventListener('click', onHome);
}
