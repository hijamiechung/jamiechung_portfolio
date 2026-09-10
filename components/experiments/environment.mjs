// Adapted from the canonical prototype: static reduced motion, semantic colors, and explicit lifecycle cleanup.
// Ambient environment field: one dot system, several behaviors.
// integration: 'ground' | 'gutter' | 'horizon'
export function createEnvField(canvasOrGetter, cfg) {
  const c = cfg || {};
  const getCanvas = typeof canvasOrGetter === 'function' ? canvasOrGetter : () => canvasOrGetter;
  let canvas = getCanvas();
  const integration = c.integration || 'ground';
  const getRects = c.rects || (() => ({ cards: [] }));
  const reduced = !!c.reduced;

  const DENS = { clear: 1, clouds: 1.35, rain: 1.25, snow: 1.1, wind: 1.0, storm: 1.4, orbit: 1.15 };
  const PH_DENS = { morning: 0.85, day: 1, evening: 0.9, night: 0.6 };
  const PH_SPEED = { morning: 0.9, day: 1, evening: 0.85, night: 0.6 };
  const PH_ALPHA = { morning: 0.78, day: 0.86, evening: 0.82, night: 0.92 };
  const FLOW = { rain: 1, snow: 1, wind: 1, storm: 1 };

  let pts = [], w = 0, h = 0, raf = 0, t = 0, gustAt = 4000, gust = 0, running = true;
  function tone(name) { return getComputedStyle(document.documentElement).getPropertyValue('--color-light-' + name).trim().split(',').map(Number); }
  const LIGHT = {
    morning: { x: 0.08, y: 0.82, a: 0.050, c: tone('morning') },
    day:     { x: 0.50, y: -0.15, a: 0.045, c: tone('day') },
    evening: { x: 0.95, y: 0.70, a: 0.060, c: tone('evening') },
    night:   { x: 0.35, y: -0.05, a: 0.034, c: tone('night') }
  };
  const DIFFUSE = { clear: [1.00, 0.95], clouds: [0.62, 1.50], rain: [0.50, 1.70], snow: [0.72, 1.60], wind: [0.85, 1.15], storm: [0.80, 1.20], orbit: [1.00, 1.30] };
  let darkGround = false;
  let env = { code: 'clear', windDir: 270, windSpeed: 4, phase: 'day' };
  const mouse = { x: -9999, y: -9999 };

  function lum(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec((hex || '').trim());
    if (!m) return 1;
    return (parseInt(m[1], 16) * 0.299 + parseInt(m[2], 16) * 0.587 + parseInt(m[3], 16) * 0.114) / 255;
  }

  function lightModel() {
    const base = LIGHT[env.phase] || LIGHT.day;
    const [aMul, spread] = DIFFUSE[env.code] || DIFFUSE.clear;
    const orbit = env.code === 'orbit';
    const rot = orbit ? t * 0.000022 : 0;
    const sx = orbit ? w * (0.5 + Math.cos(rot) * 0.42) : w * base.x;
    const sy = orbit ? h * (0.32 + Math.sin(rot) * 0.38) : h * base.y;
    let a = base.a * aMul * (env.code === 'storm' ? 1 + gust * 0.5 : 1);
    if (orbit) a = 0.085;
    if (darkGround) a *= 1.7;
    return {
      sx, sy, R: Math.hypot(w, h) * 0.78 * spread, a,
      c: darkGround ? tone('dark') : base.c,
      c2: orbit ? (darkGround ? tone('orbit-dark') : tone('orbit')) : null
    };
  }

  function drawLight(ctx, L) {
    const g = ctx.createRadialGradient(L.sx, L.sy, 0, L.sx, L.sy, L.R);
    const c = L.c;
    g.addColorStop(0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + L.a.toFixed(4) + ')');
    g.addColorStop(0.45, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (L.a * 0.42).toFixed(4) + ')');
    g.addColorStop(1, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    if (L.c2) {
      const ox = w - L.sx, oy = h - L.sy, d = L.c2;
      const g2 = ctx.createRadialGradient(ox, oy, 0, ox, oy, L.R * 0.85);
      g2.addColorStop(0, 'rgba(' + d[0] + ',' + d[1] + ',' + d[2] + ',' + (L.a * 0.8).toFixed(4) + ')');
      g2.addColorStop(1, 'rgba(' + d[0] + ',' + d[1] + ',' + d[2] + ',0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);
    }
  }

  function lightAt(L, x, y) {
    const d = Math.hypot(x - L.sx, y - L.sy) / L.R;
    let v = Math.pow(Math.max(0, 1 - d), 1.4);
    if (L.c2) {
      const d2 = Math.hypot(x - (w - L.sx), y - (h - L.sy)) / (L.R * 0.85);
      v = Math.max(v, Math.pow(Math.max(0, 1 - d2), 1.4) * 0.85);
    }
    return v;
  }

  function seed() {
    canvas = getCanvas();
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    darkGround = lum(getComputedStyle(document.documentElement).getPropertyValue('--color-surface-app')) < 0.5;
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    const base = (w * h) / 15000;
    const mult = (DENS[env.code] || 1) * (PH_DENS[env.phase] || 1) * (integration === 'gutter' ? 1.6 : 1) * (c.thinning === false ? 1 : 1.55) * (c.density || 1);
    const n = Math.round(base * mult);
    const keep = pts.slice(0, n);
    while (keep.length < n) {
      const x = Math.random() * w, y = Math.random() * h;
      keep.push({ hx: x, hy: y, x, y, ox: 0, oy: 0, vx: 0, vy: 0, s: Math.random() });
    }
    pts = keep;
  }

  function nearRect(r, x, y) { // distance outside rect (0 if inside)
    const dx = Math.max(r.left - x, 0, x - r.right);
    const dy = Math.max(r.top - y, 0, y - r.bottom);
    return Math.hypot(dx, dy);
  }

  function pushOut(r, x, y, pad) {
    const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2;
    const nx = x - cx, ny = y - cy;
    const ex = r.width / 2 + pad, ey = r.height / 2 + pad;
    const sx = ex ? Math.abs(nx) / ex : 0, sy = ey ? Math.abs(ny) / ey : 0;
    if (sx > sy) return { x: nx >= 0 ? 1 : -1, y: 0, depth: 1 - sx };
    return { x: 0, y: ny >= 0 ? 1 : -1, depth: 1 - sy };
  }

  function verticalProfile(y) {
    const k = h ? y / h : 0;
    if (env.phase === 'night') return 0.95 - 0.6 * k;
    if (env.phase === 'evening') return 0.55 + 0.4 * Math.abs(k - 0.35);
    return 0.32 + 0.68 * Math.pow(k, 1.4);
  }

  let usedRaf = false, timer = 0;

  function frame(now) {
    if (!running) return;
    usedRaf = true;
    raf = requestAnimationFrame(frame);
    render(now || 0);
  }

  function render(now) {
    if (!running) return;
    const live = getCanvas();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (!live) return;
    if (live !== canvas || live.width !== Math.round(window.innerWidth * dpr) || live.height !== Math.round(window.innerHeight * dpr)) {
      canvas = live;
      seed();
      if (!canvas || !canvas.width) return;
    }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    t = now || 0;

    const rects = getRects() || {};
    const cards = rects.cards || [];
    const sp = reduced ? 0 : (PH_SPEED[env.phase] || 1);
    const code = env.code;
    const rad = (env.windDir || 0) * Math.PI / 180;
    const wx = Math.sin(rad) * -1, wy = Math.cos(rad); // meteorological dir -> vector
    const wMag = Math.min(1.4, 0.08 + (env.windSpeed || 0) * 0.022);

    if (code === 'storm' && !reduced) {
      if (t > gustAt) { gust = 1; gustAt = t + 6500 + Math.random() * 5500; }
      gust *= 0.972;
    } else gust = 0;

    const L = lightModel();
    drawLight(ctx, L);
    const col = (getComputedStyle(document.documentElement).getPropertyValue('--color-dot')).trim();
    ctx.fillStyle = col;
    const alphaBase = 0.85 * (PH_ALPHA[env.phase] || 0.85);
    const r0 = code === 'snow' ? 1.35 : code === 'rain' ? 1.0 : 1.15;

    // cursor influence per card (cards only displace when the cursor is near them)
    const cardPull = cards.map(r => {
      const d = nearRect(r, mouse.x, mouse.y);
      return Math.max(0, 1 - d / 180);
    });

    for (const p of pts) {
      // --- position: flowing weather vs settled weather vs orbit
      if (FLOW[code] && !reduced) {
        if (code === 'rain') { p.x += wx * wMag * 0.5 * sp; p.y += 0.5 * sp; }
        else if (code === 'snow') { p.x += (Math.sin(t * 0.0009 + p.s * 7) * 0.16 + wx * wMag * 0.12) * sp; p.y += 0.17 * sp; }
        else if (code === 'wind') { p.x += wx * wMag * 0.9 * sp; p.y += wy * wMag * 0.35 * sp; }
        else { const g = 0.18 + gust * 1.1; p.x += wx * wMag * g * sp; p.y += wy * wMag * g * 0.4 * sp; }
        if (p.x < -4) p.x = w + 4; if (p.x > w + 4) p.x = -4;
        if (p.y < -4) p.y = h + 4; if (p.y > h + 4) p.y = -4;
      } else if (code === 'orbit' && !reduced) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
        if (d < 340 && d > 2) {
          const a = 9 / (d + 60);
          p.vx += (dx / d) * a * 0.5 - (dy / d) * a * 1.15;
          p.vy += (dy / d) * a * 0.5 + (dx / d) * a * 1.15;
        }
        p.vx += (p.hx - p.x) * 0.0009; p.vy += (p.hy - p.y) * 0.0009;
        p.vx *= 0.982; p.vy *= 0.982;
        p.x += p.vx; p.y += p.vy;
      } else if (!reduced) {
        const amp = code === 'clouds' ? 4 : 7;
        const slow = code === 'clouds' ? 0.00016 : 0.00026;
        p.x += ((p.hx + Math.sin(t * slow + p.s * 8) * amp) - p.x) * 0.02 * sp;
        p.y += ((p.hy + Math.cos(t * slow * 0.8 + p.s * 6) * amp * 0.6) - p.y) * 0.02 * sp;
      }

      // --- interaction offsets: cursor attraction (settled weather) + card displacement
      let tx = 0, ty = 0;
      if (!reduced && code !== 'orbit') {
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
        if (d < 96 && d > 0.01) {
          const f = Math.pow(1 - d / 96, 2) * (FLOW[code] ? 9 : 16);
          tx += (dx / d) * Math.min(f, d * 0.8);
          ty += (dy / d) * Math.min(f, d * 0.8);
        }
      }
      for (let i = 0; i < cards.length; i++) {
        const r = cards[i];
        if (reduced || !cardPull[i]) continue;
        const pad = 46;
        const d = nearRect(r, p.x, p.y);
        if (d < pad) {
          const n = pushOut(r, p.x, p.y, pad);
          const strength = (1 - d / pad) * 13 * cardPull[i];
          tx += n.x * strength; ty += n.y * strength;
        }
      }
      p.ox += (tx - p.ox) * 0.09;
      p.oy += (ty - p.oy) * 0.09;

      const x = p.x + p.ox, y = p.y + p.oy;

      // --- visibility per integration mode
      const lv = lightAt(L, x, y);
      let a = alphaBase * (0.5 + 0.85 * lv);
      let rr = r0 * (0.86 + 0.26 * lv);
      if (c.thinning !== false && p.s > 0.28 + 0.78 * lv) continue;
      if (integration === 'gutter') {
        let vis = 1;
        for (const r of cards) {
          const d = nearRect(r, x, y);
          if (d < 52) vis = Math.min(vis, d / 52);
        }
        a *= vis;
      } else if (integration === 'horizon') {
        a *= verticalProfile(y);
      }
      if (a <= 0.012) continue;
      ctx.globalAlpha = Math.min(0.95, a);
      ctx.beginPath();
      ctx.arc(x, y, rr, 0, 6.2832);
      ctx.fill();
    }
  }

  seed();
  render(0);
  if (!reduced) raf = requestAnimationFrame(frame);
  const fallback = setTimeout(() => {
    if (!reduced && !usedRaf && running) timer = setInterval(() => render(performance.now()), 33);
  }, 700);

  return {
    setEnv(next) {
      const prev = env;
      env = Object.assign({}, env, next || {});
      if (env.code !== prev.code || env.phase !== prev.phase) seed();
      if (reduced) render(0);
    },
    setMouse(x, y) { mouse.x = x; mouse.y = y; },
    resize() { seed(); if (reduced) render(0); },
    stop() { running = false; cancelAnimationFrame(raf); clearInterval(timer); clearTimeout(fallback); }
  };
}

const CODE_MAP = [
  [[0], 'clear', 'CLEAR'], [[1], 'clear', 'MOSTLY CLEAR'], [[2], 'clouds', 'PARTLY CLOUDY'],
  [[3], 'clouds', 'OVERCAST'], [[45, 48], 'clouds', 'FOG'],
  [[51, 53, 55, 56, 57], 'rain', 'DRIZZLE'], [[61, 63, 65, 66, 67], 'rain', 'RAIN'],
  [[80, 81, 82], 'rain', 'SHOWERS'], [[71, 73, 75, 77, 85, 86], 'snow', 'SNOW'],
  [[95, 96, 99], 'storm', 'STORM']
];

export function mapWeather(wmo, windSpeed) {
  let hit = ['clouds', 'CLOUDY'];
  for (const [codes, kind, label] of CODE_MAP) if (codes.indexOf(wmo) !== -1) { hit = [kind, label]; break; }
  if (windSpeed >= 20 && (hit[0] === 'clear' || hit[0] === 'clouds')) return ['wind', 'WINDY'];
  return hit;
}

export function phaseFor(hour) {
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export async function fetchEnv(lat, lon, tz, signal) {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
    '&current=weather_code,wind_speed_10m,wind_direction_10m' +
    '&daily=sunrise,sunset&forecast_days=2&wind_speed_unit=mph&timezone=' + encodeURIComponent(tz || 'auto');
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('weather ' + res.status);
  const j = await res.json();
  const cur = j.current || {};
  if (!Number.isFinite(cur.weather_code)) throw new Error('Invalid weather');
  const [code, cond] = mapWeather(cur.weather_code, cur.wind_speed_10m || 0);
  return {
    code, cond,
    weatherCode: cur.weather_code,
    solarDays: (j.daily?.time || []).map((date, i) => ({ date, sunrise: j.daily.sunrise?.[i], sunset: j.daily.sunset?.[i] })),
    windDir: cur.wind_direction_10m || 0,
    windSpeed: cur.wind_speed_10m || 0,
    tz: j.timezone || tz
  };
}

export function clockFor(tz) {
  try {
    const f = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz });
    const h = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: tz });
    return { label: f.format(new Date()).toUpperCase(), hour: parseInt(h.format(new Date()), 10) };
  } catch {
    const d = new Date();
    return { label: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toUpperCase(), hour: d.getHours() };
  }
}
