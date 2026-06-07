/**
 * shared/router.js — Central scene manager.
 * All paths are absolute from the server root (/src as root).
 */

const SCENE_MAP = {
  start:       { type: 'dom',    path: '/scenes/start/' },
  game:        { type: 'canvas', path: '/scenes/game/' },
  leaderboard: { type: 'dom',    path: '/scenes/leaderboard/' },
  gameover:    { type: 'dom',    path: '/scenes/gameover/' },
};

const sceneContainer = document.getElementById('scene-container');
const gameCanvas      = document.getElementById('game-canvas');

let activeSceneCleanup = null;

async function navigate(sceneName) {
  const scene = SCENE_MAP[sceneName];
  if (!scene) { console.error(`[Router] Unknown scene: "${sceneName}"`); return; }

  if (typeof activeSceneCleanup === 'function') {
    activeSceneCleanup();
    activeSceneCleanup = null;
  }

  if (scene.type === 'dom') {
    gameCanvas.style.display     = 'none';
    sceneContainer.style.display = '';

    const html = await fetch(`${scene.path}index.html`).then(r => r.text());
    sceneContainer.innerHTML = html;

    const module = await import(`${scene.path}script.js?t=${Date.now()}`);
    if (typeof module.cleanup === 'function') activeSceneCleanup = module.cleanup;

  } else if (scene.type === 'canvas') {
    sceneContainer.innerHTML     = '';
    sceneContainer.style.display = 'none';
    gameCanvas.style.display     = '';

    const module = await import(`${scene.path}script.js?t=${Date.now()}`);
    if (typeof module.init === 'function') {
      activeSceneCleanup = module.init(gameCanvas) ?? null;
    }
  }
}

export const router = { navigate };