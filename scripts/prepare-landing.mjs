#!/usr/bin/env node
/**
 * Prepara los recursos del landing a partir de los videos exportados.
 *
 * 1. Copia cada mp4 como version web (720x1280, crf 27, faststart).
 * 2. Extrae un fotograma de la pantalla del sistema para la miniatura.
 *
 * Salidas:
 *   landing/videos/00-general.mp4
 *   landing/videos/procesos/NN-*.mp4
 *   landing/thumbnails/NN-*.jpg
 */

import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "out");
const LANDING = join(ROOT, "..", "landing");
const L_VIDEOS = join(LANDING, "videos");
const L_PROCESOS = join(L_VIDEOS, "procesos");
const L_THUMBS = join(LANDING, "thumbnails");

mkdirSync(L_VIDEOS, { recursive: true });
mkdirSync(L_PROCESOS, { recursive: true });
mkdirSync(L_THUMBS, { recursive: true });

const ffmpeg = (args) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args]);

/** Version web: 720x1280, crf 27, faststart para que empiece a cargar ya. */
const webVersion = (src, dst) => {
  ffmpeg([
    "-i", src,
    "-vf", "scale=720:1280:force_original_aspect_ratio=decrease",
    "-c:v", "libx264",
    "-crf", "27",
    "-preset", "slow",
    "-profile:v", "high",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "128k",
    "-movflags", "+faststart",
    dst,
  ]);
};

/**
 * Miniatura: se toma dentro de la segunda escena con panel de sistema,
 * ya entrada la animacion. Se lee el manifiesto para saber cuando cae.
 */
const thumbnail = (src, dst, at) => {
  ffmpeg([
    "-ss", at,
    "-i", src,
    "-frames:v", "1",
    "-q:v", "3",
    dst,
  ]);
};

/** Instante dentro de la escena con panel que mejor muestra el sistema. */
const mejorInstante = (manifestPath, fps = 30) => {
  if (!existsSync(manifestPath)) return 18;
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  // Escena 2 (la primera con panel) y 3: la de la mitad del bloque.
  const candidatas = manifest.scenes.filter((s) => !s.id.endsWith("cierre"));
  if (candidatas.length < 3) return 18;
  const escena = candidatas[2] ?? candidatas[1];
  const frame = escena.startFrame + escena.durationInFrames * 0.72;
  return Number((frame / fps).toFixed(2));
};

const jobs = [];

const general = join(OUT, "00-general.mp4");
if (existsSync(general)) {
  jobs.push({
    id: "00-general",
    src: general,
    dst: join(L_VIDEOS, "00-general.mp4"),
    at: mejorInstante(join(ROOT, "src", "generated", "00-general.json")),
  });
}

const procesosDir = join(OUT, "procesos");
if (existsSync(procesosDir)) {
  for (const f of readdirSync(procesosDir).filter((x) => x.endsWith(".mp4")).sort()) {
    const id = f.replace(/\.mp4$/, "");
    jobs.push({
      id,
      src: join(procesosDir, f),
      dst: join(L_PROCESOS, f),
      at: mejorInstante(join(ROOT, "src", "generated", "processes", `${id}.json`)),
    });
  }
}

if (jobs.length === 0) {
  console.error("No hay videos exportados en out/. Ejecuta antes: node scripts/render-all.mjs");
  process.exit(1);
}

for (const job of jobs) {
  webVersion(job.src, job.dst);
  thumbnail(job.src, join(L_THUMBS, `${job.id}.jpg`), job.at);
  const kb = Math.round(statSync(job.dst).size / 1024);
  console.log(`✓ ${job.id}  →  videos/${kb} KB  +  thumbnails/${job.id}.jpg`);
}

// El landing referencia al video general con poster propio.
const poster = join(L_THUMBS, "00-general.jpg");
if (existsSync(poster)) copyFileSync(poster, poster);

console.log(`\n${jobs.length} videos listos para el landing.\n`);
