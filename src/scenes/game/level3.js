/**
 * scenes/game/level3.js - Level 3
 */
import { getItemsForLevel, CATEGORIES, LEVEL_BIN_KEYS } from '/shared/trashData.js';
import { shuffle }                                        from '/shared/utils.js';

const LEVEL        = 3;
const BG_IMAGE_SRC = '/assets/images/game-bg.png';

const imgCache = new Map();
function loadImg(src) {
  if (imgCache.has(src)) return imgCache.get(src);
  const img = new Image(); img.src = src; imgCache.set(src, img); return img;
}
function ready(img) { return img && img.complete && img.naturalWidth > 0; }

function preload(items) {
  loadImg(BG_IMAGE_SRC);
  items.forEach(item => loadImg(`/assets/images/trash/${item.id}.png`));
  LEVEL_BIN_KEYS[LEVEL].forEach(key => {
    if (CATEGORIES[key].hasImage) {
      loadImg(`/assets/images/bins/${key}-bin-closed.png`);
      loadImg(`/assets/images/bins/${key}-bin-open.png`);
    }
  });
}

export function start(ctx, canvas, { onScore, onLoseLife, onLevelEnd }) {

  const ITEMS_TO_CLEAR = 15;
  const POINTS_CORRECT = 20;
  const POINTS_WRONG   = -10;
  const ITEM_W         = 130;
  const ITEM_H         = 130;
  const HINT_FRAMES    = 90;

  let rafId = null, itemsCleared = 0, levelEnded = false;
  let activeItem = null, poolIndex = 0;
  let hintText = '', hintFrames = 0, hintCorrect = true;
  let pressedBinKey = null;

  const itemPool = shuffle(getItemsForLevel(LEVEL));
  preload(itemPool);

  // Dynamic bin height — wider bins (fewer of them) get more vertical space
  function getBins() {
    const keys = LEVEL_BIN_KEYS[LEVEL];
    const binW  = canvas.width / keys.length;
    const BH    = Math.round(Math.min(210, Math.max(148, binW * 0.46)));
    const binY  = canvas.height - BH;
    return keys.map((key, i) => ({
      key, x: i * binW, y: binY, width: binW, height: BH, ...CATEGORIES[key],
    }));
  }

  function spawnItem() {
    if (poolIndex >= itemPool.length) poolIndex = 0;
    const data = itemPool[poolIndex++];
    activeItem = { ...data, x: canvas.width / 2 - ITEM_W / 2, y: 90, width: ITEM_W, height: ITEM_H };
  }
  spawnItem();

  // ── Draw helpers ───────────────────────────────────────────────────────────
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.arcTo(x+w,y,x+w,y+r,r);
    ctx.lineTo(x+w,y+h-r); ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
    ctx.lineTo(x+r,y+h); ctx.arcTo(x,y+h,x,y+h-r,r);
    ctx.lineTo(x,y+r); ctx.arcTo(x,y,x+r,y,r); ctx.closePath();
  }

  // Background drawn with CSS cover-fill logic (no white bars)
  function drawBg() {
    const bg = imgCache.get(BG_IMAGE_SRC);
    if (!ready(bg)) { ctx.fillStyle = '#c8e6c9'; ctx.fillRect(0, 0, canvas.width, canvas.height); return; }
    const scale = Math.max(canvas.width / bg.naturalWidth, canvas.height / bg.naturalHeight);
    const dw = bg.naturalWidth * scale, dh = bg.naturalHeight * scale;
    ctx.drawImage(bg, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
  }

  // Draws a proper trash-bin shape for categories without a PNG image
  function drawFancyBin(bin, isOpen) {
    const cat  = CATEGORIES[bin.key];
    const bx   = bin.x + 4, bw = bin.width - 8, bh = bin.height;
    const by   = bin.y;
    const lidH = Math.max(12, Math.round(bh * 0.15));
    const bodyY = by + lidH + 3;
    const bodyH = bh - lidH - 3;
    const r     = 6;
    const base  = cat.color;

    ctx.save();
    if (isOpen) { ctx.shadowColor = base; ctx.shadowBlur = 30; }

    // ── Body (rounded bottom corners) ────────────────────────────────────────
    ctx.beginPath();
    ctx.moveTo(bx, bodyY);
    ctx.lineTo(bx + bw, bodyY);
    ctx.lineTo(bx + bw, bodyY + bodyH - r);
    ctx.arcTo(bx + bw, bodyY + bodyH, bx + bw - r, bodyY + bodyH, r);
    ctx.lineTo(bx + r, bodyY + bodyH);
    ctx.arcTo(bx, bodyY + bodyH, bx, bodyY + bodyH - r, r);
    ctx.closePath();
    ctx.fillStyle = isOpen ? base + 'ee' : base + 'aa';
    ctx.fill();
    ctx.strokeStyle = isOpen ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.18)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Subtle vertical lines (texture)
    ctx.strokeStyle = 'rgba(0,0,0,0.07)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const lx = bx + (bw / 4) * i;
      ctx.beginPath(); ctx.moveTo(lx, bodyY + 8); ctx.lineTo(lx, bodyY + bodyH - 8); ctx.stroke();
    }

    // ── Lid ─────────────────────────────────────────────────────────────────
    ctx.restore(); ctx.save();
    if (isOpen) { ctx.shadowColor = base; ctx.shadowBlur = 20; }

    if (isOpen) {
      // Tilted lid reveals the open bin
      ctx.translate(bx - 2, bodyY);
      ctx.rotate(-0.42);
      ctx.fillStyle = base;
      ctx.beginPath();
      ctx.moveTo(-3, -lidH); ctx.lineTo(bw * 0.62, -lidH);
      ctx.lineTo(bw * 0.62, 0); ctx.lineTo(-3, 0); ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1; ctx.stroke();
    } else {
      // Closed lid: slightly wider, flat top
      const lx = bx - 5, lw = bw + 10;
      ctx.fillStyle = base;
      ctx.beginPath();
      ctx.moveTo(lx + 4, by); ctx.lineTo(lx + lw - 4, by);
      ctx.arcTo(lx + lw, by, lx + lw, by + 4, 4);
      ctx.lineTo(lx + lw, by + lidH); ctx.lineTo(lx, by + lidH);
      ctx.lineTo(lx, by + 4); ctx.arcTo(lx, by, lx + 4, by, 4);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1; ctx.stroke();
      // Grip handle
      const gw = Math.round(bw * 0.28), gh = Math.max(5, Math.round(lidH * 0.45));
      const gx = bx + (bw - gw) / 2, gy = by + (lidH - gh) / 2;
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.beginPath(); ctx.moveTo(gx+3,gy); ctx.lineTo(gx+gw-3,gy);
      ctx.arcTo(gx+gw,gy,gx+gw,gy+3,3); ctx.lineTo(gx+gw,gy+gh);
      ctx.lineTo(gx,gy+gh); ctx.lineTo(gx,gy+3); ctx.arcTo(gx,gy,gx+3,gy,3);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore(); ctx.save();

    // ── Icon ─────────────────────────────────────────────────────────────────
    const iconPx = Math.round(Math.min(bodyH * 0.44, bw * 0.38));
    ctx.font = iconPx + 'px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = isOpen ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.4)';
    ctx.fillText(cat.icon, bx + bw / 2, bodyY + bodyH * 0.42);
    ctx.textBaseline = 'alphabetic';

    ctx.restore();
  }

  function drawBin(bin, isOpen) {
    const cat = CATEGORIES[bin.key];
    const bx  = bin.x + 4, bw = bin.width - 8;

    if (!cat.hasImage) {
      drawFancyBin(bin, isOpen);
    } else {
      const src = `/assets/images/bins/${bin.key}-bin-${isOpen ? 'open' : 'closed'}.png`;
      const img = imgCache.get(src);
      if (ready(img)) ctx.drawImage(img, bx, bin.y, bw, bin.height);
      else { ctx.fillStyle = cat.color + '55'; ctx.fillRect(bx, bin.y, bw, bin.height); }
    }

    // Outline + glow for image bins when open
    if (cat.hasImage && isOpen) {
      ctx.save();
      ctx.shadowColor = cat.color; ctx.shadowBlur = 18;
      ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2.5;
      ctx.strokeRect(bx, bin.y, bw, bin.height);
      ctx.restore();
    }

    // Label strip
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.62)';
    ctx.fillRect(bx, bin.y + bin.height - 32, bw, 32);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Nunito, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(cat.icon + '  ' + cat.label, bin.x + bin.width / 2, bin.y + bin.height - 11);
    ctx.restore();
  }

  // ── Draw ───────────────────────────────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBg();

    const bins = getBins();
    const BH   = bins[0]?.height ?? 160;

    bins.forEach(bin => drawBin(bin, bin.key === pressedBinKey));

    if (activeItem) {
      const img = imgCache.get(`/assets/images/trash/${activeItem.id}.png`);
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 5;
      if (ready(img)) ctx.drawImage(img, activeItem.x, activeItem.y, activeItem.width, activeItem.height);
      else { ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(activeItem.x, activeItem.y, activeItem.width, activeItem.height); }
      ctx.restore();
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      roundRect(activeItem.x, activeItem.y + activeItem.height + 4, activeItem.width, 28, 7); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Nunito, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(activeItem.label, activeItem.x + activeItem.width / 2, activeItem.y + activeItem.height + 23);
      ctx.restore();
    }

    if (hintFrames > 0 && hintText) {
      const alpha = Math.min(1, hintFrames / 20);
      const bh = 46, bw = Math.min(560, canvas.width - 40);
      const bx = canvas.width / 2 - bw / 2, by = canvas.height - BH - bh - 10;
      ctx.save(); ctx.globalAlpha = alpha;
      ctx.fillStyle = hintCorrect ? 'rgba(76,175,80,0.9)' : 'rgba(229,57,53,0.9)';
      roundRect(bx, by, bw, bh, 10); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Nunito, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(hintText, canvas.width / 2, by + 29);
      ctx.restore(); hintFrames--;
    }

    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '600 13px Nunito, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(`${itemsCleared} / ${ITEMS_TO_CLEAR}`, canvas.width - 14, canvas.height - BH - 10);
    ctx.restore();
  }

  function gameLoop() { draw(); rafId = requestAnimationFrame(gameLoop); }

  function classifyItem(item, binKey) {
    if (levelEnded) return;
    if (binKey === item.category) {
      onScore(POINTS_CORRECT); hintCorrect = true;
      hintText = item.hint ? `✓  ${item.hint}` : '✓  Correct!';
    } else {
      onLoseLife(); if (POINTS_WRONG !== 0) onScore(POINTS_WRONG); hintCorrect = false;
      const correctCat = CATEGORIES[item.category];
      hintText = item.hint ? `✗  ${item.hint}` : `✗  Should go in: ${correctCat?.label ?? item.category}`;
    }
    hintFrames = HINT_FRAMES; itemsCleared++;
    if (itemsCleared >= ITEMS_TO_CLEAR) {
      levelEnded = true; activeItem = null; setTimeout(() => onLevelEnd('complete'), 700); return;
    }
    spawnItem();
  }

  function canvasPos(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return { x: (clientX - rect.left) * (canvas.width / rect.width), y: (clientY - rect.top) * (canvas.height / rect.height) };
  }
  function binAtPos(x, y) {
    return getBins().find(b => x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height);
  }
  function onMouseDown(e) {
    if (!activeItem || levelEnded) return;
    const { x, y } = canvasPos(e.clientX, e.clientY);
    pressedBinKey = (binAtPos(x, y) || {}).key ?? null;
  }
  function onMouseUp(e) {
    if (!activeItem || levelEnded || !pressedBinKey) { pressedBinKey = null; return; }
    const { x, y } = canvasPos(e.clientX, e.clientY);
    const bin = binAtPos(x, y); const key = pressedBinKey; pressedBinKey = null;
    if (bin && bin.key === key) { const item = activeItem; activeItem = null; classifyItem(item, key); }
  }
  function onTouchStart(e) {
    e.preventDefault(); if (!activeItem || levelEnded) return;
    const t = e.touches[0]; const { x, y } = canvasPos(t.clientX, t.clientY);
    pressedBinKey = (binAtPos(x, y) || {}).key ?? null;
  }
  function onTouchEnd(e) {
    e.preventDefault(); if (!activeItem || levelEnded || !pressedBinKey) { pressedBinKey = null; return; }
    const t = e.changedTouches[0]; const { x, y } = canvasPos(t.clientX, t.clientY);
    const bin = binAtPos(x, y); const key = pressedBinKey; pressedBinKey = null;
    if (bin && bin.key === key) { const item = activeItem; activeItem = null; classifyItem(item, key); }
  }

  canvas.addEventListener('mousedown',  onMouseDown);
  canvas.addEventListener('mouseup',    onMouseUp);
  canvas.addEventListener('mouseleave', () => { pressedBinKey = null; });
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchend',   onTouchEnd,   { passive: false });
  rafId = requestAnimationFrame(gameLoop);

  return {
    stop() {
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      canvas.removeEventListener('mousedown',  onMouseDown);
      canvas.removeEventListener('mouseup',    onMouseUp);
      canvas.removeEventListener('mouseleave', () => {});
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend',   onTouchEnd);
    },
  };
}
