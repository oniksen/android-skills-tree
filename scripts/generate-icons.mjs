import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "src/app/icon.svg");

const targets = [
  { out: "public/icon-192.png", size: 192 },
  { out: "public/icon-512.png", size: 512 },
  { out: "public/icon-maskable-512.png", size: 512 },
  { out: "src/app/apple-icon.png", size: 180 },
];

const svg = await readFile(source);

for (const { out, size } of targets) {
  await sharp(svg, { density: 600 })
    .resize(size, size, { fit: "fill" })
    .flatten({ background: "#faf9f5" })
    .png()
    .toFile(resolve(root, out));
  console.log(`${out} ${size}x${size}`);
}
