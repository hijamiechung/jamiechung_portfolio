// A peaceful, ambient pixel-grid "sea" scene — same hard-edged, dithered-density
// pixel language as pixelWeather.ts (deterministic hash instead of noise, cells are
// either on or off, only alpha varies), but decorative rather than data-bound: nothing
// here reads live weather. A dolphin periodically arcs up out of the water and back in,
// leaving a brief white splash ring at each crossing. Clouds and an occasional gull
// drift across the sky. Self-contained — no props/state leak into layout or content.

const CELL = 9;
const SURFACE_FRAC = 0.44; // sky is the top 44%, water the bottom 56%

function hash(x: number, y: number, seed = 7) {
  let n = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(seed, 1274126177);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function smoothstep(t: number) {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

// A tapered wedge from A (wide) to B (narrow/pointed) — used for the tail fluke's
// two blades, which read far more like an actual fin than round lobes.
function bladeValue(lx: number, ly: number, ax: number, ay: number, bx: number, by: number, widthA: number, widthB: number, scale: number): number {
  const segX = bx - ax, segY = by - ay;
  const len = Math.hypot(segX, segY) || 1;
  const ux = segX / len, uy = segY / len;
  const vx = lx - ax, vy = ly - ay;
  const s = vx * ux + vy * uy;
  if (s < -0.3 * scale || s > len + 0.15 * scale) return 0;
  const sClamped = Math.max(0, Math.min(len, s));
  const perpX = vx - ux * sClamped, perpY = vy - uy * sClamped;
  const perp = Math.hypot(perpX, perpY);
  const width = widthA + (widthB - widthA) * (sClamped / len);
  const half = width / 2;
  if (perp < half) return 1;
  if (perp < half + 0.5 * scale) return 0.5;
  return 0;
}

const CLOUD_BITMAPS = [
  ["0001111100000", "0011111111000", "0111111111110", "1111111111111", "1111111111111", "0111111111110"],
  ["0000111110000", "0001111111100", "0111111111110", "1111111111111", "0111111111110", "0011111111100"],
];
const CLOUD_W = CLOUD_BITMAPS[0][0].length;

// Two wing phases (up/down) so it reads as a slow gliding flap rather than a rigid
// shape sliding across in a straight line.
const GULL_FRAMES: [number, number][][] = [
  [[-2, 1], [-1, 0], [0, 1], [1, 0], [2, 1]],
  [[-2, 0], [-1, 1], [0, 1], [1, 1], [2, 0]],
];

type Size = "small" | "medium" | "large";
const SIZE_PARAMS: Record<Size, { jumpRows: number; scale: number; duration: number; drift: number }> = {
  small: { jumpRows: 9, scale: 1, duration: 1600, drift: 9 },
  medium: { jumpRows: 13, scale: 1.35, duration: 2000, drift: 13 },
  large: { jumpRows: 17, scale: 1.7, duration: 2400, drift: 17 },
};
const SIZES: Size[] = ["small", "medium", "large"];

// Dolphin body is a partial arc (a short, thick rainbow-band segment) tapering thin at
// both ends, facing right (the direction every jump drifts) — nose at the shallow end,
// a forked tail fluke and a small dorsal-fin bump added as separate blobs anchored to
// the arc's geometry, not baked into a fixed bitmap, so they scale cleanly with `scale`.
const BODY_R = 4; // cells, at scale 1
const BODY_THICKNESS = 1.3;
const THETA_MIN = (-165 * Math.PI) / 180; // tail end
const THETA_MAX = (-15 * Math.PI) / 180; // nose end
const THETA_MID = -Math.PI / 2;
const THETA_SPAN = (THETA_MAX - THETA_MIN) / 2;

function dolphinShapeValue(lx: number, ly: number, scale: number): number {
  const R = BODY_R * scale;
  const cyLocal = R; // curvature center sits R below the anchor point (lx=0, ly=0)
  const dx = lx, dy = ly - cyLocal;
  const dist = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);

  let best = 0;
  if (angle >= THETA_MIN && angle <= THETA_MAX) {
    const tNorm = Math.max(0, 1 - Math.abs(angle - THETA_MID) / THETA_SPAN);
    const thickness = BODY_THICKNESS * scale * (0.28 + 0.85 * tNorm);
    const d = Math.abs(dist - R);
    if (d < thickness * 0.5) best = 1;
    else if (d < thickness * 0.5 + 0.6 * scale) best = Math.max(best, 0.55);
  }

  // Tail fluke: two tapered blades fanning out from the same body-attachment point
  // to two separate tips (spread along the radial axis, reach along the tangent) —
  // wide at the body, pointed at the tips, with a natural notch between them where
  // they're far apart. Reads as an actual fin silhouette, not two round lobes.
  const tangentX = -Math.sin(THETA_MIN), tangentY = Math.cos(THETA_MIN);
  const radialX = Math.cos(THETA_MIN), radialY = Math.sin(THETA_MIN);
  const tailX = R * radialX, tailY = cyLocal + R * radialY;
  const tipLen = 1.4 * scale, tipSpread = 1.7 * scale;
  const baseW = 1.15 * scale, tipW = 0.35 * scale;
  for (const sign of [1, -1]) {
    const tipX = tailX + tangentX * tipLen + radialX * tipSpread * sign;
    const tipY = tailY + tangentY * tipLen + radialY * tipSpread * sign;
    best = Math.max(best, bladeValue(lx, ly, tailX, tailY, tipX, tipY, baseW, tipW, scale));
  }

  // Dorsal fin: a small bump just outside the peak of the arc.
  const dorsalX = 0, dorsalY = -1.0 * scale;
  const dDorsal = Math.hypot(lx - dorsalX, ly - dorsalY);
  const dorsalR = 0.75 * scale;
  if (dDorsal < dorsalR) best = Math.max(best, 1);
  else if (dDorsal < dorsalR + 0.5 * scale) best = Math.max(best, 0.5);

  return best;
}

type Jump = { startT: number; startCol: number; size: Size; endSplashed: boolean };
type Droplet = { dx: number; dy: number; grav: number; life: number; delay: number };
type Splash = { col: number; row: number; startT: number; droplets: Droplet[] };

// A handful of individual droplets flung up and out, each falling back under its own
// little arc — reads as scattering water, not an expanding ring.
function makeDroplets(seed: number): Droplet[] {
  const out: Droplet[] = [];
  for (let i = 0; i < 9; i++) {
    const angle = ((-90 + (hash(seed, i * 13 + 1) - 0.5) * 150) * Math.PI) / 180;
    const speed = 3 + hash(seed, i * 13 + 2) * 3.5;
    out.push({
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      grav: 9 + hash(seed, i * 13 + 3) * 4,
      life: 420 + hash(seed, i * 13 + 4) * 380,
      delay: hash(seed, i * 13 + 5) * 90,
    });
  }
  return out;
}

export function createSeaField(getCanvas: () => HTMLCanvasElement | null, options: { reduced: boolean }) {
  let canvas = getCanvas();
  let ctx = canvas?.getContext("2d") ?? null;
  let w = 0, h = 0, cols = 0, rows = 0;
  let raf = 0, timer = 0, running = true, usedRaf = false;
  const reduced = !!options.reduced;
  const mouse = { x: -9999, y: -9999 };

  let gridPath: Path2D | null = null;
  let jump: Jump | null = null;
  let nextJumpAt = 1500;
  let splashes: Splash[] = [];

  function dotColor() {
    return getComputedStyle(document.documentElement).getPropertyValue("--color-dot").trim() || "#888";
  }
  function gridColor() {
    return getComputedStyle(document.documentElement).getPropertyValue("--color-border-subtle").trim() || "#333";
  }

  function buildGridPath() {
    const path = new Path2D();
    for (let col = 0; col <= cols; col++) { path.moveTo(col * CELL, 0); path.lineTo(col * CELL, rows * CELL); }
    for (let row = 0; row <= rows; row++) { path.moveTo(0, row * CELL); path.lineTo(cols * CELL, row * CELL); }
    return path;
  }

  function resize() {
    canvas = getCanvas();
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / CELL) + 1;
    rows = Math.ceil(h / CELL) + 1;
    gridPath = buildGridPath();
    if (reduced) render(0);
  }

  function surfaceRow() { return rows * SURFACE_FRAC; }

  function cloudValue(col: number, row: number, t: number): number {
    let coreHits = 0, puff = 0;
    for (let i = 0; i < 3; i++) {
      const bitmap = CLOUD_BITMAPS[i % CLOUD_BITMAPS.length];
      const bmH = bitmap.length;
      const scale = 1.5 * (0.6 + hash(i, 60) * 0.5);
      const spriteW = CLOUD_W * scale;
      const span = cols + spriteW * 2;
      const speed = 0.003 + hash(i, 9) * 0.0018;
      const baseX = hash(i, 1) * span;
      const originX = ((baseX + t * speed) % span) - spriteW;
      const originY = rows * (0.03 + hash(i, 2) * 0.14);
      const lcF = (col - originX) / scale, lrF = (row - originY) / scale;
      const lc = Math.floor(lcF), lr = Math.floor(lrF);
      if (lc < -1 || lc > CLOUD_W || lr < -1 || lr > bmH) continue;
      if (lc >= 0 && lc < CLOUD_W && lr >= 0 && lr < bmH && bitmap[lr][lc] === "1") { coreHits++; continue; }
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nc = lc + dx, nr = lr + dy;
        if (nc < 0 || nc >= CLOUD_W || nr < 0 || nr >= bmH) continue;
        if (bitmap[nr][nc] === "1" && hash(lc, lr, i * 97 + 31) > 0.82) puff = Math.max(puff, 0.5);
      }
    }
    if (coreHits >= 2) return 1;
    if (coreHits === 1) return 0.7;
    return puff;
  }

  // One gull, every 12-25s, gliding left-to-right at a random sky height — slow, with a
  // gentle rise-and-fall drift rather than a straight mechanical line, and a lazy
  // two-frame wing flap.
  function gullValue(col: number, row: number, t: number): number {
    const period = 18000;
    const cycle = Math.floor(t / period);
    const seed = hash(cycle, 90);
    if (seed > 0.55) return 0; // skip some cycles so it reads as occasional, not clockwork
    const speed = 0.006 + hash(cycle, 91) * 0.004;
    const startX = -10;
    const local = t % period;
    const headCol = startX + local * speed;
    const baseRow = rows * (0.08 + hash(cycle, 92) * 0.2);
    const glide = Math.sin(local * 0.0007 + hash(cycle, 93) * 10) * 2.2;
    const gRow = baseRow + glide;
    const frame = GULL_FRAMES[Math.floor(local / 550) % 2];
    for (const [dx, dy] of frame) {
      if (Math.round(headCol + dx) === col && Math.round(gRow + dy) === row) return 1;
    }
    return 0;
  }

  // Sampling position scrolls sideways over time (same trick as the cloud/rain drift
  // elsewhere) so the sparkle pattern itself visibly travels — a flowing current
  // rather than a static field of twinkling dots. A gentle wavy reference line (instead
  // of a flat cutoff) gives the surface some swell.
  function waterValue(col: number, row: number, t: number): number {
    const wave = Math.sin(col * 0.1 + t * 0.0009) * 1.4;
    const sRow = surfaceRow() + wave;
    if (row < sRow) return 0;
    const depth = Math.min(1, (row - sRow) / (rows - sRow));
    const flowCol = Math.floor(col - t * 0.0035);
    const hv = hash(flowCol, row, 5);
    const threshold = 0.88 - 0.1 * (1 - depth);
    if (hv <= threshold) return 0;
    return 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 0.0013 + hv * 40 + col * 0.04));
  }

  const WAVE_LINE_COUNT = 4;
  // Actual traveling ridge lines threaded through the sparkle field — each one a sine
  // curve rolling sideways at its own speed/depth, so the water reads as rolling swell
  // rather than uniform twinkle. Spread across the water's depth, shallow ones a touch
  // faster, like closer swell.
  function waveCrestValue(col: number, row: number, t: number): number {
    const sRow = surfaceRow();
    if (row < sRow + 1) return 0;
    let best = 0;
    for (let i = 0; i < WAVE_LINE_COUNT; i++) {
      const depthFrac = (i + 0.5) / WAVE_LINE_COUNT;
      const baseRow = sRow + 2 + depthFrac * (rows - sRow - 4);
      const amp = 2.2 + hash(i, 61) * 2.8;
      const freq = 0.07 + hash(i, 62) * 0.05;
      const speed = (0.0011 - depthFrac * 0.0006) * (hash(i, 63) > 0.5 ? 1 : -1);
      const phase = hash(i, 64) * 1000;
      const ridgeRow = baseRow + amp * Math.sin(col * freq + t * speed + phase);
      const d = Math.abs(row - ridgeRow);
      if (d < 0.9) best = Math.max(best, 1 - d / 0.9);
    }
    return best;
  }

  function maybeStartJump(t: number) {
    if (jump || t < nextJumpAt) return;
    const size = SIZES[Math.floor(hash(Math.floor(t / 1000), 200) * SIZES.length) % SIZES.length];
    const startCol = cols * (0.2 + hash(Math.floor(t / 1000), 201) * 0.6);
    jump = { startT: t, startCol, size, endSplashed: false };
    splashes.push({ col: startCol, row: surfaceRow(), startT: t, droplets: makeDroplets(Math.floor(t)) });
  }

  function updateJump(t: number) {
    if (!jump) return;
    const p = SIZE_PARAMS[jump.size];
    const s = (t - jump.startT) / p.duration;
    if (s >= 1) {
      splashes.push({ col: jump.startCol + p.drift, row: surfaceRow(), startT: t, droplets: makeDroplets(Math.floor(t) + 1) });
      jump = null;
      nextJumpAt = t + 15000 + hash(Math.floor(t / 777), 300) * 20000;
      return;
    }
    if (s >= 0.985 && !jump.endSplashed) {
      jump.endSplashed = true;
      splashes.push({ col: jump.startCol + p.drift * s, row: surfaceRow(), startT: t, droplets: makeDroplets(Math.floor(t) + 2) });
    }
  }

  function dolphinValue(col: number, row: number, t: number): number {
    if (!jump || row > surfaceRow() + 0.5) return 0;
    const p = SIZE_PARAMS[jump.size];
    const s = Math.min(1, Math.max(0, (t - jump.startT) / p.duration));
    const arc = 4 * s * (1 - s);
    const centerCol = jump.startCol + p.drift * s;
    const centerRow = surfaceRow() - arc * p.jumpRows;
    const shaped = dolphinShapeValue(col - centerCol, row - centerRow, p.scale);
    if (shaped <= 0) return 0;
    return shaped >= 1 ? 1 : (hash(col, row, 55) > 0.4 ? shaped : 0);
  }

  function renderSplashes(t: number) {
    splashes = splashes.filter(sp => t - sp.startT < 1100);
    ctx!.fillStyle = "#ffffff";
    for (const sp of splashes) {
      const elapsed = t - sp.startT;
      for (const dr of sp.droplets) {
        const local = elapsed - dr.delay;
        if (local < 0 || local > dr.life) continue;
        const s = local / dr.life;
        const row = sp.row + dr.dy * s + dr.grav * s * s;
        if (row > sp.row + 1.2) continue; // back under the surface — done
        const col = sp.col + dr.dx * s;
        const envelope = Math.min(smoothstep(s / 0.15), 1 - smoothstep((s - 0.75) / 0.25));
        if (envelope <= 0.03) continue;
        ctx!.globalAlpha = envelope;
        const cx = Math.round(col) * CELL, cy = Math.round(row) * CELL;
        ctx!.fillRect(cx + 2, cy + 2, CELL - 4, CELL - 4);
      }
    }
    ctx!.globalAlpha = 1;
  }

  function render(t: number) {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, w, h);

    if (gridPath) {
      ctx.strokeStyle = gridColor();
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.16;
      ctx.stroke(gridPath);
      ctx.globalAlpha = 1;
    }

    maybeStartJump(t);
    updateJump(t);

    const sRow = surfaceRow();
    const inset = 2.5;

    ctx.fillStyle = dotColor();
    for (let row = 0; row < sRow; row++) {
      for (let col = 0; col < cols; col++) {
        const v = Math.max(cloudValue(col, row, t), gullValue(col, row, t));
        if (v <= 0) continue;
        ctx.globalAlpha = v * 0.6;
        ctx.fillRect(col * CELL + inset / 2, row * CELL + inset / 2, CELL - inset, CELL - inset);
      }
    }

    ctx.fillStyle = "#5f8ba3";
    for (let row = Math.max(0, Math.floor(sRow) - 2); row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const v = waterValue(col, row, t);
        if (v <= 0) continue;
        ctx.globalAlpha = v * 0.5;
        ctx.fillRect(col * CELL + inset / 2, row * CELL + inset / 2, CELL - inset, CELL - inset);
      }
    }

    // Traveling ridge lines threaded on top — brighter, so the rolling swell reads
    // clearly against the ambient sparkle instead of blending into it.
    ctx.fillStyle = "#9dc3d8";
    for (let row = Math.max(0, Math.floor(sRow) - 2); row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const v = waveCrestValue(col, row, t);
        if (v <= 0) continue;
        ctx.globalAlpha = v * 0.55;
        ctx.fillRect(col * CELL + inset / 2, row * CELL + inset / 2, CELL - inset, CELL - inset);
      }
    }

    if (jump) {
      const p = SIZE_PARAMS[jump.size];
      const s = Math.min(1, Math.max(0, (t - jump.startT) / p.duration));
      const arc = 4 * s * (1 - s);
      const centerRow = sRow - arc * p.jumpRows;
      const reach = (BODY_R + 2.5) * p.scale;
      const minRow = Math.max(0, Math.floor(centerRow - reach));
      const maxRow = Math.min(rows, Math.ceil(sRow + 1));
      const minCol = Math.max(0, Math.floor(jump.startCol + p.drift * s - reach));
      const maxCol = Math.min(cols, Math.ceil(jump.startCol + p.drift * s + reach));
      ctx.fillStyle = dotColor();
      for (let row = minRow; row < maxRow; row++) {
        for (let col = minCol; col < maxCol; col++) {
          const v = dolphinValue(col, row, t);
          if (v <= 0) continue;
          ctx.globalAlpha = v;
          ctx.fillRect(col * CELL + inset / 2, row * CELL + inset / 2, CELL - inset, CELL - inset);
        }
      }
    }

    ctx.globalAlpha = 1;
    renderSplashes(t);
  }

  function frame(now: number) {
    if (!running) return;
    usedRaf = true;
    raf = requestAnimationFrame(frame);
    render(now);
  }

  resize();
  render(performance.now());
  if (!reduced) raf = requestAnimationFrame(frame);
  const fallback = setTimeout(() => {
    if (!reduced && !usedRaf && running) timer = window.setInterval(() => render(performance.now()), 50);
  }, 700);

  return {
    setEnv() {},
    setMouse(x: number, y: number) { mouse.x = x; mouse.y = y; },
    resize,
    stop() {
      running = false;
      cancelAnimationFrame(raf);
      clearInterval(timer);
      clearTimeout(fallback);
      ctx?.clearRect(0, 0, w, h);
    },
  };
}
