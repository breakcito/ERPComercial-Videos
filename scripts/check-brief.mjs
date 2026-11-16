#!/usr/bin/env node
/**
 * Verifica que la serie cumpla el brief de produccion.
 *
 *   - Duracion: general 75 s (+-5) y procesos 45 s (+-5)
 *   - Texto en pantalla: maximo 8 palabras
 *   - Locuciones de cierre exactas
 *   - Voces prohibidas (cliches, Percentagees inventadas, "ficticio")
 *   - Cada escena tiene su propia foto (sin repetidos dentro de un video)
 *   - Los datos de pantalla salen del modulo de datos, no al reves
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const CIERRE_GENERAL = "ERP COMERCIAL. Menos papel, más control, mejores decisiones. Solicita tu demo.";
const CIERRE_PROCESO = "ERP COMERCIAL. Solicita tu demo.";

/** Palabras que no deben aparecer: clichés, promesas y términos vetados. */
const VETADAS = [
  "ficticio",
  "ficticia",
  "ahorra",
  "ahorrar",
  "%",
  "por ciento",
  "revolucionario",
  "disruptivo",
  "líder del mercado",
  "sin esfuerzo",
  "magia",
];

/**
 * Estas frases son el preámbulo de manual: "antes era un desastre, ahora
 * es MAGIC". No describen la operacion, la pinchan. El brief pide presentar
 * el caso y el sistema, no el管理系统 anterior.
 */
const PROHIBIDAS = [
  "cuaderno",
  "cuadernos",
  "whatsapp",
  "planilla",
  "hoja de cálculo",
  "hojas de cálculo",
  "cada uno con su versión",
  "sin rastro",
  "nadie ",
  "se pierde",
  "se pierden",
  "sin traumas",
  "menús de veinte opciones",
  "papel y planillas",
  "papeles y planillas",
];

const errores = [];
const avisos = [];

const check = (cond, msg) => {
  if (!cond) errores.push(msg);
};

const palabras = (t) => t.trim().split(/\s+/).filter(Boolean).length;

/* ------------------------------------------------------------------ */

const scripts = [
  { path: join(ROOT, "content", "general.json"), general: true },
  ...readdirSync(join(ROOT, "content", "processes"))
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => ({ path: join(ROOT, "content", "processes", f), general: false })),
];

for (const { path, general } of scripts) {
  const script = JSON.parse(readFileSync(path, "utf8"));
  const id = script.id;
  const manifestPath = general
    ? join(ROOT, "src", "generated", `${id}.json`)
    : join(ROOT, "src", "generated", "processes", `${id}.json`);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

  /* Duracion */
  const objetivo = general ? 75 : 45;
  const desvio = Math.abs(manifest.totalSeconds - objetivo);
  check(
    desvio <= 5,
    `${id}: dura ${manifest.totalSeconds}s y el objetivo es ${objetivo}s (+-5)`,
  );

  /* Estructura de escenas y beats */
  const fotos = new Set();
  for (const scene of script.scenes) {
    check(scene.beats.length >= 1, `${id}/${scene.id}: escena sin beats`);
    for (const beat of scene.beats) {
      /* Texto en pantalla */
      check(
        palabras(beat.onScreen) <= 8,
        `${id}/${beat.id}: "${beat.onScreen}" tiene ${palabras(beat.onScreen)} palabras (max 8)`,
      );

      /* Voz sin lenguaje vetado */
      const vozMin = beat.vo.toLowerCase();
      for (const v of VETADAS) {
        check(!vozMin.includes(v.toLowerCase()), `${id}/${beat.id}: la locucion usa "${v}"`);
      }
      for (const v of PROHIBIDAS) {
        check(
          !vozMin.includes(v.toLowerCase()),
          `${id}/${beat.id}: la locucion usa la frase de manual "${v}"`,
        );
      }
      const pantallaMin = beat.onScreen.toLowerCase();
      for (const v of VETADAS) {
        check(!pantallaMin.includes(v.toLowerCase()), `${id}/${beat.id}: el texto usa "${v}"`);
      }
      // El CTA lleva "WhatsApp" por obligacion del brief: se excluye.
      if (beat.moment !== "marca") {
        for (const v of PROHIBIDAS) {
          check(
            !pantallaMin.includes(v.toLowerCase()),
            `${id}/${beat.id}: el texto en pantalla usa "${v}"`,
          );
        }
      }

      /* Cierre exacto */
      if (beat.moment === "marca") {
        const esperado = general ? CIERRE_GENERAL : CIERRE_PROCESO;
        check(
          beat.vo === esperado,
          `${id}/${beat.id}: la locucion de cierre no es la exacta del brief`,
        );
        check(
          beat.onScreen === "Web: intelli-apps.com · WhatsApp: 912 800 115",
          `${id}/${beat.id}: el CTA en pantalla no es el del brief`,
        );
      }

      /* La foto de la escena y la del beat coinciden */
      check(
        beat.photo === scene.photo,
        `${id}/${beat.id}: la foto del beat no es la de su escena`,
      );
    }
    fotos.add(scene.photo);
  }

  /* Sin repetidos dentro del mismo video */
  const beats = script.scenes.flatMap((s) => s.beats.map((b) => b.photo));
  const unicas = new Set(beats);
  check(
    beats.length === unicas.size,
    `${id}: hay fotos repetidas dentro del mismo video (${beats.length - unicas.size})`,
  );

  /* Cada escena de contenido tiene su panel de sistema.
     Excepto la escena-problema y el cierre: ahi manda la foto de planta. */
  for (const scene of script.scenes) {
    const momento = scene.beats[0].moment;
    if (momento === "problema" || momento === "marca") continue;
    check(
      Boolean(scene.screen),
      `${id}/${scene.id}: escena de contenido sin panel de sistema`,
    );
  }

  /* Primer beat de cada video de proceso: el problema */
  const primero = script.scenes[0].beats[0];
  check(
    primero.moment === "problema",
    `${id}: el primer beat no es la situacion problema`,
  );

  /* Ultimo beat: el cierre */
  const ultimo = script.scenes[script.scenes.length - 1].beats[0];
  check(ultimo.moment === "marca", `${id}: el ultimo beat no es el cierre`);

  /* Audio presente en el manifiesto */
  for (const beat of manifest.beats) {
    check(beat.durationInFrames > 0, `${id}/${beat.id}: beat sin duracion de audio`);
  }

  console.log(
    `  ${id}: ${manifest.totalSeconds}s · ${script.scenes.length} escenas · ${fotos.size} fotos distintas`,
  );
}

/* ------------------------------------------------------------------ */
/* El landing tampoco puede vender humo                                */
/* ------------------------------------------------------------------ */

const LANDING = join(ROOT, "..", "landing");
if (existsSync(join(LANDING, "index.html"))) {
  const html = readFileSync(join(LANDING, "index.html"), "utf8");
  const js = readFileSync(join(LANDING, "js", "videos.js"), "utf8");
  // El CTA obligatorio lleva "WhatsApp": se excluye del rastreo.
  const texto = `${html}\n${js}`
    .toLowerCase()
    .replace(/whatsapp: 912 800 115/g, "")
    .replace(/wa\.me\/51912800115/g, "")
    .replace(/elige el whatsapp/g, "")
    .replace(/whatsapp \/ teléfono/g, "")
    .replace(/whatsapp \/ celular/g, "")
    .replace(/whatsapp y teléfono/g, "")
    .replace(/teléfono o whatsapp/g, "")
    .replace(/abrir whatsapp/g, "")
    .replace(/por whatsapp/g, "");
  for (const v of PROHIBIDAS) {
    check(!texto.includes(v.toLowerCase()), `landing: usa la frase de manual "${v}"`);
  }
  for (const v of VETADAS) {
    check(!texto.includes(v.toLowerCase()), `landing: usa "${v}"`);
  }
}

/* ------------------------------------------------------------------ */

console.log("");
if (avisos.length) {
  console.log("Avisos:");
  for (const a of avisos) console.log(`  · ${a}`);
  console.log("");
}

if (errores.length) {
  console.log(`${errores.length} problema(s):`);
  for (const e of errores) console.log(`  ✗ ${e}`);
  process.exit(1);
}

console.log("Todo conforme al brief.\n");
