import { clamp, smooth } from './material.mjs';

// These describe how material transmits light, not complete rendered scenes.
const responses = {
  clear: { density: .06, variation: .05, diffusion: .12, direct: 1, fill: .80, cast: 0, flow: .65, clouds: 0, storm: 0 },
  'partly-cloudy': { density: .30, variation: .68, diffusion: .40, direct: .93, fill: .72, cast: .35, flow: 1, clouds: .9, storm: 0 },
  overcast: { density: .58, variation: .48, diffusion: .84, direct: .36, fill: .72, cast: .62, flow: 1, clouds: .9, storm: 0 },
  rain: { density: .70, variation: .50, diffusion: .92, direct: .23, fill: .48, cast: .86, flow: 1.3, clouds: 1, storm: 0 },
  thunderstorm: { density: .78, variation: .56, diffusion: .88, direct: .15, fill: .27, cast: 1, flow: 1.65, clouds: 1, storm: 1 },
  neutral: { density: .3, variation: .05, diffusion: .8, direct: .1, fill: .64, cast: .4, flow: .2, clouds: 0, storm: 0 },
};
export const weatherStates = {
  ...Object.fromEntries(Object.keys(responses).map(name => [name, { response: name, artDirection: 'active' }])),
  fog: { response: 'overcast', artDirection: 'reserved' },
  snow: { response: 'overcast', artDirection: 'reserved' },
};
export function weatherResponse(state) {
  return { ...responses[weatherStates[state]?.response || 'neutral'], precipitation: state === 'rain' ? .75 : state === 'thunderstorm' ? 1 : 0 };
}

export function weatherState(env) {
  if (env.code === 'orbit' || ['—', 'LOCATING', 'NO SIGNAL', 'UNAVAILABLE', 'PERMISSION DENIED'].includes(env.cond)) return 'neutral';
  const w = env.weatherCode;
  if (w === 0 || w === 1) return 'clear';
  if (w === 2) return 'partly-cloudy';
  if (w === 3) return 'overcast';
  if ([45, 48].includes(w)) return 'fog';
  if ([71, 73, 75, 77, 85, 86].includes(w)) return 'snow';
  if ([95, 96, 99].includes(w)) return 'thunderstorm';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(w)) return 'rain';
  return 'neutral';
}

export const previewStates = {
  'clear-day': { weather: 'clear', hour: 12 },
  'partly-cloudy': { weather: 'partly-cloudy', hour: 12 },
  overcast: { weather: 'overcast', hour: 12 },
  rain: { weather: 'rain', hour: 12 },
  thunderstorm: { weather: 'thunderstorm', hour: 12 },
  'golden-hour': { weather: 'clear', hour: 18.75 },
  'clear-night': { weather: 'clear', hour: 0 },
  'cloudy-night': { weather: 'partly-cloudy', hour: 0 },
};
export function previewSettings(search, development = false) {
  const params = new URLSearchParams(search);
  const name = params.get('atmosphere');
  if (!Object.hasOwn(previewStates, name)) return null;
  const spec = previewStates[name];
  const hour = params.has('hour') ? Number(params.get('hour')) : spec.hour;
  return { name: name || '', weather: spec.weather, hour: Number.isFinite(hour) ? clamp(hour, 0, 24) % 24 : spec.hour,
    fastLightning: development && spec.weather === 'thunderstorm' && params.get('lightning') === 'qa' };
}

const formatters = new Map();
export function localTime(env, now = new Date()) {
  const tz = env.tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
  let format = formatters.get(tz);
  if (!format) {
    try { format = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }); }
    catch { return localTime({ ...env, tz: 'UTC' }, now); }
    formatters.set(tz, format);
  }
  const parts = Object.fromEntries(format.formatToParts(now).map(part => [part.type, part.value]));
  const date = `${parts.year}-${parts.month}-${parts.day}`;
  const solar = env.solarDays?.find(day => day.date === date);
  const solarHour = (value, fallback) => {
    const match = typeof value === 'string' && value.match(/T(\d{2}):(\d{2})/);
    return match ? Number(match[1]) + Number(match[2]) / 60 : fallback;
  };
  // If solar timing is unavailable, use an approximate local clock rather than inventing measurements.
  const sunrise = solarHour(solar?.sunrise, 6.5), sunset = solarHour(solar?.sunset, 19.5);
  return { hour: Number(parts.hour) + Number(parts.minute) / 60 + (Number(parts.second) + now.getMilliseconds() / 1000) / 3600,
    sunrise, sunset, approximate: !solar?.sunrise || !solar?.sunset };
}

// Smooth overlapping contributions reserve pre-dawn and sunrise without a separate scene switch.
export function timeLighting(hour, sunrise = 6.5, sunset = 19.5) {
  const h = ((hour % 24) + 24) % 24;
  const day = smooth((h - sunrise + .9) / 2) * (1 - smooth((h - sunset + .2) / 1.5));
  const morning = smooth((h - sunrise + .8) / .9) * (1 - smooth((h - sunrise - .2) / 1.7));
  const evening = smooth((h - sunset + 2.2) / 1.5) * (1 - smooth((h - sunset + .1) / 1.2));
  const warm = clamp(morning * .65 + evening);
  return { day, night: 1 - day, warm, lateral: clamp(morning + evening), side: evening - morning };
}

export const lightningTiming = { production: [60, 180], qa: [5, 12], attack: .07, decay: .42, secondaryDelay: .48, secondaryDecay: .27 };
export function lightningDelay(fast, random = Math.random()) {
  const [low, high] = fast ? lightningTiming.qa : lightningTiming.production;
  return low + clamp(random) * (high - low);
}
export function lightningEnvelope(age, secondary = false) {
  if (age < 0) return 0;
  const pulse = (t, decay) => t < 0 ? 0 : smooth(t / lightningTiming.attack) * Math.exp(-t / decay);
  return pulse(age, lightningTiming.decay) + (secondary ? .32 * pulse(age - lightningTiming.secondaryDelay, lightningTiming.secondaryDecay) : 0);
}
