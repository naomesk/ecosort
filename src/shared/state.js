/**
 * shared/state.js
 * Single source of truth for game state shared across all scenes.
 *
 * USAGE
 * -----
 *   import { state, resetState } from '../../shared/state.js';
 *
 *   state.score += 10;          // mutate directly
 *   resetState();               // call between game sessions
 *
 * RULES FOR TEAMMATES
 * -------------------
 * - Never store scene-local UI state here (button hover, animation flags, etc.).
 * - Always call resetState() when starting a fresh game session.
 * - Add new fields below with a default value AND update resetState() to match.
 */

/** The live state object. Import and mutate directly. */
export const state = {
  // Player identity
  playerName: '',

  // Scoring
  score: 0,
  highScore: 0,

  // Progression
  currentLevel: 1,       // 1 | 2 | 3
  livesRemaining: 3,

  // Session metadata
  correctCount: 0,
  incorrectCount: 0,
  totalItems: 0,
  difficulty: 'easy',    // 'easy' | 'medium' | 'hard' — set by gameover scene based on performance
  // Leaderboard entries — array of { name, score, date }
  leaderboard: [],
};

/**
 * Resets all per-session fields back to their defaults.
 * Persisted fields (highScore, leaderboard, playerName) are intentionally kept.
 */
export function resetState() {
  state.score          = 0;
  state.currentLevel   = 1;
  state.livesRemaining = 3;
  state.correctCount   = 0;
  state.incorrectCount = 0;
  state.totalItems     = 0;
}

/**
 * Saves the current session result to the leaderboard array.
 * Call this from the gameover scene before navigating away.
 */
export function saveToLeaderboard() {
  if (!state.playerName) return;

  state.leaderboard.push({
    name:  state.playerName,
    score: state.score,
    date:  new Date().toISOString(),
  });

  // Keep only the top 10 entries, sorted descending
  state.leaderboard.sort((a, b) => b.score - a.score);
  state.leaderboard = state.leaderboard.slice(0, 10);

  // Update all-time high score
  if (state.score > state.highScore) {
    state.highScore = state.score;
  }
}