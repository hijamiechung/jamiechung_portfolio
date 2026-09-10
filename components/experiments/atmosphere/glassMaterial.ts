import { clamp, glassOptics, mix, smooth } from "./material.mjs";

// A fixed pane mixes clear and diffused views with locally varying refraction.
// The world moves behind it; there is no visible lens boundary or uniform blur wash.
export function createGlassMaterial(seed: number) {
  const clear = document.createElement("canvas"), diffuse = document.createElement("canvas"), result = document.createElement("canvas");
  const clearContext = clear.getContext("2d", { willReadFrequently: true })!;
  const diffuseContext = diffuse.getContext("2d", { willReadFrequently: true })!;
  const resultContext = result.getContext("2d")!;
  let width = 0, height = 0, viewWidth = 0, viewHeight = 0, pixels: ImageData;
  let optics: (ReturnType<typeof glassOptics> & { sine: number; cosine: number; focusWeight: number })[] = [];
  return {
    render(source: HTMLCanvasElement, viewportWidth: number, viewportHeight: number, focusTime = 0) {
      if (width !== source.width || height !== source.height || viewWidth !== viewportWidth || viewHeight !== viewportHeight) {
        width = source.width; height = source.height;
        viewWidth = viewportWidth; viewHeight = viewportHeight;
        for (const pane of [clear, diffuse, result]) { pane.width = width; pane.height = height; }
        pixels = resultContext.createImageData(width, height);
        optics = Array.from({ length: width * height }, (_, i) => {
          const x = i % width, y = Math.floor(i / width);
          const lens = glassOptics(x * viewWidth / width, y * viewHeight / height, seed);
          const phase = x / width * 9 + y / height * 12 + lens.dx * .12;
          return { ...lens, sine: Math.sin(phase), cosine: Math.cos(phase), focusWeight: 1 - smooth((y / height - .82) / .08) };
        });
      }
      clearContext.clearRect(0, 0, width, height);
      clearContext.drawImage(source, 0, 0);
      diffuseContext.clearRect(0, 0, width, height);
      diffuseContext.filter = `blur(${24 * width / viewportWidth}px)`;
      diffuseContext.drawImage(source, 0, 0);
      const sharp = clearContext.getImageData(0, 0, width, height).data;
      const soft = diffuseContext.getImageData(0, 0, width, height).data;
      const pixelScale = width / viewportWidth;
      const sine = Math.sin(focusTime * .42), cosine = Math.cos(focusTime * .42) - 1;
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        const i = y * width + x, lens = optics[i];
        const sx = Math.max(0, Math.min(width - 1, Math.round(x + lens.dx * .3 * pixelScale)));
        const sy = Math.max(0, Math.min(height - 1, Math.round(y + lens.dy * .3 * pixelScale)));
        const sample = (sy * width + sx) * 4;
        // Phase varies across the pane: head and stem never sharpen as one flat image.
        const focus = (sine * lens.cosine + cosine * lens.sine) * .28 * lens.focusWeight;
        const diffusion = clamp(lens.diffusion + focus, .08, .97);
        const sharpAlpha = sharp[sample + 3] / 255, softAlpha = soft[sample + 3] / 255;
        const alpha = mix(sharpAlpha, softAlpha, diffusion);
        // Interpolate premultiplied color so transparent edges never pick up a dark fringe.
        for (let c = 0; c < 3; c++) pixels.data[i * 4 + c] = alpha > 0
          ? mix(sharp[sample + c] * sharpAlpha, soft[sample + c] * softAlpha, diffusion) / alpha : 0;
        pixels.data[i * 4 + 3] = sharpAlpha === 1 ? 255 : alpha * 255;
      }
      resultContext.putImageData(pixels, 0, 0);
      return result;
    },
    stop() { for (const pane of [clear, diffuse, result]) pane.width = 0; optics = []; },
  };
}
