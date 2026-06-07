/**
 * scenes/game/script.js — Canvas scene orchestrator.
 */
import { router }               from '/shared/router.js';
import { state }                from '/shared/state.js';
import { fitCanvas }            from '/shared/utils.js';
import { audioManager }         from '/shared/audioManager.js';
import { start as startLevel1 } from '/scenes/game/level1.js';
import { start as startLevel2 } from '/scenes/game/level2.js';
import { start as startLevel3 } from '/scenes/game/level3.js';

const LEVEL_STARTERS = { 1: startLevel1, 2: startLevel2, 3: startLevel3 };

// Inject game stylesheet once (router skips game/index.html for canvas scenes)
let styleInjected = false;
function injectStyle() {
  if (styleInjected) return;
  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = '/scenes/game/style.css';
  document.head.appendChild(link);
  styleInjected = true;
}

let ctx = null, canvas = null, activeLevel = null;
let hudEl = null, hudScore = null, hudLevel = null, hudLives = null;

function updateHUD() {
  if (!hudScore || !hudLevel || !hudLives) return;
  hudScore.textContent = `Score: ${state.score}`;
  hudLevel.textContent = `Level ${state.currentLevel}`;
  hudLives.textContent = '🌸'.repeat(Math.max(0, state.livesRemaining));
}

function onLevelEnd(reason) {
  if (activeLevel) { activeLevel.stop(); activeLevel = null; }
  if (reason === 'failed' || state.livesRemaining <= 0) {
    router.navigate('gameover'); return;
  }
  if (reason === 'complete') {
    const next = state.currentLevel + 1;
    if (LEVEL_STARTERS[next]) { state.currentLevel = next; loadLevel(next); }
    else router.navigate('gameover');
  }
}

function loadLevel(n) {
  const startFn = LEVEL_STARTERS[n];
  if (!startFn) { console.error(`[Game] No starter for level ${n}`); return; }
  updateHUD();
  activeLevel = startFn(ctx, canvas, {
    onScore:    pts => { state.score += pts;        state.correctCount++;   updateHUD(); },
    onLoseLife: ()  => { state.livesRemaining -= 1; state.incorrectCount++; updateHUD(); if (state.livesRemaining <= 0) onLevelEnd('failed'); },
    onLevelEnd,
  });
}

export function init(canvasEl) {
  injectStyle();
  canvas = canvasEl;
  ctx    = canvas.getContext('2d');
  fitCanvas(canvas);

  // Remove stale HUD, build fresh one
  document.getElementById('game-hud')?.remove();
  hudEl = document.createElement('div');
  hudEl.id = 'game-hud';
  hudEl.innerHTML = `
    <span id="hud-score">Score: 0</span>
    <span id="hud-level">Level 1</span>
    <span id="hud-lives">🌸🌸🌸</span>
  `;
  document.body.appendChild(hudEl);
  hudScore = hudEl.querySelector('#hud-score');
  hudLevel = hudEl.querySelector('#hud-level');
  hudLives = hudEl.querySelector('#hud-lives');

  audioManager.play('/assets/audio/bg-music.mp3');

  const onResize = () => fitCanvas(canvas);
  window.addEventListener('resize', onResize);
  loadLevel(state.currentLevel);

  return function cleanup() {
    window.removeEventListener('resize', onResize);
    if (activeLevel) { activeLevel.stop(); activeLevel = null; }
    hudEl?.remove();
    hudEl = hudScore = hudLevel = hudLives = null;
  };
}