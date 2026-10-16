import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
import manifest from "@/app/manifest";

const PAPER = { r: 0xfa, g: 0xf9, b: 0xf5 };
const PAPER_HEX = "#faf9f5";
const CORAL = "#d97757";

function root(...parts: string[]): string {
  return resolve(process.cwd(), ...parts);
}

async function topLeftPixel(path: string) {
  const { data } = await sharp(path)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { r: data[0], g: data[1], b: data[2], a: data[3] };
}

function expectPaper(pixel: { r: number; g: number; b: number }) {
  expect(pixel.r).toBeGreaterThanOrEqual(PAPER.r - 8);
  expect(pixel.g).toBeGreaterThanOrEqual(PAPER.g - 8);
  expect(pixel.b).toBeGreaterThanOrEqual(PAPER.b - 8);
}

describe("manifest", () => {
  const m = manifest();

  it("uses the paper theme and background colors", () => {
    expect(m.theme_color).toBe("#faf9f5");
    expect(m.background_color).toBe("#faf9f5");
  });

  it("lists the svg, two any PNGs and one maskable PNG", () => {
    const icons = m.icons ?? [];
    expect(icons.map((i) => i.src)).toEqual([
      "/icon.svg",
      "/icon-192.png",
      "/icon-512.png",
      "/icon-maskable-512.png",
    ]);
    expect(icons.filter((i) => i.purpose === "maskable")).toHaveLength(1);
  });
});

describe("icon.svg master", () => {
  const svg = readFileSync(root("src", "app", "icon.svg"), "utf8");

  it("paints a paper background", () => {
    expect(svg.toLowerCase()).toContain(PAPER_HEX);
  });

  it("draws the mark in coral", () => {
    expect(svg.toLowerCase()).toContain(CORAL);
  });

  it("no longer uses the old navy background or blue/fuchsia gradient", () => {
    expect(svg.toLowerCase()).not.toContain("#020617");
    expect(svg.toLowerCase()).not.toContain("#3b82f6");
    expect(svg.toLowerCase()).not.toContain("#d946ef");
  });
});

describe("raster icons", () => {
  const pngs = [
    ["public/icon-192.png", 192],
    ["public/icon-512.png", 512],
    ["public/icon-maskable-512.png", 512],
    ["src/app/apple-icon.png", 180],
  ] as const;

  it.each(pngs)("%s is %i px with a paper background", async (rel, size) => {
    const path = root(rel);
    const meta = await sharp(path).metadata();
    expect(meta.width).toBe(size);
    expect(meta.height).toBe(size);
    expectPaper(await topLeftPixel(path));
  });

  it("keeps the apple touch icon fully opaque", async () => {
    const pixel = await topLeftPixel(root("src/app/apple-icon.png"));
    expect(pixel.a).toBe(255);
  });
});
