import type { Environment, FieldFactory } from "../PrototypeExperience";
import { atmosphereConfig as config } from "./config";
import { createGlassMaterial } from "./glassMaterial";
import { fieldColor, flashInfluence, hash, mix, rainDrop, sampleLightField, starVisibility, windVector } from "./material.mjs";
import { lightningDelay, lightningEnvelope, localTime, previewSettings, timeLighting, weatherResponse, weatherState } from "./model.mjs";

type Palette = Record<string, number[]>;
const colorNames = ["day-shadow", "density-shadow", "day-ambient", "daylight", "warm", "sunset-top", "sunset-middle", "sunset-bottom", "moon", "night-shadow", "night-ambient", "cloud", "cloud-light", "cloud-shadow", "star", "rain", "rain-streak", "flash"];

export const createAtmosphereField: FieldFactory = (getCanvas, options) => {
  const canvas = getCanvas();
  const context = canvas?.getContext("2d");
  if (!canvas || !context) return { setEnv() {}, setMouse() {}, resize() {}, stop() {} };
  const field = document.createElement("canvas");
  const fieldContext = field.getContext("2d", { alpha: false })!;
  const glass = createGlassMaterial(config.seed);
  const grain = document.createElement("canvas");
  grain.width = grain.height = 256;
  const grainContext = grain.getContext("2d")!;
  const preview = previewSettings(window.location.search, process.env.NODE_ENV === "development");
  const stars = Array.from({ length: 14 }, (_, i) => ({ u: .22 + hash(i, 9, config.seed) * .75, v: (i < 7 ? .02 : .81) + hash(i, 18, config.seed) * .16, size: 1.2 + hash(i, 27, config.seed) * 1.4 }));
  let environment: Environment = { label: "", cond: "—", code: "", phase: "day", windDir: 270, windSpeed: 0 };
  let state = preview?.weather || "neutral";
  let target = weatherResponse(state);
  const weather = { ...target };
  let lighting = timeLighting(preview?.hour ?? localTime(environment).hour);
  let targetWind = windVector(8, 270), wind = { ...targetWind };
  let palette: Palette, pixels: ImageData, grainPattern: CanvasPattern | null = null;
  let grainOpacity = .04, transitionDuration = 12000;
  let width = 0, height = 0, flowX = 0, flowY = 0, elapsed = 0;
  let raf = 0, timer = 0, lastFrame = 0, stopped = false, receivedEnvironment = false;
  let nextFlash = Infinity, flashStart = -Infinity, flashSide = 1, secondary = false;
  const weatherKeys = Object.keys(weather) as (keyof typeof weather)[];
  const timeKeys = Object.keys(lighting) as (keyof typeof lighting)[];
  canvas.dataset.background = "atmosphere";
  canvas.dataset.atmosphereState = state;
  if (preview) canvas.dataset.atmospherePreview = preview.name;

  function readPalette() {
    const style = getComputedStyle(canvas!);
    palette = Object.fromEntries(colorNames.map(name => [name, style.getPropertyValue(`--color-atmosphere-${name}`).split(",").map(Number)]));
    grainOpacity = Number(style.getPropertyValue("--atmosphere-grain-opacity"));
    transitionDuration = Number(style.getPropertyValue("--duration-atmosphere-transition"));
    const texture = grainContext.createImageData(grain.width, grain.height);
    for (let y = 0; y < grain.height; y++) for (let x = 0; x < grain.width; x++) {
      const i = (y * grain.width + x) * 4, tone = hash(x, y, config.seed);
      for (let c = 0; c < 3; c++) texture.data[i + c] = mix(palette["night-shadow"][c], palette.daylight[c], tone);
      texture.data[i + 3] = 255;
    }
    grainContext.putImageData(texture, 0, 0);
    grainPattern = context!.createPattern(grain, "repeat");
  }

  function schedule() {
    if (stopped || document.hidden || raf) return;
    window.clearTimeout(timer); timer = 0;
    raf = requestAnimationFrame(draw);
  }
  function draw(now: number) {
    raf = 0;
    if (stopped || document.hidden) return;
    const delta = lastFrame ? Math.min(100, now - lastFrame) : 0;
    lastFrame = now;
    const blend = options.reduced ? 1 : 1 - Math.exp(-delta / (transitionDuration / 3));
    const clock = preview ? { hour: preview.hour, sunrise: 6.5, sunset: 19.5 } : localTime(environment);
    const timeTarget = timeLighting(clock.hour, clock.sunrise, clock.sunset);
    for (const key of weatherKeys) weather[key] = mix(weather[key], target[key], blend);
    for (const key of timeKeys) lighting[key] = mix(lighting[key], timeTarget[key], blend);
    canvas!.dataset.atmosphereNight = lighting.night > .55 ? "true" : "false";
    wind.x = mix(wind.x, targetWind.x, blend); wind.y = mix(wind.y, targetWind.y, blend);
    if (!options.reduced) {
      elapsed += delta / 1000;
      flowX += wind.x * weather.flow * delta / 1000; flowY += wind.y * weather.flow * delta / 1000;
    }
    if (state === "thunderstorm" && !options.reduced) {
      if (!Number.isFinite(nextFlash)) nextFlash = elapsed + lightningDelay(preview?.fastLightning ?? false);
      if (elapsed >= nextFlash) {
        flashStart = elapsed; flashSide = Math.random() < .5 ? -1 : 1; secondary = Math.random() < .35;
        nextFlash = elapsed + lightningDelay(preview?.fastLightning ?? false);
      }
    } else { nextFlash = Infinity; flashStart = -Infinity; }
    const flash = options.reduced ? 0 : lightningEnvelope(elapsed - flashStart, secondary);
    canvas!.dataset.atmosphereFlash = flash > .03 ? "active" : "idle";
    for (let y = 0; y < field.height; y++) for (let x = 0; x < field.width; x++) {
      const i = (y * field.width + x) * 4, u = x / field.width, v = y / field.height;
      const sample = sampleLightField(u, v, width, height, flowX, flowY, elapsed, weather, lighting, config.seed);
      const color = fieldColor(sample, lighting, weather, palette);
      const exposure = flash * flashInfluence(u, v, flashSide, config.seed) * .92;
      for (let c = 0; c < 3; c++) pixels.data[i + c] = mix(color[c], palette.flash[c], exposure);
      pixels.data[i + 3] = 255;
    }
    fieldContext.putImageData(pixels, 0, 0);
    context!.imageSmoothingEnabled = true; context!.imageSmoothingQuality = "high";
    context!.drawImage(glass.render(field, width, height), 0, 0, width, height);
    if (grainPattern) {
      context!.globalAlpha = grainOpacity * (1 + flash * .65);
      context!.fillStyle = grainPattern; context!.fillRect(0, 0, width, height); context!.globalAlpha = 1;
    }
    if (lighting.night > .01) {
      context!.fillStyle = `rgb(${palette.star.join(",")})`;
      stars.forEach((star, i) => {
        const sample = sampleLightField(star.u, star.v, width, height, flowX, flowY, elapsed, weather, lighting, config.seed);
        const alpha = starVisibility(lighting.night, sample.density, options.reduced ? 0 : elapsed, i) * .9;
        const halo = context!.createRadialGradient(star.u * width, star.v * height, 0, star.u * width, star.v * height, star.size * 3);
        halo.addColorStop(0, `rgba(${palette.star.join(",")},${alpha * .25})`);
        halo.addColorStop(1, `rgba(${palette.star.join(",")},0)`);
        context!.globalAlpha = 1;
        context!.fillStyle = halo;
        context!.fillRect(star.u * width - star.size * 3, star.v * height - star.size * 3, star.size * 6, star.size * 6);
        context!.fillStyle = `rgb(${palette.star.join(",")})`;
        context!.globalAlpha = alpha;
        context!.beginPath(); context!.arc(star.u * width, star.v * height, star.size / 2, 0, Math.PI * 2); context!.fill();
      });
      context!.globalAlpha = 1;
    }
    if (weather.precipitation > .01) {
      context!.strokeStyle = `rgb(${palette["rain-streak"].join(",")})`;
      context!.lineWidth = .55;
      context!.lineCap = "round";
      for (let i = 0; i < 72; i++) {
        const drop = rainDrop(i, options.reduced ? 0 : elapsed, width, height, wind.x, config.seed);
        context!.globalAlpha = drop.alpha * weather.precipitation;
        context!.beginPath(); context!.moveTo(drop.x, drop.y);
        context!.lineTo(drop.x + drop.length * drop.slant, drop.y + drop.length); context!.stroke();
      }
      context!.globalAlpha = 1;
    }
    if (!options.reduced) timer = window.setTimeout(schedule, config.frameInterval);
  }
  function resize() {
    width = window.innerWidth; height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas!.width = Math.round(width * dpr); canvas!.height = Math.round(height * dpr);
    context!.setTransform(dpr, 0, 0, dpr, 0, 0);
    field.width = Math.max(1, Math.min(config.maxFieldWidth, Math.ceil(width / config.fieldPixelSize)));
    field.height = Math.max(1, Math.ceil(field.width * height / width));
    pixels = fieldContext.createImageData(field.width, field.height);
    readPalette(); schedule();
  }
  function visibility() {
    cancelAnimationFrame(raf); window.clearTimeout(timer); raf = timer = 0; lastFrame = 0;
    if (!document.hidden) schedule();
  }
  document.addEventListener("visibilitychange", visibility);
  resize();
  return {
    setEnv(env: Environment) {
      environment = env;
      state = preview?.weather || weatherState(env); target = weatherResponse(state);
      targetWind = preview ? windVector(8, 270) : windVector(env.windSpeed, env.windDir);
      if (!receivedEnvironment || options.reduced) {
        Object.assign(weather, target); wind = { ...targetWind };
        const clock = preview ? { hour: preview.hour, sunrise: 6.5, sunset: 19.5 } : localTime(env);
        lighting = timeLighting(clock.hour, clock.sunrise, clock.sunset);
      }
      receivedEnvironment = true;
      canvas.dataset.atmosphereState = state; schedule();
    },
    setMouse() { /* Viewing-diffusion interaction remains disabled until visual approval. */ },
    resize,
    stop() {
      stopped = true; cancelAnimationFrame(raf); window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", visibility); context.clearRect(0, 0, width, height);
      delete canvas.dataset.background; delete canvas.dataset.atmosphereState;
      delete canvas.dataset.atmospherePreview; delete canvas.dataset.atmosphereFlash;
      delete canvas.dataset.atmosphereNight;
      field.width = grain.width = 0; glass.stop();
    },
  };
};
