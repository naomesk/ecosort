# 🌿 Eco Sort

A browser-based trash classification game where players sort waste items into the correct bins across three levels of difficulty.

---

## Running the Game

The game is plain HTML/JS/CSS with no build step. You just need a local HTTP server pointed at the `src/` folder.

### Start the server

Open a terminal, `cd` into the project root, then run **one** of:

**Python (recommended — no install needed):**
```bash
python -m http.server 8000 --directory src
```

**Node (if you have it):**
```bash
npx http-server src -p 8000 --cors
```

Then open **http://localhost:8000** in your browser.

> ⚠️ Do **not** open `index.html` directly as a file (`file://...`). ES modules require an HTTP server.

### Stop the server

In the terminal where the server is running, press **Ctrl + C**.

### Restart for a demo

```bash
# Stop:  Ctrl + C

# Start again:
python -m http.server 8000 --directory src
```

### Hard-refresh after code changes

If you edit CSS or JS and the browser shows stale content, press:
- **Windows/Linux:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`

---

## Project Structure

```
ecosort/
├── src/                        ← web root (serve this folder)
│   ├── index.html              ← single HTML shell, loads main.js
│   ├── main.js                 ← entry point — navigates to 'start' scene
│   │
│   ├── styles/
│   │   └── global.css          ← base styles shared across all scenes
│   │
│   ├── shared/                 ← modules imported by multiple scenes
│   │   ├── router.js           ← scene manager (navigate between screens)
│   │   ├── state.js            ← single source of truth (score, lives, etc.)
│   │   ├── trashData.js        ← all trash items + category definitions
│   │   ├── audioManager.js     ← background music singleton
│   │   └── utils.js            ← pure helpers (shuffle, clamp, fitCanvas…)
│   │
│   ├── scenes/
│   │   ├── start/              ← title screen (name input, difficulty, HTP)
│   │   │   ├── index.html
│   │   │   ├── style.css
│   │   │   └── script.js
│   │   │
│   │   ├── game/               ← canvas game scene
│   │   │   ├── index.html      ← unused by router; kept as reference
│   │   │   ├── style.css       ← HUD overlay styles
│   │   │   ├── script.js       ← orchestrator: HUD, level loading, lives check
│   │   │   ├── level1.js       ← 9 items · 10 pts correct · no penalty
│   │   │   ├── level2.js       ← 12 items · 15 pts correct · −5 pts wrong
│   │   │   └── level3.js       ← 15 items · 20 pts correct · −10 pts wrong
│   │   │
│   │   ├── gameover/           ← end-of-game stats screen
│   │   │   ├── index.html
│   │   │   ├── style.css
│   │   │   └── script.js
│   │   │
│   │   └── leaderboard/        ← top-10 scores (in-memory, resets on refresh)
│   │       ├── index.html
│   │       ├── style.css
│   │       └── script.js
│   │
│   └── assets/
│       ├── images/
│       │   ├── trash/          ← item sprites (e.g. plastic-bottle.png, soda-can.png)
│       │   └── bins/           ← bin sprites: <key>-bin-open/closed.png
│       │                         (paper, plastic, metal, general, organic)
│       │                         recyclable + hazardous use coloured rects (no image)
│       └── audio/              ← bg-music.mp3 (optional)
|
|___ README.md
```

---

## How the Router Works

All navigation goes through `shared/router.js`. There are two scene types:

| Type | What the router does |
|------|----------------------|
| `dom` | Fetches `index.html`, injects into `#scene-container`, imports `script.js` |
| `canvas` | Shows `#game-canvas`, calls `script.js`'s `init(canvas)` |

Every scene **must** export a `cleanup()` function (DOM scenes) or return one from `init()` (canvas scene). The router calls it before leaving the scene to stop animations and remove event listeners.

---

## Game State

All cross-scene data lives in `shared/state.js`. Import and mutate directly:

```js
import { state, resetState } from '/shared/state.js';

state.score += 10;          // update score
resetState();               // call at the start of a new game
```

| Field | Type | Description |
|-------|------|-------------|
| `playerName` | string | Set on the start screen |
| `score` | number | Running total |
| `currentLevel` | 1 \| 2 \| 3 | Active level |
| `livesRemaining` | number | Starts at 3, decrements on wrong sort |
| `correctCount` | number | Total correct classifications |
| `incorrectCount` | number | Total incorrect classifications |
| `leaderboard` | array | `{ name, score, date }` — top 10, sorted desc |

---

## Adding New Trash Items

Edit `src/shared/trashData.js`:

```js
// 1. Add the item entry:
{ id: 'yogurt-cup', label: 'Yogurt Cup', category: 'plastic', level: 2,
  hint: 'Rinse it out — #5 plastic is usually recyclable.' },

// 2. Add the image:
//    src/assets/images/trash/yogurt-cup.png   (130 × 130 px recommended)
```

The `id` must match the image filename in `src/assets/images/trash/` exactly (no extension in the data).

> ⚠️ Make sure the `category` is one that actually appears in the level's bin set (`LEVEL_BIN_KEYS`) — otherwise the item can never be sorted correctly.

---

## Bin System

### Per-level bin sets

| Level | Bins (left → right) | Notes |
|-------|---------------------|-------|
| 1 | recyclable · general · organic | Intro — broad categories |
| 2 | paper · plastic · general · organic | Split recyclables |
| 3 | paper · plastic · metal · general · organic · hazardous | All categories |

### Bin rendering

Bins with images (`hasImage: true` in `CATEGORIES`) load from:
```
src/assets/images/bins/<key>-bin-closed.png
src/assets/images/bins/<key>-bin-open.png
```

Bins **without** images (`hasImage: false`) are drawn as **glowing coloured rectangles**:
- **Recyclable** — green (`#43a047`)
- **Hazardous** — bright yellow (`#ffee58`)

They glow brightly when held (press-and-hold interaction), so they are just as clickable as the image bins.

### Adding a new bin image

Drop two files into `src/assets/images/bins/`:
```
<key>-bin-closed.png
<key>-bin-open.png
```
Then set `hasImage: true` for that key in `CATEGORIES`. No other changes needed.

---

## Levels at a Glance

| Level | Bins | Items to clear | Correct | Wrong | Notes |
|-------|------|---------------|---------|-------|-------|
| 1 | 3 | 9 | +10 pts | 0 | Intro — no score penalty |
| 2 | 4 | 12 | +15 pts | −5 pts | Medium — watch the penalty |
| 3 | 6 | 15 | +20 pts | −10 pts | Hard — fast and unforgiving |

The game ends when all three levels are cleared **or** when the player runs out of lives (3 wrong answers total).

---

## Team Notes

- **Do not put scene-local state in `state.js`** — only data that needs to cross scene boundaries belongs there.
- **Always call `resetState()`** at the start of a new game session (the start screen does this for you).
- **CSS in scene fragments** is injected into `<head>` by the script, not via a `<link>` in the HTML fragment, to avoid browser caching issues.
- The leaderboard is **in-memory only** — scores reset when the browser tab is closed. Persistent storage (localStorage / backend) can be added later.
