export const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));
export const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
export const mix = (a, b, t) => a + (b - a) * t;
export function hash(x, y, seed = 0) {
  let n = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(seed, 1274126177);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}
export function noise(x, y, seed = 0) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = smooth(x - ix), fy = smooth(y - iy);
  return mix(mix(hash(ix, iy, seed), hash(ix + 1, iy, seed), fx), mix(hash(ix, iy + 1, seed), hash(ix + 1, iy + 1, seed), fx), fy);
}
export function windVector(speed, direction) {
  const magnitude = 6 + clamp(Number.isFinite(speed) ? speed : 0, 0, 60) * .32;
  const angle = (Number.isFinite(direction) ? direction : 270) * Math.PI / 180;
  return { x: -Math.sin(angle) * magnitude, y: Math.cos(angle) * magnitude };
}

export function illumination(u, v, seconds, time) {
  // A broad, open band of illumination crosses the viewport. Its position changes even at zero density.
  const t = seconds * mix(1, .20, time.night);
  const center = .45 + Math.sin(t * .065) * .26 + Math.sin(t * .023 + .7) * .12;
  const axis = u + v * mix(.38, .10, time.lateral);
  const aperture = .13 + v * .18;
  const beam = Math.exp(-Math.pow((axis - center) / aperture, 2));
  const spill = Math.exp(-Math.pow((axis - center + .27) / (.065 + v * .11), 2)) * .38;
  const band = mix(clamp(beam + spill), Math.exp(-Math.pow((axis - center) / .68, 2)), Math.max(time.lateral, time.night));
  const sideLight = smooth(time.side >= 0 ? 1 - u * .85 : .15 + u * .85);
  return clamp(mix(.045 + band * .955, sideLight * (.6 + band * .4), time.lateral * .7));
}

const cloudBodies = [
  { u: .30, v: .16, scale: 1.32, crown: 1.1 },
  { u: .79, v: .11, scale: .94, crown: .95 },
  { u: 1.17, v: .19, scale: 1.14, crown: 1.25 },
];
const cloudLobes = [[-.70, .14, .40, .49], [-.31, -.12, .49, .66], [.17, -.27, .50, .77], [.62, .07, .44, .54], [-.10, .28, .57, .48]];
const wrap = (value, span) => ((value + span / 2) % span + span) % span - span / 2;

export function cloudLayers(x, y, height, flowX, flowY, seed, width = 1440) {
  // Finite overlapping lobes form separate bodies. Wrapping happens beyond the viewport,
  // so clouds travel through the window instead of joining into a full-width wave.
  let mass = 0, rim = 0, shade = 0;
  for (const body of cloudBodies) {
    const sx = Math.min(width * .145, 220) * body.scale, sy = Math.min(height * .145, 135) * body.scale;
    const dx = wrap(x - flowX - body.u * width, width + 900);
    const dy = y - body.v * height - Math.sin(flowY / 300) * 12;
    if (Math.abs(dx) > sx * 1.5 || Math.abs(dy) > sy * 1.65) continue;
    const nx = dx / sx, ny = dy / sy;
    let distance = 10, pillowShade = 0, pillowWeight = 0;
    for (const [cx, cy, rx, ry] of cloudLobes) {
      const d = Math.hypot((nx - cx) / rx, (ny - cy) / (ry * body.crown)) - 1;
      const h = Math.max(.24 - Math.abs(distance - d), 0) / .24;
      distance = Math.min(distance, d) - h * h * .06;
      const weight = Math.exp(-(Math.max(0, d + 1) ** 2) * 2);
      pillowShade += weight * smooth(((ny - cy) / (ry * body.crown) + .35) / 1.4);
      pillowWeight += weight;
    }
    const texture = noise(dx / 75, dy / 65, seed + 19);
    // Broad feathering varies within each body, like pigment diffusing through a pane.
    const edge = distance + (texture - .5) * .09;
    const softness = .56 + noise(dx / 180, dy / 140, seed + 23) * .24;
    const coverage = (1 - smooth((edge + .32) / softness)) * (1 - smooth((y / height - .39) / .16));
    const thickness = coverage * (.82 + texture * .18);
    mass = 1 - (1 - mass) * (1 - thickness);
    rim = Math.max(rim, coverage * (1 - smooth((-edge - .04) / .40)) * (.65 - ny * .28));
    shade = Math.max(shade, coverage * (.35 * smooth((ny + .15) / .85) + .65 * pillowShade / Math.max(.001, pillowWeight)));
  }
  return { mass: clamp(mass), rim: clamp(rim), shade: clamp(shade) };
}

export function starVisibility(night, density, seconds, seed) {
  const pulse = Math.pow(.5 + .5 * Math.sin(seconds * (.48 + hash(seed, 4) * .23) + seed * 2.39), 7);
  return night * Math.pow(1 - clamp(density), 2) * (.20 + pulse * .80);
}

export function rainDrop(index, seconds, width, height, windX, seed) {
  const speed = 160 + hash(index, 51, seed) * 130;
  const travel = seconds * speed;
  const y = ((hash(index, 52, seed) * (height + 100) + travel) % (height + 100)) - 50;
  const slant = .12 + clamp(windX, -50, 50) * .005;
  const x = ((hash(index, 53, seed) * (width + 400) + travel * slant) % (width + 400) + width + 400) % (width + 400) - 200;
  return { x, y, slant, length: 8 + hash(index, 54, seed) * 12, alpha: (.12 + hash(index, 55, seed) * .14) * rainVisibility(y / height) };
}

export function rainVisibility(v) { return 1 - smooth((v - .08) / .40); }

export function sampleLightField(u, v, width, height, flowX, flowY, seconds, weather, time, seed) {
  const x = u * width, y = v * height;
  const broad = noise((x - flowX) / 930 + (y - flowY) / 1700, (y - flowY) / 490, seed);
  const drift = noise((x - flowX * .63) / 410, (y - flowY * .81) / 690, seed + 7);
  const cloud = cloudLayers(x, y, height, flowX, flowY, seed, width);
  const density = clamp(weather.density + (broad * .65 + drift * .35 - .5) * weather.variation + (cloud.mass - .25) * weather.clouds * .75);
  const transmission = Math.exp(-density * 2.4);
  const diffusion = clamp(weather.diffusion * (.75 + density * .4));
  const light = illumination(u, v, seconds, time);
  const direct = mix(light, .48 + light * .16, diffusion * .75) * transmission * weather.direct;
  const fill = clamp(weather.fill * (.68 + light * .32) * (1 - density * .65) + diffusion * (1 - density) * .28);
  return { direct, fill, density, diffusion, light, v, drift, cloud: cloud.mass * weather.clouds, rim: cloud.rim * weather.clouds, shade: cloud.shade };
}

export function sunsetColor(v, palette) {
  const middle = smooth(v / .68), lower = smooth((v - .58) / .42);
  return palette['sunset-top'].map((value, c) => mix(mix(value, palette['sunset-middle'][c], middle), palette['sunset-bottom'][c], lower));
}

export function fieldColor(sample, time, weather, palette) {
  const { direct, fill, density } = sample;
  const night = time.night;
  const output = [0, 0, 0];
  for (let c = 0; c < 3; c++) {
    const clearShadow = mix(palette['day-shadow'][c], palette['night-shadow'][c], night);
    const shadow = mix(clearShadow, palette['density-shadow'][c], density * weather.cast * .8 * (1 - night * .6));
    let ambient = mix(palette['day-ambient'][c], palette['night-ambient'][c], night);
    const cloudy = mix(palette.cloud[c], palette.rain[c], clamp((weather.cast - .6) * 2.5));
    ambient = mix(ambient, cloudy, weather.cast * (1 - night) * .65);
    const source = mix(mix(palette.daylight[c], palette.warm[c], time.warm), palette.moon[c], night);
    const base = mix(shadow, ambient, fill * mix(1, .6, night));
    const lit = mix(base, source, clamp(direct * mix(.96, .68, night) * (1 - weather.clouds * .28)));
    const cloudShade = mix(palette['cloud-shadow'][c], palette['night-ambient'][c], night);
    const cloudLight = mix(mix(palette['cloud-light'][c], palette.warm[c], time.warm * .5), palette.moon[c], night);
    const material = mix(cloudShade, cloudLight, clamp(.84 + sample.rim * .06 + sample.light * .10 - sample.shade * .24 - weather.storm * .28));
    output[c] = mix(lit, material, sample.cloud * mix(.86, .43, night) * (1 - weather.storm * .3));
  }
  if (time.warm > .01) {
    const sunset = sunsetColor(clamp(sample.v + (sample.drift - .5) * .30), palette);
    for (let c = 0; c < 3; c++) output[c] = mix(output[c], sunset[c], time.warm * (1 - night * .45) * .64);
  }
  const gray = output[0] * .2126 + output[1] * .7152 + output[2] * .0722;
  return output.map(value => mix(value, gray, density * .12));
}

export function glassOptics(x, y, seed) {
  const broad = noise(x / 165, y / 190, seed + 81);
  const relief = noise(x / 34, y / 39, seed + 83);
  const clear = smooth((broad * .72 + relief * .28 - .27) / .44);
  return {
    diffusion: .12 + (1 - clear) * .82,
    dx: (noise(x / 48, y / 57, seed + 89) - .5) * 12 + (hash(x, y, seed + 90) - .5) * 2,
    dy: (noise(x / 55, y / 43, seed + 91) - .5) * 10 + (hash(x, y, seed + 92) - .5) * 2,
  };
}

export function flashInfluence(u, v, side, seed) {
  const lateral = side < 0 ? 1 - u : u;
  return Math.pow(clamp(lateral), 2.5) * (.72 + .28 * noise(u * 3, v * 2, seed)) * (.8 + .2 * (1 - v));
}
