/**
 * Generate 256×256 tileable noise texture PNGs using only Node built-in modules.
 * Output: src/assets/noise-grain.png, src/assets/noise-crosshatch.png, src/assets/noise-speckle.png
 */
import { writeFileSync } from "fs";
import { deflateSync } from "zlib";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SIZE = 256;

/* ── CRC32 ── */
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c;
}
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++)
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/* ── PNG writer ── */
function chunk(type, data) {
  const t = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const payload = Buffer.concat([t, data]);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc32(payload));
  return Buffer.concat([len, payload, c]);
}

function createPNG(w, h, pixelFn) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc(h * (1 + w * 4));
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 4)] = 0; // filter: none
    for (let x = 0; x < w; x++) {
      const [r, g, b, a] = pixelFn(x, y);
      const off = y * (1 + w * 4) + 1 + x * 4;
      raw[off] = r;
      raw[off + 1] = g;
      raw[off + 2] = b;
      raw[off + 3] = a;
    }
  }

  const compressed = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ── Seeded PRNG for reproducibility ── */
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Texture 1: Fine grain noise ── */
// Subtle monochrome film grain — white specks with varying alpha on transparent
function generateGrain() {
  const rng = mulberry32(42);
  return createPNG(SIZE, SIZE, (x, y) => {
    const v = rng();
    // Most pixels are transparent, occasional bright specks
    if (v > 0.65) {
      const brightness = 200 + Math.floor(rng() * 55); // 200-255
      const alpha = Math.floor(8 + rng() * 18); // very subtle: 8-26 out of 255
      return [brightness, brightness, brightness, alpha];
    }
    // Some pixels are very faint dark specks (adds depth)
    if (v < 0.15) {
      const alpha = Math.floor(4 + rng() * 12);
      return [0, 0, 0, alpha];
    }
    return [0, 0, 0, 0];
  });
}

/* ── Texture 2: Crosshatch / fine grid with noise ── */
// Subtle grid lines with noise — evokes blueprint/data-table aesthetic
function generateCrosshatch() {
  const rng = mulberry32(137);
  return createPNG(SIZE, SIZE, (x, y) => {
    const gridSpacing = 16;
    const onGridX = x % gridSpacing === 0;
    const onGridY = y % gridSpacing === 0;
    const noise = rng();

    if (onGridX || onGridY) {
      // Grid intersection
      if (onGridX && onGridY) {
        const alpha = Math.floor(14 + noise * 16);
        return [255, 255, 255, alpha];
      }
      // Grid line
      if (noise > 0.4) {
        const alpha = Math.floor(5 + noise * 10);
        return [255, 255, 255, alpha];
      }
    }

    // Background grain
    if (noise > 0.75) {
      const alpha = Math.floor(3 + rng() * 8);
      return [255, 255, 255, alpha];
    }
    return [0, 0, 0, 0];
  });
}

/* ── Texture 3: Dense speckle ── */
// Denser noise, more like the material texture visible in Zed's darker sections
function generateSpeckle() {
  const rng = mulberry32(256);
  return createPNG(SIZE, SIZE, (x, y) => {
    const v = rng();
    // Higher density than grain — about 50% of pixels get some value
    if (v > 0.45) {
      const brightness = Math.floor(180 + rng() * 75);
      const alpha = Math.floor(4 + rng() * 14); // 4-18 out of 255
      return [brightness, brightness, brightness, alpha];
    }
    if (v < 0.25) {
      const alpha = Math.floor(2 + rng() * 10);
      return [0, 0, 0, alpha];
    }
    return [0, 0, 0, 0];
  });
}

/* ── Write files ── */
const outDir = resolve(__dirname, "../src/assets");

writeFileSync(resolve(outDir, "noise-grain.png"), generateGrain());
writeFileSync(resolve(outDir, "noise-crosshatch.png"), generateCrosshatch());
writeFileSync(resolve(outDir, "noise-speckle.png"), generateSpeckle());

console.log("Generated 3 noise textures (256×256) in src/assets/");
