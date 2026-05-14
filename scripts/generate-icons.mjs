/**
 * Generates BAM! favicon and app icons from SVG using sharp.
 * Run once: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

// ─── Logo SVG ─────────────────────────────────────────────────────────────────
// Ink (#0A0A0A) bg, "BAM" in cream (#FFFCF2), "!" in siren (#FF2D2D)
// Designed at 512×512; sharp downscales cleanly to each target size.
const logoSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0A0A0A"/>
  <text
    x="256"
    y="298"
    font-family="'Arial Black', 'Impact', 'Helvetica Neue', sans-serif"
    font-weight="900"
    font-size="208"
    text-anchor="middle"
    dominant-baseline="auto"
    fill="#FFFCF2"
    letter-spacing="-6"
  >BAM<tspan fill="#FF2D2D">!</tspan></text>
</svg>`;

// ─── SVG (for modern browsers) ────────────────────────────────────────────────
writeFileSync(join(publicDir, "favicon.svg"), logoSvg, "utf8");
console.log("✓ favicon.svg");

const buf = Buffer.from(logoSvg);

// ─── PNG sizes ────────────────────────────────────────────────────────────────
const sizes = [
  { name: "icon-512.png",          size: 512 },
  { name: "icon-192.png",          size: 192 },
  { name: "apple-touch-icon.png",  size: 180 },
  { name: "favicon-32.png",        size: 32  },
  { name: "favicon-16.png",        size: 16  },
];

for (const { name, size } of sizes) {
  await sharp(buf)
    .resize(size, size, { fit: "contain", background: "#0A0A0A" })
    .png()
    .toFile(join(publicDir, name));
  console.log(`✓ ${name}`);
}

// ─── favicon.ico — PNG-in-ICO format ─────────────────────────────────────────
// Embed the 32×32 PNG directly inside an ICO container.
// All modern browsers and OSes accept this format.
const png32 = await sharp(buf)
  .resize(32, 32, { fit: "contain", background: "#0A0A0A" })
  .png()
  .toBuffer();

function createIco(pngBuffer) {
  const w = 32, h = 32;
  // ICONDIR (6 bytes) + ICONDIRENTRY (16 bytes) + PNG data
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);  // reserved
  header.writeUInt16LE(1, 2);  // type: 1 = ICO
  header.writeUInt16LE(1, 4);  // image count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(w,  0);          // width  (0 = 256)
  entry.writeUInt8(h,  1);          // height (0 = 256)
  entry.writeUInt8(0,  2);          // color count
  entry.writeUInt8(0,  3);          // reserved
  entry.writeUInt16LE(1,  4);       // planes
  entry.writeUInt16LE(32, 6);       // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8);    // image size
  entry.writeUInt32LE(6 + 16,       12);       // offset

  return Buffer.concat([header, entry, pngBuffer]);
}

writeFileSync(join(publicDir, "favicon.ico"), createIco(png32));
console.log("✓ favicon.ico");

console.log("\nAll icons generated in /public.");
