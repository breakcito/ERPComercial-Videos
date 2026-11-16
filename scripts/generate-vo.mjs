#!/usr/bin/env node
/**
 * Sintetiza la locucion de toda la serie y arma la linea de tiempo.
 *
 * Voz: "Paulina" (es_MX) del sintetizador de macOS, la misma en los 14
 * videos. La cadena de ffmpeg deja la voz limpia y con presencia.
 *
 * Salidas:
 *   public/vo/<id>/<beat>.mp3   audio de cada locucion
 *   src/generated/<id>.json      manifiesto con los tiempos de cada beat
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, rmSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const VO_DIR = join(ROOT, "public", "vo");
const MANIFEST_DIR = join(ROOT, "src", "generated");
const MANIFEST_PROCESSES_DIR = join(MANIFEST_DIR, "processes");
const TMP_DIR = join(ROOT, ".tmp-vo");

const VOICE = "Paulina"; // es_MX
const BASE_RATE = 200; // ~170 palabras/min naturales

const CHAIN =
  "highpass=f=85,acompressor=threshold=-20dB:ratio=3.2:attack=12:release=170," +
  "equalizer=f=220:t=q:w=1:g=-2.5,equalizer=f=3200:t=q:w=1.2:g=2.2,aecho=0.85:0.9:42:0.1";

const argv = process.argv.slice(2);
const only = argv.includes("--video") ? argv[argv.indexOf("--video") + 1] : null;
const allArg = argv.includes("--all");

mkdirSync(MANIFEST_DIR, { recursive: true });
mkdirSync(MANIFEST_PROCESSES_DIR, { recursive: true });
mkdirSync(VO_DIR, { recursive: true });
mkdirSync(TMP_DIR, { recursive: true });

const synth = (text, outDir, outName) => {
  const aiff = join(TMP_DIR, `${outName}.aiff`);
  const mp3 = join(outDir, `${outName}.mp3`);

  execFileSync("say", ["-v", VOICE, "-r", String(BASE_RATE), "-o", aiff, text]);

  execFileSync("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-i",
    aiff,
    "-af",
    `${CHAIN},loudnorm=I=-15:TP=-1.5:LRA=11`,
    "-ar",
    "44100",
    "-ac",
    "1",
    "-b:a",
    "128k",
    mp3,
  ]);

  const probe = execFileSync("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "csv=p=0",
    mp3,
  ])
    .toString()
    .trim();

  return Number(probe);
};

const processVideo = (scriptPath, isGeneral) => {
  const script = JSON.parse(readFileSync(scriptPath, "utf8"));
  const { id: videoId, fps = 30, scenes } = script;
  const timing = script.timing ?? {
    leadIn: 0.22,
    pause: 1.0,
    gap: 0.3,
    closingPause: 1.8,
  };
  const SCENE_OVERLAP_SEC = 0.2;

  const outDir = join(VO_DIR, videoId);
  mkdirSync(outDir, { recursive: true });

  const beatRecords = [];
  const sceneRecords = [];

  let timelineCursorSec = 0;

  for (let sIdx = 0; sIdx < scenes.length; sIdx++) {
    const scene = scenes[sIdx];
    const isLastScene = sIdx === scenes.length - 1;
    const sceneBeatRecords = [];

    let sceneCursorSec = 0;

    for (let bIdx = 0; bIdx < scene.beats.length; bIdx++) {
      const beat = scene.beats[bIdx];
      const audioDuration = synth(beat.vo, outDir, beat.id);

      const beatStartSec = timelineCursorSec + sceneCursorSec + timing.leadIn;

      const beatRecord = {
        id: beat.id,
        sceneId: scene.id,
        file: `vo/${videoId}/${beat.id}.mp3`,
        startFrame: Math.round(beatStartSec * fps),
        durationInFrames: Math.round(audioDuration * fps),
        startMs: Math.round(beatStartSec * 1000),
        endMs: Math.round((beatStartSec + audioDuration) * 1000),
      };

      beatRecords.push(beatRecord);
      sceneBeatRecords.push(beatRecord);

      sceneCursorSec += timing.leadIn + audioDuration;
      if (bIdx < scene.beats.length - 1) {
        sceneCursorSec += timing.gap;
      }
    }

    // El cierre tiene mas aire: se ve el logo y el contacto.
    const postPause = isLastScene ? timing.closingPause : timing.pause;
    const sceneDurationSec = sceneCursorSec + postPause;

    sceneRecords.push({
      id: scene.id,
      startFrame: Math.round(timelineCursorSec * fps),
      durationInFrames: Math.round(sceneDurationSec * fps),
      beatIds: sceneBeatRecords.map((b) => b.id),
    });

    timelineCursorSec += sceneDurationSec - SCENE_OVERLAP_SEC;
  }

  const lastScene = sceneRecords[sceneRecords.length - 1];
  const totalFrames = lastScene.startFrame + lastScene.durationInFrames;
  const totalSeconds = Number((totalFrames / fps).toFixed(2));

  const manifest = {
    id: videoId,
    title: script.title,
    block: script.block,
    blockNumber: script.blockNumber,
    fps,
    voice: VOICE,
    rate: BASE_RATE,
    totalFrames,
    totalSeconds,
    brand: script.brand,
    beats: beatRecords,
    scenes: sceneRecords,
  };

  const manifestPath = isGeneral
    ? join(MANIFEST_DIR, `${videoId}.json`)
    : join(MANIFEST_PROCESSES_DIR, `${videoId}.json`);
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const target = isGeneral ? 75 : 45;
  const flag = Math.abs(totalSeconds - target) <= 5 ? "OK " : "!! ";
  console.log(
    `  ${flag}[${videoId}] ${totalSeconds}s (objetivo ${target}s) -> ${manifestPath}`,
  );
};

const generalPath = join(ROOT, "content", "general.json");
const processesDir = join(ROOT, "content", "processes");
const processFiles = readdirSync(processesDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

console.log("Generando locucion de la serie...\n");

if (!only || only === "general" || allArg) {
  processVideo(generalPath, true);
}

for (const f of processFiles) {
  const id = f.replace(/\.json$/, "");
  if (only && !allArg && !id.includes(only)) continue;
  processVideo(join(processesDir, f), false);
}

rmSync(TMP_DIR, { recursive: true, force: true });
console.log("\nLocucion lista.\n");
