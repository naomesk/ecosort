// javascript, html5, canvas
// Vernal Renewal Leaderboard Scene

const LeaderboardScene = (() => {
  // ─── CONFIG ───────────────────────────────────────────────────────────────
  const MEDALS = [
    { rank: 1, title: "GARDEN GUARD",   color: "#FFD700", glow: "#ffe066", icon: "👑" },
    { rank: 2, title: "BLOOM SEEKER",   color: "#C0C0C0", glow: "#e0e0e0", icon: "🌸" },
    { rank: 3, title: "ROOT RECLAIMER", color: "#CD7F32", glow: "#e8a96a", icon: "🌱" },
  ];
  const SAMPLE_SCORES = [
    { name: "  PlayerOne",   score: 25000, avatar: "🐱" },
    { name: "  PlayerTwo",   score: 23500, avatar: "🐶" },
    { name: "  PlayerThree", score: 21000, avatar: "🐻" },
    { name: "  PlayerFour",  score: 19500, avatar: "🦊" },
    { name: "  PlayerFive",  score: 18000, avatar: "🐼" },
  ];

  // ─── STATE ─────────────────────────────────────────────────────────────────
  let canvas, ctx, W, H;
  let animFrame = 0;
  let particles = [];
  let petals    = [];
  let bees      = [];
  let rowReveal = []; // per-row animation progress 0→1
  let scores    = [];
  let currentPlayer = null;
  let currentScore  = 0;

  let bgImage = new Image();
  bgImage.src = '../assets/background.jpeg';

  // ─── INIT ──────────────────────────────────────────────────────────────────
  function init(canvasEl, playerName, playerScore, allScores) {
    canvas = canvasEl;
    ctx    = canvas.getContext("2d");
    W = canvas.width;
    H = canvas.height;

    currentPlayer = playerName || null;
    currentScore  = playerScore || 0;
    scores        = buildScoreList(allScores || SAMPLE_SCORES, playerName, playerScore);

    rowReveal = scores.map(() => 0);
    spawnPetals(18);
    spawnBees(3);
    spawnParticles(30);

    animFrame = 0;
    requestAnimationFrame(loop);
  }

  function buildScoreList(base, name, score) {
    let list = [...base];
    if (name && score) {
      list.push({ name, score, avatar: "⭐", isPlayer: true });
      list.sort((a, b) => b.score - a.score);
      list = list.slice(0, 10);
    }
    return list;
  }

  // ─── LOOP ──────────────────────────────────────────────────────────────────
  function loop() {
    animFrame++;
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function update() {
    petals.forEach(p  => updatePetal(p));
    bees.forEach(b    => updateBee(b));
    particles.forEach(p => updateParticle(p));
    particles = particles.filter(p => p.life > 0);
    if (animFrame % 40 === 0) spawnParticles(2);

    // staggered row reveal
    scores.forEach((_, i) => {
      const delay = i * 12;
      if (animFrame > 30 + delay) {
        rowReveal[i] = Math.min(1, rowReveal[i] + 0.06);
      }
    });
  }

  // ─── DRAW ──────────────────────────────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    drawGrass();
    drawFence();
    drawFlowers();
    petals.forEach(drawPetal);
    particles.forEach(drawParticle);
    bees.forEach(drawBee);
    drawPanel();
    drawTitle();
    drawMedalPodiums();
    drawRows();
    drawButterfly();
  }

  // ── Background ─────────────────────────────────────────────────────────────
  function drawBackground() {
    ctx.drawImage(bgImage, 0, 0, W, H);

    // soft sun glow
    const sunGlow = ctx.createRadialGradient(W * 0.85, H * 0.12, 10, W * 0.85, H * 0.12, 180);
    sunGlow.addColorStop(0,   "rgba(255,240,100,0.45)");
    sunGlow.addColorStop(1,   "rgba(255,240,100,0)");
    ctx.fillStyle = sunGlow;
    ctx.fillRect(0, 0, W, H);
  }

  // ── Grass ──────────────────────────────────────────────────────────────────
  function drawGrass() {
    // const g = ctx.createLinearGradient(0, H * 0.6, 0, H);
    // g.addColorStop(0, "#7bc947");
    // g.addColorStop(1, "#4a9c2f");
    // ctx.fillStyle = g;
    // ctx.beginPath();
    // ctx.moveTo(0, H * 0.62);
    // for (let x = 0; x <= W; x += 8) {
    //   const sway = Math.sin(x * 0.05 + animFrame * 0.04) * 4;
    //   ctx.lineTo(x, H * 0.62 + sway);
    // }
    // ctx.lineTo(W, H);
    // ctx.lineTo(0, H);
    // ctx.closePath();
    // ctx.fill();
  }

  // ── Fence ──────────────────────────────────────────────────────────────────
  function drawFence() {
    // ctx.strokeStyle = "#c8854a";
    // ctx.lineWidth   = 3;
    // const fenceY = H * 0.58;
    // // horizontal rails
    // [fenceY, fenceY + 22].forEach(y => {
    //   ctx.beginPath();
    //   ctx.moveTo(0, y);
    //   ctx.lineTo(W, y);
    //   ctx.stroke();
    // });
    // // pickets
    // ctx.fillStyle = "#daa06a";
    // for (let x = 10; x < W; x += 28) {
    //   ctx.beginPath();
    //   ctx.moveTo(x + 6, fenceY - 14);
    //   ctx.lineTo(x + 14, fenceY - 22);
    //   ctx.lineTo(x + 22, fenceY - 14);
    //   ctx.lineTo(x + 22, fenceY + 36);
    //   ctx.lineTo(x + 6,  fenceY + 36);
    //   ctx.closePath();
    //   ctx.fill();
    //   ctx.stroke();
    // }
  }

  // ── Flowers ────────────────────────────────────────────────────────────────
  const FLOWER_DEFS = [
    // { x: 0.05, type: "pink"   },
    // { x: 0.12, type: "yellow" },
    // { x: 0.18, type: "white"  },
    // { x: 0.78, type: "pink"   },
    // { x: 0.85, type: "yellow" },
    // { x: 0.91, type: "white"  },
    // { x: 0.97, type: "pink"   },
  ];

  function drawFlowers() {function drawFlowers() {
  const flowers = [
    { x: 0.05, color: '#FF6B9D' },
    { x: 0.12, color: '#FFD93D' },
    { x: 0.18, color: '#FF6B6B' },
    { x: 0.75, color: '#A8E6CF' },
    { x: 0.82, color: '#FFD93D' },
    { x: 0.88, color: '#FF6B9D' },
    { x: 0.93, color: '#FF6B6B' },
  ];

  flowers.forEach(f => {
    const x = W * f.x;
    const y = H * 0.88;
    
    // Стебель
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 30);
    ctx.stroke();
    
    // Цветок
    ctx.fillStyle = f.color;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Серединка
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}
    FLOWER_DEFS.forEach(f => {
      const x    = f.x * W;
      const baseY = H * 0.63;
      const sway  = Math.sin(animFrame * 0.03 + f.x * 10) * 3;
      drawFlower(x + sway, baseY, f.type);
    });
  }

  function drawFlower(x, y, type) {
    const colors = {
      pink:   ["#f4a7b9","#e87a97","#ffe0ea"],
      yellow: ["#ffe066","#f4c430","#fff9c4"],
      white:  ["#ffffff","#e0e0e0","#f5f5f5"],
    }[type] || ["#f4a7b9","#e87a97","#ffe0ea"];

    // stem
    ctx.strokeStyle = "#4a9c2f";
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 40);
    ctx.stroke();

    // petals
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      ctx.fillStyle = colors[0];
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(angle) * 10, y + Math.sin(angle) * 10, 7, 4, angle, 0, Math.PI * 2);
      ctx.fill();
    }
    // center
    ctx.fillStyle = colors[2];
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors[1];
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Panel ──────────────────────────────────────────────────────────────────
  function drawPanel() {
    const px = W * 0.08, py = H * 0.06;
    const pw = W * 0.84, ph = H * 0.82;
    const r  = 22;

    ctx.save();
    ctx.shadowColor = "rgba(80,120,50,0.18)";
    ctx.shadowBlur  = 24;

    // panel fill
    ctx.fillStyle = "rgba(255,252,240,0.92)";
    roundRect(px, py, pw, ph, r);
    ctx.fill();

    // panel border
    ctx.strokeStyle = "rgba(180,210,130,0.7)";
    ctx.lineWidth   = 2.5;
    roundRect(px, py, pw, ph, r);
    ctx.stroke();

    ctx.restore();

    // decorative corner vines
    drawVineCorner(px + 14, py + 14, 1, 1);
    drawVineCorner(px + pw - 14, py + 14, -1, 1);
  }

  function drawVineCorner(x, y, dx, dy) {
    ctx.strokeStyle = "#7bc947";
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y + dy * 20);
    ctx.quadraticCurveTo(x, y, x + dx * 20, y);
    ctx.stroke();
    // small leaf
    ctx.fillStyle = "#5aaa30";
    ctx.beginPath();
    ctx.ellipse(x + dx * 12, y + dy * 6, 5, 3, Math.atan2(dy, dx), 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Title ──────────────────────────────────────────────────────────────────
  function drawTitle() {
    const cx = W / 2;
    const ty = H * 0.14;

    ctx.textAlign = "center";
    ctx.fillStyle = "#3a7a2a";
    ctx.font      = `bold ${Math.round(W * 0.042)}px 'Georgia', serif`;
    ctx.fillText("🌿 VERNAL RENEWAL LEADERBOARD 🌿", cx, ty);

    ctx.fillStyle = "#7aaa40";
    ctx.font      = `${Math.round(W * 0.022)}px 'Georgia', serif`;
    ctx.fillText("RANKINGS — CLEAR THE GRIME, RENEW THE GARDEN!", cx, ty + H * 0.045);

    // divider vine
    ctx.strokeStyle = "#b0d870";
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(W * 0.12, ty + H * 0.065);
    ctx.lineTo(W * 0.88, ty + H * 0.065);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ── Medal Podiums ───────────────────────────────────────────────────────────
  function drawMedalPodiums() {
    const top3 = scores.slice(0, 3);
    if (top3.length === 0) return;

    const podiumY  = H * 0.28;
    const spacing  = W * 0.22;
    const startX   = W / 2 - spacing;

    const order = [1, 0, 2]; // display: 2nd, 1st, 3rd
    const yOff  = [H * 0.04, 0, H * 0.06];

    order.forEach((idx, i) => {
      const player = top3[idx];
      if (!player) return;
      const medal = MEDALS[idx];
      const x     = startX + i * spacing;
      const y     = podiumY + yOff[i];

      // glow
      const glow = ctx.createRadialGradient(x, y, 4, x, y, 38);
      glow.addColorStop(0, medal.glow + "99");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 38, 0, Math.PI * 2);
      ctx.fill();

      // medal circle
      ctx.fillStyle = medal.color;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // rank number
      ctx.fillStyle = "#fff";
      ctx.font      = `bold ${Math.round(W * 0.038)}px Georgia`;
      ctx.textAlign = "center";
      ctx.fillText(medal.rank, x, y + 5);

      // title badge
      ctx.fillStyle = medal.color + "cc";
      ctx.beginPath();
      roundRect(x - 50, y + 32, 100, 22, 8);
      ctx.fill();

      ctx.fillStyle = "#3a4a20";
      ctx.font      = `bold ${Math.round(W * 0.016)}px Georgia`;
      ctx.fillText(`'${medal.title}'`, x, y + 47);

      // score
      ctx.fillStyle = "#5a7a2a";
      ctx.font      = `${Math.round(W * 0.018)}px Georgia`;
      ctx.fillText(player.score.toLocaleString(), x, y + 66);
    });
  }

  // ── Score Rows ─────────────────────────────────────────────────────────────
  function drawRows() {
    const listStartY = H * 0.48;
    const rowH       = H * 0.084;
    const lx         = W * 0.14;
    const rw         = W * 0.72;

    scores.forEach((entry, i) => {
      const reveal = rowReveal[i];
      if (reveal <= 0) return;

      const y = listStartY + i * rowH;
      ctx.save();
      ctx.globalAlpha = reveal;
      ctx.translate((1 - reveal) * -30, 0);

      // row bg
      const isTop3     = i < 3;
      const isMe       = entry.isPlayer;
      ctx.fillStyle    = isMe      ? "rgba(255,220,80,0.25)"
                       : isTop3   ? "rgba(180,230,130,0.22)"
                       :            "rgba(255,255,255,0.55)";
      ctx.strokeStyle  = isMe     ? "rgba(200,160,0,0.4)"
                       : isTop3  ? "rgba(120,180,80,0.3)"
                       :           "rgba(180,220,140,0.3)";
      ctx.lineWidth    = 1.5;
      roundRect(lx, y - rowH * 0.5 + 4, rw, rowH - 6, 12);
      ctx.fill();
      ctx.stroke();

      // rank
      const rankColors = ["#FFD700","#C0C0C0","#CD7F32"];
      ctx.fillStyle  = rankColors[i] || "#7aaa40";
      ctx.font       = `bold ${Math.round(W * 0.026)}px Georgia`;
      ctx.textAlign  = "left";
      ctx.fillText(`${i + 1}.`, lx + 14, y + 6);

      // avatar
      ctx.font      = `${Math.round(W * 0.032)}px serif`;
      ctx.fillText(entry.avatar || "🌿", lx + 52, y + 8);

      // name
      ctx.fillStyle = isMe ? "#8a6000" : "#2a4a18";
      ctx.font      = `${isMe ? "bold " : ""}${Math.round(W * 0.026)}px Georgia`;
      ctx.fillText(entry.name + (isMe ? " ★" : ""), lx + 100, y + 6);

      // score
      ctx.fillStyle = "#5a7a2a";
      ctx.font      = `bold ${Math.round(W * 0.026)}px Georgia`;
      ctx.textAlign = "right";
      ctx.fillText(entry.score.toLocaleString(), lx + rw - 16, y + 6);

      ctx.restore();
    });
  }

  // ── Butterfly ──────────────────────────────────────────────────────────────
  function drawButterfly() {
    const t   = animFrame * 0.02;
    const bx  = W * 0.82 + Math.sin(t * 0.7) * 18;
    const by  = H * 0.22 + Math.sin(t * 1.1) * 14;
    const flap = Math.abs(Math.sin(animFrame * 0.18));

    ctx.save();
    ctx.translate(bx, by);

    // wings
    [1, -1].forEach(side => {
      ctx.save();
      ctx.scale(side * (0.5 + flap * 0.5), 1);
      ctx.fillStyle = "rgba(200,160,230,0.75)";
      ctx.beginPath();
      ctx.ellipse(22, -10, 22, 14, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(240,200,255,0.5)";
      ctx.beginPath();
      ctx.ellipse(18, 8, 16, 10, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // body
    ctx.fillStyle = "#8a6030";
    ctx.beginPath();
    ctx.ellipse(0, 0, 3, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ── Particles / Petals / Bees ───────────────────────────────────────────────
  function spawnPetals(n) {
    for (let i = 0; i < n; i++) {
      petals.push({
        x:     Math.random() * W,
        y:     Math.random() * H * 0.8,
        size:  4 + Math.random() * 7,
        vx:    (Math.random() - 0.5) * 0.6,
        vy:    0.4 + Math.random() * 0.8,
        rot:   Math.random() * Math.PI * 2,
        rotV:  (Math.random() - 0.5) * 0.06,
        color: ["#f4a7b9","#ffe0c8","#ffd6e8","#ffcce0"][Math.floor(Math.random() * 4)],
        alpha: 0.5 + Math.random() * 0.5,
      });
    }
  }

  function updatePetal(p) {
    p.x   += p.vx + Math.sin(animFrame * 0.02 + p.y * 0.01) * 0.3;
    p.y   += p.vy;
    p.rot += p.rotV;
    if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
  }

  function drawPetal(p) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function spawnBees(n) {
    for (let i = 0; i < n; i++) {
      bees.push({
        x:   Math.random() * W,
        y:   H * 0.2 + Math.random() * H * 0.4,
        vx:  (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random()),
        vy:  (Math.random() - 0.5) * 0.4,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function updateBee(b) {
    b.x     += b.vx;
    b.y     += b.vy + Math.sin(animFrame * 0.08 + b.phase) * 0.5;
    if (b.x > W + 20) b.x = -20;
    if (b.x < -20)    b.x = W + 20;
    b.y = Math.max(H * 0.08, Math.min(H * 0.55, b.y));
  }

  function drawBee(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    if (b.vx < 0) ctx.scale(-1, 1);
    // body
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // stripes
    ctx.fillStyle = "#333";
    [-3, 1, 5].forEach(sx => {
      ctx.fillRect(sx, -5, 2, 10);
    });
    ctx.globalAlpha = 0.6;
    // wings
    ctx.fillStyle = "#d0f0ff";
    ctx.beginPath();
    ctx.ellipse(-2, -7, 6, 4, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(3, -6, 5, 3, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function spawnParticles(n) {
    for (let i = 0; i < n; i++) {
      particles.push({
        x:     W * 0.08 + Math.random() * W * 0.84,
        y:     H * 0.06 + Math.random() * H * 0.88,
        vx:    (Math.random() - 0.5) * 0.5,
        vy:    -0.3 - Math.random() * 0.5,
        size:  1 + Math.random() * 2,
        life:  80 + Math.random() * 80,
        maxLife: 160,
        color: ["#c8f090","#fffacc","#ffdde8"][Math.floor(Math.random() * 3)],
      });
    }
  }

  function updateParticle(p) {
    p.x    += p.vx;
    p.y    += p.vy;
    p.life -= 1;
  }

  function drawParticle(p) {
    ctx.save();
    ctx.globalAlpha = (p.life / p.maxLife) * 0.5;
    ctx.fillStyle   = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y,     x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x,     y + h, r);
    ctx.arcTo(x,     y + h, x,     y,     r);
    ctx.arcTo(x,     y,     x + w, y,     r);
    ctx.closePath();
  }

  // ─── PUBLIC API ────────────────────────────────────────────────────────────
  return { init };
})();

// ─── STANDALONE DEMO (remove if embedding into your game) ──────────────────
// If you run this page directly, it bootstraps a demo canvas.
(function autoBootstrap() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }

  function bootstrap() {
    // Only auto-run if there's already a <canvas id="leaderboardCanvas">
    // OR create one for demo purposes.
    let canvas = document.getElementById("leaderboardCanvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id     = "leaderboardCanvas";
      canvas.width  = 900;
      canvas.height = 600;
      canvas.style.cssText =
        "display:block;margin:20px auto;border-radius:18px;" +
        "box-shadow:0 8px 40px rgba(60,100,40,0.18);max-width:98vw;";
      document.body.appendChild(canvas);
    }
    LeaderboardScene.init(canvas, null, null, null);
  }
})();

// export default LeaderboardScene;