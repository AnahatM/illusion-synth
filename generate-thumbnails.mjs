#!/usr/bin/env node
/**
 * generate-thumbnails.mjs
 *
 * Usage:  node generate-thumbnails.mjs
 *   (or)  npm run generate-thumbs
 *
 * Starts the Vite dev server, opens the /capture route in headless Chromium,
 * waits for all illusion thumbnails to render, then saves each one as a
 * .webp file under public/thumbnails/.
 *
 * Re-run whenever new illusions are added.
 */

import { chromium } from "playwright";
import { createServer } from "vite";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "public", "thumbnails");

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  // Start Vite dev server on a fixed port
  const server = await createServer({
    root: __dirname,
    server: { port: 5199, strictPort: true },
    logLevel: "warn",
  });
  await server.listen();
  console.log("Vite dev server started on http://localhost:5199");

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Suppress console noise from the page
  page.on("pageerror", (err) => console.error("[page error]", err.message));

  console.log("Navigating to capture route…");
  await page.goto("http://localhost:5199/#/capture");

  // Wait until the page sets window.__captureResults (status === 'done')
  console.log("Waiting for all thumbnails to render…");
  await page.waitForFunction(
    () => window.__captureResults !== undefined,
    { timeout: 5 * 60 * 1000 }, // 5-minute safety timeout
  );

  const results = await page.evaluate(() => window.__captureResults);

  // Special case: impossible-shapes can't render via WebGL in headless Chromium
  // (shader validation failure in SwiftShader). Use the penrose-triangle PNG instead,
  // converted to WebP via a canvas while the browser is still open.
  const pngBuf = await readFile(
    path.join(__dirname, "public", "impossible-shapes", "penrose-triangle.png"),
  );
  const pngB64 = pngBuf.toString("base64");
  results["impossible-shapes"] = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await new Promise((resolve) => (img.onload = resolve));
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 320, 320);
    const scale = Math.min(320 / img.naturalWidth, 320 / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (320 - w) / 2, (320 - h) / 2, w, h);
    return canvas.toDataURL("image/webp", 0.85);
  }, pngB64);

  await browser.close();
  await server.close();

  const ids = Object.keys(results);
  console.log(`Writing ${ids.length} thumbnails to public/thumbnails/…`);

  for (const [id, dataUrl] of Object.entries(results)) {
    // dataUrl is "data:image/webp;base64,..."
    const base64 = dataUrl.replace(/^data:[^;]+;base64,/, "");
    const buf = Buffer.from(base64, "base64");
    const outPath = path.join(OUT_DIR, `${id}.webp`);
    await writeFile(outPath, buf);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
