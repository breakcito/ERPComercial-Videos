#!/usr/bin/env node
/**
 * Exporta los 14 videos de la serie.
 *
 *   node scripts/render-all.mjs            -> todos
 *   node scripts/render-all.mjs 04-balanza -> solo uno
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "out");
const OUT_PROCESOS = join(OUT_DIR, "procesos");

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(OUT_PROCESOS, { recursive: true });

const argv = process.argv.slice(2);
const only = argv.find((a) => !a.startsWith("--"));

const general = "00-general";

const ids = readdirSync(join(ROOT, "src", "generated", "processes"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))
  .sort();

const targets = only ? ids.filter((id) => id.includes(only)) : ids;

const render = (id, out) => {
  console.log(`\n▶ ${id}`);
  execFileSync(
    "npx",
    [
      "remotion",
      "render",
      id,
      out,
      "--codec=h264",
      "--crf=18",
      "--audio-codec=aac",
      "--log=error",
    ],
    { cwd: ROOT, stdio: "inherit" },
  );
  console.log(`✓ ${out}`);
};

if (!only || only === general) {
  render(general, join(OUT_DIR, `${general}.mp4`));
}

for (const id of targets) {
  if (id === general) continue;
  render(id, join(OUT_PROCESOS, `${id}.mp4`));
}

console.log("\nSerie exportada.\n");
