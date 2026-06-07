/**
 * shared/audioManager.js
 * Singleton audio manager for background music.
 *
 * Music persists across scene transitions and only restarts
 * when you explicitly call restart() or stop() then play().
 *
 * USAGE
 *   import { audioManager } from '../../shared/audioManager.js';
 *   audioManager.play('assets/audio/bg-music.mp3');  // starts looping
 *   audioManager.stop();                              // stops
 *   audioManager.setVolume(0.4);                      // 0.0 – 1.0
 */

class AudioManager {
  constructor() {
    this._audio   = null;
    this._src     = null;
    this._volume  = 0.4;
  }

  /**
   * Start playing a looping track.
   * If the same src is already playing, does nothing.
   * If a different src is playing, swaps to the new one.
   * @param {string} src  Path relative to src/ e.g. 'assets/audio/bg.mp3'
   */
  play(src) {
    // Already playing the same track — leave it alone
    if (this._audio && !this._audio.paused && this._src === src) return;

    // Different track or not yet started
    if (this._audio) {
      this._audio.pause();
      this._audio.currentTime = 0;
    }

    this._src         = src;
    this._audio       = new Audio(src);
    this._audio.loop  = true;
    this._audio.volume = this._volume;

    // Browsers may block autoplay — catch the rejection silently
    this._audio.play().catch(() => {
      // Will retry on first user interaction (see _unlockOnInteraction)
      this._unlockOnInteraction();
    });
  }

  /** Stop and discard the current track. */
  stop() {
    if (!this._audio) return;
    this._audio.pause();
    this._audio.currentTime = 0;
    this._audio = null;
    this._src   = null;
  }

  /** Pause without discarding. Call play(src) to resume. */
  pause() {
    if (this._audio) this._audio.pause();
  }

  /** @param {number} v  0.0 – 1.0 */
  setVolume(v) {
    this._volume = Math.min(1, Math.max(0, v));
    if (this._audio) this._audio.volume = this._volume;
  }

  /** Retry play after the first user gesture (autoplay policy). */
  _unlockOnInteraction() {
    const resume = () => {
      if (this._audio && this._audio.paused) {
        this._audio.play().catch(() => {});
      }
      document.removeEventListener('click', resume);
      document.removeEventListener('keydown', resume);
    };
    document.addEventListener('click',   resume, { once: true });
    document.addEventListener('keydown', resume, { once: true });
  }
}

// Export a single shared instance — importing this module anywhere
// gives you the same object, so music persists across scenes.
export const audioManager = new AudioManager();