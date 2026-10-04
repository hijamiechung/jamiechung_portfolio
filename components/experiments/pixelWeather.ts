import type { Environment, FieldFactory } from "./PrototypeExperience";

// A crisp, blocky pixel-grid rendering of the same live weather/time-of-day data the
// atmosphere field uses — no gradients, no smoothing, no blur. Each cell is either on
// or off, drawn as a hard-edged square. Deterministic per-cell hash instead of a
// noise library keeps the pattern reproducible across frames without needing to store
// per-cell state. Clouds and clear/sun are literal hand-drawn sprite bitmaps (Mario /
// Pokémon Red style icons) rather than procedural texture — the goal is "recognizable
// game-sprite weather icon," not ambient noise.

const CELL = 9; // px, before device-pixel-ratio scaling

const PHASE_DENSITY: Record<string, number> = { morning: 0.85, day: 1, evening: 0.92, night: 0.62 };
const PHASE_ALPHA: Record<string, number> = { morning: 0.4, day: 0.45, evening: 0.42, night: 0.55 };
const CODE_ALPHA: Record<string, number> = { clear: 1.3, clouds: 0.85, rain: 0.55, snow: 0.55, wind: 0.5, orbit: 0.5 };

// Muted, desaturated per-condition tints — a hint of color, not saturated weather-app
// primaries. The base grid stays neutral grey; only the active weather cells carry it,
// so color reads as "this is the live data" rather than a palette change to the UI.
// Clear is the one exception: it's meant to read as actual sunlight, so it's pushed all
// the way to pure white rather than a muted tint.
const CODE_TINT: Record<string, string> = {
  clear: "#ffffff",
  clouds: "#9aa4b0",
  rain: "#a9c2d6",
  snow: "#c9dce6",
  wind: "#9bb3a0",
};

// Brief rainbow after rain clears — same muted-pastel logic as everything else here
// (a hint of color, not saturated primaries), triggered once on the rain -> other
// transition and left to fade on its own; it doesn't loop or re-trigger while dry.
const RAINBOW_COLORS = ["#d98a8a", "#d9a880", "#d9c980", "#9bc98a", "#8ab0c9", "#8a8ac9", "#b08ac9"];
const RAINBOW_DURATION = 9000;
const RAINBOW_FADE_IN = 900;
const RAINBOW_FADE_OUT = 2600;
const RAINBOW_PEAK_ALPHA = 0.5;

// A horizontal band, not a radial spot: full strength for the top `inner` fraction of
// the viewport height (across the *entire* width), fading to zero by `outer` — weather
// happens up in the sky and fades out toward the ground, the same amount at every x
// position. (Not anchored to a corner — that was the earlier, wrong reading of "only
// visible in about a third of the screen.")
const CODE_VERTICAL_REACH: Record<string, { inner: number; outer: number }> = {
  clouds: { inner: 0.32, outer: 0.68 },
  rain: { inner: 0.3, outer: 0.6 },
  snow: { inner: 0.3, outer: 0.62 },
  wind: { inner: 0.3, outer: 0.65 },
  orbit: { inner: 0.4, outer: 0.85 },
};

// Two cloud sprite variants — a single rounded dome (no gap in the silhouette), not
// two separate sharp peaks with a valley between them. Different bump layouts so
// instances don't read as identical copies. 1 = filled.
const CLOUD_BITMAPS = [
  [
    "0001111100000",
    "0011111111000",
    "0111111111110",
    "1111111111111",
    "1111111111111",
    "1111111111111",
    "0111111111110",
  ],
  [
    "0000111110000",
    "0001111111100",
    "0111111111110",
    "1111111111111",
    "1111111111111",
    "0111111111110",
    "0011111111100",
  ],
];
const CLOUD_W = CLOUD_BITMAPS[0][0].length;
const CLOUD_SCALE = 1.6; // grid cells per sprite pixel — finer than the dome silhouette's
// own bumps, so the sprite reads as a cluster of small clumped pixels (cumulus texture)
// rather than a handful of oversized blocky squares.

function hash(x: number, y: number, seed = 7) {
  let n = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(seed, 1274126177);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function smoothstep(t: number) {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

export const createPixelField: FieldFactory = (getCanvas, options) => {
  let canvas = getCanvas();
  let ctx = canvas?.getContext("2d") ?? null;
  let w = 0, h = 0, cols = 0, rows = 0;
  let env: Environment = { label: "", cond: "—", code: "clear", phase: "day", windDir: 270, windSpeed: 0 };
  const mouse = { x: -9999, y: -9999 };
  let raf = 0, timer = 0, running = true, usedRaf = false;
  const reduced = !!options.reduced;

  let gridPath: Path2D | null = null;
  let rainbowStart = -Infinity;

  function color() {
    return getComputedStyle(document.documentElement).getPropertyValue("--color-dot").trim() || "#888";
  }

  function gridColor() {
    return getComputedStyle(document.documentElement).getPropertyValue("--color-border-subtle").trim() || "#333";
  }

  function buildGridPath() {
    const path = new Path2D();
    for (let col = 0; col <= cols; col++) {
      const x = col * CELL;
      path.moveTo(x, 0);
      path.lineTo(x, rows * CELL);
    }
    for (let row = 0; row <= rows; row++) {
      const y = row * CELL;
      path.moveTo(0, y);
      path.lineTo(cols * CELL, y);
    }
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

  // Three drifting cloud sprites, each its own variant/size/silhouette — not repeats
  // of the same shape at different spots. Cells just outside each sprite's own bitmap
  // get a small, per-instance-seeded chance to puff outward too, for a softer edge.
  // Where two sprites' cores overlap, the result is visibly denser (1.0) than a single
  // layer (0.72) — overlap should look like more cloud, not just "still one cloud."
  function cloudSpriteValue(col: number, row: number, t: number): number {
    let coreHits = 0;
    let puff = 0;
    for (let i = 0; i < 3; i++) {
      const bitmap = CLOUD_BITMAPS[i % CLOUD_BITMAPS.length];
      const bmH = bitmap.length;
      const scale = CLOUD_SCALE * (0.6 + hash(i, 60) * 0.55); // per-instance size variance, narrow enough that no instance balloons past a readable cumulus size
      const spriteW = CLOUD_W * scale;
      const span = cols + spriteW * 2;
      // Slow drift, like real clouds — fast enough that a full cycle takes under two
      // minutes (at the old, much slower speed it took several minutes, so with only a
      // couple of instances there was a real chance none were ever on-screen).
      const speed = 0.0035 + hash(i, 9) * 0.002;
      const baseX = hash(i, 1) * span;
      const originX = ((baseX + t * speed) % span) - spriteW;
      const originY = rows * (0.03 + hash(i, 2) * 0.2);
      const lcF = (col - originX) / scale, lrF = (row - originY) / scale;
      const lc = Math.floor(lcF), lr = Math.floor(lrF);
      if (lc < -1 || lc > CLOUD_W || lr < -1 || lr > bmH) continue;
      if (lc >= 0 && lc < CLOUD_W && lr >= 0 && lr < bmH && bitmap[lr][lc] === "1") { coreHits++; continue; }
      // Puff zone: just outside the bitmap, next to a filled cell — a light, rare
      // dusting rather than the dominant effect.
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nc = lc + dx, nr = lr + dy;
          if (nc < 0 || nc >= CLOUD_W || nr < 0 || nr >= bmH) continue;
          if (bitmap[nr][nc] === "1" && hash(lc, lr, i * 97 + 31) > 0.82) puff = Math.max(puff, 0.55);
        }
      }
    }
    if (coreHits >= 2) return 1;
    if (coreHits === 1) return 0.72;
    return puff;
  }

  // Diagonal sunbeams fanning out from an off-canvas source (top-right) toward the
  // lower-left — straight rays only, no disc at the source, so the source itself
  // is never visible and the beams read as light sweeping in from off-screen. The
  // whole fan turns at a pace you can actually see, and each ray's brightness drifts
  // independently, like light through a window shifting as clouds/time pass — never a
  // perfectly still frame. `anchorCol/Row` are grid coordinates of the (off-canvas)
  // light source.
  const SUN_RAY_COUNT = 7;
  const SUN_RAY_BASE_ANGLE = Math.PI * 0.78; // down-and-left
  const SUN_RAY_SPREAD = Math.PI * 0.4;
  const SUN_RAY_LENGTH = 75;
  function sunRayValue(col: number, row: number, anchorCol: number, anchorRow: number, t: number): number {
    const dx = col - anchorCol, dy = row - anchorRow;
    const dist = Math.hypot(dx, dy);
    if (dist > SUN_RAY_LENGTH) return 0;
    const angle = Math.atan2(dy, dx);
    const turn = Math.sin(t * 0.00018) * 0.16;
    for (let r = 0; r < SUN_RAY_COUNT; r++) {
      const rt = r / (SUN_RAY_COUNT - 1);
      const rayAngle = SUN_RAY_BASE_ANGLE - SUN_RAY_SPREAD / 2 + SUN_RAY_SPREAD * rt + turn + (hash(r, 71) - 0.5) * 0.05;
      let diff = Math.abs(angle - rayAngle);
      if (diff > Math.PI) diff = Math.PI * 2 - diff;
      const width = 0.045 + hash(r, 72) * 0.03;
      if (diff < width) {
        const shimmer = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 0.0007 + r * 1.8));
        return Math.max(0, 1 - dist / SUN_RAY_LENGTH) * shimmer;
      }
    }
    return 0;
  }

  // Returns 0..1: how "lit" a cell is at this moment. `near` is 0..1, how close this
  // cell is to the effect's anchor point — used to place the fixed sun icon.
  function cellValue(code: string, col: number, row: number, t: number, density: number, near: number, anchorCol: number, anchorRow: number): number {
    if (code === "clouds") {
      return cloudSpriteValue(col, row, t);
    }
    if (code === "rain") {
      // A single falling pixel doesn't read as a raindrop — 1-3 cells stacked
      // vertically does. Each column's drop is a solid stack (no fade within it) of a
      // randomized height, falling as one unit. Speed/height/timing are randomized
      // per-column and desynced from each other so columns don't move in lockstep.
      const colSeed = hash(col, 0, 11);
      const cyclePeriod = 2600 + colSeed * 3200;
      const cyclePhaseShift = hash(col, 1, 12) * 9000;
      const cycle = Math.floor((t + cyclePhaseShift) / cyclePeriod);
      if (hash(col, cycle, 3) > 0.4) return 0;
      const speed = 0.014 + hash(col, cycle, 13) * 0.01;
      const period = 9 + hash(col, cycle, 14) * 6;
      const stack = 1 + Math.floor(hash(col, cycle, 16) * 3); // 1, 2, or 3 cells tall
      const offset = hash(col, cycle + 1, 5) * period;
      const distance = ((t * speed + offset - row) % period + period) % period;
      return distance < stack ? 1 : 0;
    }
    if (code === "snow") {
      const colSeed = hash(col, 0, 11);
      const cyclePeriod = 3400 + colSeed * 4000;
      const cyclePhaseShift = hash(col, 1, 12) * 9000;
      const cycle = Math.floor((t + cyclePhaseShift) / cyclePeriod);
      if (hash(col, cycle, 3) > 0.45) return 0;
      const speed = 0.003 + hash(col, cycle, 13) * 0.006;
      const sway = Math.sin(t * (0.0008 + colSeed * 0.0008) + col) * 0.6;
      const period = 7 + hash(col, cycle, 14) * 5;
      const trail = 1 + hash(col, cycle, 15) * 1.2;
      const offset = hash(col, cycle + 1, 5) * period;
      const distance = ((t * speed + offset + sway * 0.1 - row) % period + period) % period;
      return distance < trail ? 1 - distance / trail : 0;
    }
    if (code === "wind") {
      // Flowing wavy gusts rather than straight lines pinned to one row — each gust's
      // vertical center undulates (sine of horizontal position + time) as it travels
      // right, with a short trailing tail, so it reads as a fluttering swoosh instead
      // of a mechanical horizontal scan.
      let best = 0;
      for (let i = 0; i < 6; i++) {
        const span = cols * 1.6;
        const speed = 0.018 + hash(i, 40) * 0.022;
        const baseX = hash(i, 41) * span;
        const headCol = ((baseX + t * speed) % span) - span * 0.15;
        const behind = headCol - col;
        const trail = 9 + hash(i, 45) * 9;
        if (behind < 0 || behind > trail) continue;
        const baseRow = rows * (0.04 + hash(i, 42) * 0.7);
        const amp = 1.6 + hash(i, 43) * 2.4;
        const freq = 0.12 + hash(i, 44) * 0.13;
        const wobble = Math.sin(col * freq + t * 0.0022 + i * 3) * amp;
        const centerRow = baseRow + wobble;
        const distRow = Math.abs(row - centerRow);
        if (distRow < 1.2) {
          const v = (1 - behind / trail) * (1 - distRow / 1.2);
          best = Math.max(best, v);
        }
      }
      return best;
    }
    if (code === "clear") {
      return sunRayValue(col, row, anchorCol, anchorRow, t);
    }
    // orbit fallback: sparse static-position dust that twinkles in place.
    const hv = hash(col, row, 3);
    const threshold = 0.985 - (1 - density) * 0.055 - near * 0.09;
    if (hv > threshold) return 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.0028 + hv * 60));
    return 0;
  }

  // A circular arc centered well below the canvas — screen cells above it fall into
  // 7 concentric rings (red outermost/highest to violet innermost, closest to the
  // horizon), same as a real rainbow's geometry. Cells are still hard-edged squares;
  // only their alpha varies, so this stays consistent with the rest of the grid.
  function renderRainbow(t: number) {
    const elapsed = t - rainbowStart;
    if (elapsed < 0 || elapsed > RAINBOW_DURATION) return;
    const envelope = Math.min(smoothstep(elapsed / RAINBOW_FADE_IN), smoothstep((RAINBOW_DURATION - elapsed) / RAINBOW_FADE_OUT));
    if (envelope <= 0.01) return;
    // A much larger radius than the visible grid keeps the curve shallow (a real
    // rainbow's arc is gentle, not a tight dome) — only a thin sliver of the circle,
    // high up, ever intersects the screen. A vertical fade (same "sky band" idea as
    // the other conditions) keeps it confined near the top instead of sweeping down
    // toward the ground.
    const cx = cols / 2, cy = rows * 2;
    const thickness = Math.max(1.2, rows * 0.016);
    const baseRadius = cy - rows * 0.13;
    const innerY = h * 0.22, outerY = h * 0.5;
    for (let row = 0; row < rows; row++) {
      const cyPix = row * CELL;
      const vFalloff = 1 - smoothstep((cyPix - innerY) / (outerY - innerY));
      if (vFalloff <= 0.015) continue;
      for (let col = 0; col < cols; col++) {
        const dx = col - cx, dy = row - cy;
        const dist = Math.hypot(dx, dy);
        for (let i = 0; i < RAINBOW_COLORS.length; i++) {
          const bandRadius = baseRadius - i * thickness;
          const d = Math.abs(dist - bandRadius);
          if (d >= thickness * 0.5) continue;
          const intensity = 1 - d / (thickness * 0.5);
          const a = intensity * envelope * vFalloff * RAINBOW_PEAK_ALPHA;
          if (a <= 0.02) break;
          ctx!.globalAlpha = a;
          ctx!.fillStyle = RAINBOW_COLORS[i];
          ctx!.fillRect(col * CELL + 1.25, row * CELL + 1.25, CELL - 2.5, CELL - 2.5);
          break;
        }
      }
    }
    ctx!.globalAlpha = 1;
  }

  function render(t: number) {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, w, h);
    const code = env.code || "clear";
    const phase = env.phase || "day";
    const phaseAlpha = PHASE_ALPHA[phase] ?? 0.6;
    const phaseDensity = PHASE_DENSITY[phase] ?? 1;
    const codeAlpha = CODE_ALPHA[code] ?? 0.8;
    const reach = CODE_VERTICAL_REACH[code] ?? CODE_VERTICAL_REACH.orbit;

    if (gridPath) {
      ctx.strokeStyle = gridColor();
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.16;
      ctx.stroke(gridPath);
      ctx.globalAlpha = 1;
    }

    // The sun's rays fan from a fixed corner (their own radial fade, below); every
    // other condition fades vertically — full strength for the top `inner` fraction of
    // the height, across the whole width, tapering out by `outer`. Weather happens up
    // in the sky and fades toward the ground, not concentrated into one corner.
    // Pushed just past the top-right corner, off-canvas — the source itself never
    // renders a cell, only the rays fanning out from it do, so what's visible is
    // beams sweeping in from off-screen rather than a fixed bright dot anchoring them.
    const anchorX = w + CELL * 5, anchorY = -CELL * 5;
    const anchorCol = anchorX / CELL, anchorRow = anchorY / CELL;
    const innerY = h * reach.inner, outerY = h * reach.outer;

    ctx.fillStyle = CODE_TINT[code] ?? color();
    const inset = 2.5; // gutter between cells — enough that active cells read as
    // distinct pixels even when several sit next to each other, instead of merging
    // into a solid blob.
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cx = col * CELL, cy = row * CELL;
        const falloff = code === "clear" ? 1 : 1 - smoothstep((cy - innerY) / (outerY - innerY));
        if (falloff <= 0.015) continue;
        const v = cellValue(code, col, row, t, phaseDensity, 0, anchorCol, anchorRow);
        if (v <= 0) continue;
        const dx = mouse.x - (cx + CELL / 2), dy = mouse.y - (cy + CELL / 2);
        const md = Math.hypot(dx, dy);
        const mouseBoost = md < 140 ? (1 - md / 140) * 0.35 : 0;
        const a = Math.min(1, (v * phaseAlpha * codeAlpha * falloff) + mouseBoost * falloff);
        if (a <= 0.02) continue;
        ctx.globalAlpha = a;
        ctx.fillRect(cx + inset / 2, cy + inset / 2, CELL - inset, CELL - inset);
      }
    }
    ctx.globalAlpha = 1;
    renderRainbow(t);
  }

  function frame(now: number) {
    if (!running) return;
    usedRaf = true;
    raf = requestAnimationFrame(frame);
    render(now);
  }

  resize();
  render(0);
  if (!reduced) raf = requestAnimationFrame(frame);
  const fallback = setTimeout(() => {
    if (!reduced && !usedRaf && running) timer = window.setInterval(() => render(performance.now()), 50);
  }, 700);

  return {
    setEnv(next) {
      // Snow counts as still-precipitating for this check too — clearing into snow
      // shouldn't cue a rainbow, only clearing into something dry (clouds/clear/wind).
      const wasRaining = env.code === "rain";
      const prevCode = env.code;
      env = { ...env, ...next };
      const stillWet = env.code === "rain" || env.code === "snow";
      if (wasRaining && !stillWet && env.code !== prevCode) rainbowStart = performance.now();
      if (reduced) render(0);
    },
    setMouse(x, y) { mouse.x = x; mouse.y = y; },
    resize,
    stop() {
      running = false;
      cancelAnimationFrame(raf);
      clearInterval(timer);
      clearTimeout(fallback);
      ctx?.clearRect(0, 0, w, h);
    },
  };
};
