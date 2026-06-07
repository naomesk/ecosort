/**
 * shared/utils.js
 * Pure helper functions with no side-effects.
 * Import only what you need.
 *
 *   import { randomFrom, clamp } from '../../shared/utils.js';
 */

// ---------------------------------------------------------------------------
// Array helpers
// ---------------------------------------------------------------------------

/**
 * Returns a random element from an array.
 * @template T
 * @param {T[]} arr
 * @returns {T}
 */
export function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Shuffles an array in place (Fisher-Yates) and returns it.
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------------------------------------------------------------------------
// Number helpers
// ---------------------------------------------------------------------------

/**
 * Clamps a value between min and max (inclusive).
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between a and b by t (0–1).
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @returns {number}
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Returns a random integer between min and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---------------------------------------------------------------------------
// Canvas helpers
// ---------------------------------------------------------------------------

/**
 * Resizes a canvas to match its CSS display size.
 * Call on window resize and before drawing.
 * @param {HTMLCanvasElement} canvas
 * @returns {{ width: number, height: number }}
 */
export function fitCanvas(canvas) {
  const { clientWidth: width, clientHeight: height } = canvas;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width  = width;
    canvas.height = height;
  }
  return { width, height };
}

/**
 * Draws text centered horizontally at a given y position.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} y
 * @param {string} [font]
 * @param {string} [color]
 */
export function drawCenteredText(ctx, text, y, font = '24px sans-serif', color = '#fff') {
  ctx.save();
  ctx.font      = font;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, ctx.canvas.width / 2, y);
  ctx.restore();
}

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

/**
 * Shorthand for querySelector inside an optional root element.
 * @param {string} selector
 * @param {Element|Document} [root=document]
 * @returns {Element|null}
 */
export function qs(selector, root = document) {
  return root.querySelector(selector);
}

/**
 * Creates a DOM element with optional classes and inner text.
 * @param {string} tag
 * @param {{ classes?: string[], text?: string, attrs?: Record<string,string> }} [opts]
 * @returns {HTMLElement}
 */
export function el(tag, { classes = [], text = '', attrs = {} } = {}) {
  const node = document.createElement(tag);
  if (classes.length) node.classList.add(...classes);
  if (text)           node.textContent = text;
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

// ---------------------------------------------------------------------------
// Timer helpers
// ---------------------------------------------------------------------------

/**
 * Returns a promise that resolves after `ms` milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}