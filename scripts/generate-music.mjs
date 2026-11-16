#!/usr/bin/env node
/**
 * Sintetiza la cama musical del video (instrumental, sin letra).
 *
 * Todo se genera en Node puro, sin dependencias y de forma determinista:
 * osciladores, filtros, envolventes y un secuenciador. Sin librerias, sin
 * licencias, sin samples.
 *
 * QUE SUENA ESTO
 * --------------
 * Un groove oscuro y mecanico, no una cama de fondo. Hay bombo, caja,
 * charles, bajo con filtro y un stab sintetico en 16avos: lo que hace que
 * el video tenga pulso. Nada de piano inspirational ni cuerdas de anuncio.
 *
 * El arreglo sigue los capitulos del video:
 *   00-04s  intro       sub, ticks, filtro cerrado
 *   04-16s  groove A    bombo, charles, bajo, pad
 *   16-32s  groove B    entra el stab
 *   32-48s  drive       entra la caja, el bajo se mueve
 *   48-60s  pico        todo + motivo principal
 *   60-66s  break       se cae la percusion, queda pad y stab filtrado
 *   66-72s  build       vuelve la percusion, riser, se abre el filtro
 *   72-78s  cierre      se retira todo y queda el ultimo acorde
 *
 * - Tonalidad: La menor. 120 BPM. Progresion i - VII - VI - V
 *   (Am - G - F - E), la cadencia andaluza: oscura y con tension.
 * - Salida: public/music/bed.mp3
 *
 * MEZCLA CON LA LOCUCION
 * ----------------------
 * El bajo, el stab y el pad se comprimen con el bombo (sidechain), asi que
 * ya suenan movidos. Ademas la locucion se lleva el grave: el bombo es un
 * transitorio (no enmascara), los charles viven en 7 kHz (no enmascaran) y
 * lo que queda en medio se mantiene por debajo de la voz.
 *
 * Uso: node scripts/generate-music.mjs
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "music");
const WAV_PATH = join(OUT_DIR, "bed.wav");
const MP3_PATH = join(OUT_DIR, "bed.mp3");

const SR = 44100;
const BPM = 120;
const SPB = 60 / BPM; // 0.5 s por pulso
const BAR = SPB * 4; // 2 s por compas
const STEPS = 16; // semicorcheas por compas
const STEP = BAR / STEPS; // 0.125 s
const BARS = 39;
const DURATION = BAR * BARS; // 78 s
const N = Math.round(DURATION * SR);

// --- Utilidades ----------------------------------------------------------

const TWO_PI = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Decibelios a factor lineal. */
const db = (d) => Math.pow(10, d / 20);

/** Ruido blanco con semilla fija: el resultado siempre es el mismo. */
const makeNoise = (seed) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s / 0xffffffff) * 2 - 1;
  };
};

/**
 * Filtro de estado variable en topologia ZDF (Zavalishin). Es
 * incondicionalmente estable: el de Chamberlin se dispara con resonancia
 * alta (Q > 3) y devuelve NaN a partir de cierto punto, lo que arruina
 * toda la mezcla.
 */
class SVF {
  constructor() {
    this.ic1 = 0;
    this.ic2 = 0;
  }
  process(x, cutoff, q) {
    const fc = Math.min(cutoff, SR * 0.45);
    const g = Math.tan((Math.PI * fc) / SR);
    const k = 1 / Math.max(0.5, q);
    const a1 = 1 / (1 + g * (g + k));
    const a2 = g * a1;
    const a3 = g * a2;
    const v3 = x - this.ic2;
    const v1 = a1 * this.ic1 + a2 * v3;
    const v2 = this.ic2 + a2 * this.ic1 + a3 * v3;
    this.ic1 = 2 * v1 - this.ic1;
    this.ic2 = 2 * v2 - this.ic2;
    return v2; // salida paso bajo
  }
}

/**
 * Biquad (topologia directa II transpuesta) para la ecualizacion maestra.
 * Se hace aqui y no con ffmpeg para poder normalizar el pico DESPUES del
 * realce: con ffmpeg el realce se aplicaba despues y el archivo se pasaba
 * de 0 dBFS.
 */
class Biquad {
  constructor() {
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;
    this.b0 = 1;
    this.b1 = 0;
    this.b2 = 0;
    this.a1 = 0;
    this.a2 = 0;
  }
  set(type, freq, q, gainDb = 0) {
    const w0 = (TWO_PI * freq) / SR;
    const cw = Math.cos(w0);
    const sw = Math.sin(w0);
    const alpha = sw / (2 * q);
    let b0, b1, b2, a0, a1, a2;
    if (type === "highpass") {
      b0 = (1 + cw) / 2; b1 = -(1 + cw); b2 = (1 + cw) / 2;
      a0 = 1 + alpha; a1 = -2 * cw; a2 = 1 - alpha;
    } else if (type === "peaking") {
      const A = Math.pow(10, gainDb / 40);
      b0 = 1 + alpha * A; b1 = -2 * cw; b2 = 1 - alpha * A;
      a0 = 1 + alpha / A; a1 = -2 * cw; a2 = 1 - alpha / A;
    } else {
      // high shelf (RBJ cookbook)
      const A = Math.pow(10, gainDb / 40);
      const beta = 2 * Math.sqrt(A) * alpha;
      b0 = A * ((A + 1) + (A - 1) * cw + beta);
      b1 = -2 * A * ((A - 1) + (A + 1) * cw);
      b2 = A * ((A + 1) + (A - 1) * cw - beta);
      a0 = (A + 1) - (A - 1) * cw + beta;
      a1 = 2 * ((A - 1) - (A + 1) * cw);
      a2 = (A + 1) - (A - 1) * cw - beta;
    }
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0;
    this.a1 = a1 / a0; this.a2 = a2 / a0;
  }
  process(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1; this.x1 = x;
    this.y2 = this.y1; this.y1 = y;
    return y;
  }
}

/** Filtro paso alto de un polo (para charles y ruido). */
class OnePoleHP {
  constructor(cutoff) {
    this.a = 1 - Math.exp((-TWO_PI * cutoff) / SR);
    this.y = 0;
  }
  process(x) {
    this.y += this.a * (x - this.y);
    return x - this.y;
  }
}

/** Saturacion suave: da cuerpo al bombo y a la caja sin peaking duro. */
const saturate = (x, k = 1.6) => Math.tanh(x * k) / Math.tanh(k);

// --- Notas ---------------------------------------------------------------

const NOTE = {
  E1: 41.2, F1: 43.65, G1: 49.0, A1: 55.0,
  E2: 82.41, F2: 87.31, G2: 98.0, A2: 110.0, B2: 123.47, C3: 130.81,
  D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0,
  B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
  A5: 880.0,
};

/** Falla pronto si alguna nota no existe: un undefined aqui se propaga
 *  como NaN por toda la mezcla y deja el archivo en silencio. */
const checkNotes = (values, where) => {
  for (const v of values) {
    if (typeof v !== "number" || !Number.isFinite(v)) {
      throw new Error(`nota invalida en ${where}: ${v}`);
    }
  }
};

/**
 * La progresion: i - VII - VI - V en La menor. Cada acorde dura un compas
 * y se lleva su bajo, su voz de pad y sus tonos para el stab.
 */
const CHORDS = [
  { name: "Am", bass: NOTE.A1, pad: [NOTE.A3, NOTE.C4, NOTE.E4], stab: [NOTE.A4, NOTE.C5, NOTE.E5, NOTE.A5] },
  { name: "G",  bass: NOTE.G1, pad: [NOTE.G3, NOTE.B3, NOTE.D4], stab: [NOTE.G4, NOTE.B4, NOTE.D5, NOTE.G5] },
  { name: "F",  bass: NOTE.F1, pad: [NOTE.F3, NOTE.A3, NOTE.C4], stab: [NOTE.F4, NOTE.A4, NOTE.C5, NOTE.F5] },
  { name: "E",  bass: NOTE.E1, pad: [NOTE.E3, NOTE.G3 * 1.0595, NOTE.B3], stab: [NOTE.E4, NOTE.G4 * 1.0595, NOTE.B4, NOTE.E5] },
];

/** Motivo principal del tramo pico (notas y duracion en pulsos). */
const LEAD = [
  [NOTE.A4, 1], [NOTE.C5, 1], [NOTE.E5, 1.5], [NOTE.D5, 0.5],
  [NOTE.C5, 1], [NOTE.A4, 1], [NOTE.G4, 1.5], [NOTE.B4, 0.5],
  [NOTE.A4, 2],
];

for (const c of CHORDS) {
  checkNotes(c.pad, `pad de ${c.name}`);
  checkNotes(c.stab, `stab de ${c.name}`);
}
checkNotes(LEAD.map((l) => l[0]), "motivo principal");

// --- Patrones (16 pasos por compas) --------------------------------------
// x = golpe, o = variante, . = silencio

const P = {
  kickA: "x...........x...",
  kickB: "x.......x...x...",
  kickC: "x...x...x...x...",
  kickD: "x..x..x.x..x..x.",
  snare: "....x.......x...",
  hat: "..x...x...x...x.",
  hat8: "x.x.x.x.x.x.x.x.",
  hat16: "x.x.xx.x.x.x.x.",
  bass: "x..x..x...x..x..",
  stab: "x.xx..x.x.xx..x.",
};

/** Convierte un patron en la lista de indices golpeados. */
const hits = (pattern) => {
  const out = [];
  for (let i = 0; i < pattern.length; i++) if (pattern[i] !== ".") out.push(i);
  return out;
};

// --- Secciones del arreglo ----------------------------------------------

/**
 * Cada seccion dice que suena en cada compas. `from` es el compas inicial.
 * `gain` ajusta el nivel de cada capa dentro de la seccion: de ahi sale la
 * dinamica del arreglo, no de subir y bajar el volumen general.
 */
const SECTIONS = [
  { from: 0, name: "intro", kick: null, bass: null, stab: null, snare: null, hat: P.hat, perc: null, lead: null, cutoff: 900,
    gain: { hat: 0.30, pad: 0.28 } },
  { from: 2, name: "grooveA", kick: P.kickA, bass: P.bass, stab: null, snare: null, hat: P.hat, perc: null, lead: null, cutoff: 1800,
    gain: { kick: 0.80, bass: 0.55, hat: 0.55, pad: 0.55 } },
  { from: 8, name: "grooveB", kick: P.kickB, bass: P.bass, stab: P.stab, snare: null, hat: P.hat, perc: null, lead: null, cutoff: 2600,
    gain: { kick: 0.90, bass: 0.72, hat: 0.68, stab: 0.72, pad: 0.65 } },
  { from: 16, name: "drive", kick: P.kickC, bass: P.bass, stab: P.stab, snare: P.snare, hat: P.hat8, perc: null, lead: null, cutoff: 3400,
    gain: { kick: 1.0, bass: 0.88, hat: 0.88, stab: 0.88, snare: 0.80, pad: 0.70 } },
  { from: 24, name: "pico", kick: P.kickC, bass: P.bass, stab: P.stab, snare: P.snare, hat: P.hat16, perc: "industrial", lead: true, cutoff: 5200,
    gain: { kick: 1.0, bass: 0.92, hat: 1.10, stab: 1.0, snare: 0.95, perc: 1.0, lead: 1.0, pad: 0.75 } },
  { from: 30, name: "break", kick: P.kickA, bass: P.bass, stab: P.stab, snare: null, hat: null, perc: null, lead: null, cutoff: 1300,
    gain: { kick: 0.45, bass: 0.40, stab: 1.0, pad: 0.90 } },
  { from: 33, name: "build", kick: P.kickD, bass: P.bass, stab: P.stab, snare: P.snare, hat: P.hat16, perc: "industrial", lead: true, cutoff: 2000,
    gain: { kick: 0.92, bass: 0.82, hat: 0.92, stab: 0.90, snare: 0.85, perc: 0.80, lead: 0.9, pad: 0.66 } },
  { from: 36, name: "cierre", kick: P.kickA, bass: P.bass, stab: null, snare: null, hat: P.hat, perc: null, lead: null, cutoff: 1100,
    gain: { kick: 0.72, bass: 0.60, hat: 0.50, pad: 0.82 } },
];

/** Seccion activa en un compas dado. */
const sectionAt = (bar) => {
  let s = SECTIONS[0];
  for (const sec of SECTIONS) if (bar >= sec.from) s = sec;
  return s;
};

// --- Buffers -------------------------------------------------------------

const layers = {
  kick: new Float32Array(N),
  snare: new Float32Array(N),
  hat: new Float32Array(N),
  perc: new Float32Array(N),
  bass: new Float32Array(N),
  stab: new Float32Array(N),
  pad: new Float32Array(N),
  lead: new Float32Array(N),
  fx: new Float32Array(N),
};

/** Instantes de bombo: se usan para el sidechain y para los fills. */
const kickTimes = [];

// --- 1. Bombo ------------------------------------------------------------
// Sine con caida de tono (130 -> 48 Hz) y un clic de ruido encima.

{
  const noise = makeNoise(20260112);
  for (let bar = 0; bar < BARS; bar++) {
    const sec = sectionAt(bar);
    if (!sec.kick) continue;
    const idxs = hits(sec.kick);
    for (const s of idxs) {
      const t0 = bar * BAR + s * STEP;
      const at = Math.round(t0 * SR);
      const len = Math.round(0.42 * SR);
      kickTimes.push(t0);
      for (let i = 0; i < len && at + i < N; i++) {
        const t = i / SR;
        const f = 48 + 92 * Math.exp(-t * 38);
        const env = Math.exp(-t * 8.5) * (1 - Math.exp(-t * 900));
        const click = i < SR * 0.004 ? noise() * 0.22 * (1 - i / (SR * 0.004)) : 0;
        layers.kick[at + i] += saturate(Math.sin(TWO_PI * f * t) * env * 1.15 + click, 1.4);
      }
    }
  }
}

// --- 2. Caja y charles ---------------------------------------------------

{
  const noise = makeNoise(777001);
  const hp = new OnePoleHP(900);

  for (let bar = 0; bar < BARS; bar++) {
    const sec = sectionAt(bar);
    if (!sec.snare && !sec.hat) continue;
    const t0 = bar * BAR;

    if (sec.snare) {
      for (const s of hits(sec.snare)) {
        const at = Math.round((t0 + s * STEP) * SR);
        // tres golpes de clap muy juntos
        for (const off of [0, 0.011, 0.023]) {
          const a = at + Math.round(off * SR);
          const len = Math.round(0.16 * SR);
          for (let i = 0; i < len && a + i < N; i++) {
            const t = i / SR;
            const env = Math.exp(-t * 34) * (1 - Math.exp(-t * 2000));
            layers.snare[a + i] += hp.process(noise()) * env * 0.5;
          }
        }
        // cuerpo de la caja
        const len = Math.round(0.12 * SR);
        for (let i = 0; i < len && at + i < N; i++) {
          const t = i / SR;
          const env = Math.exp(-t * 42);
          layers.snare[at + i] += Math.sin(TWO_PI * 188 * t) * env * 0.28;
        }
      }
    }

    if (sec.hat) {
      const busy = sec.hat !== P.hat;
      for (const s of hits(sec.hat)) {
        const at = Math.round((t0 + s * STEP) * SR);
        const dur = busy ? 0.055 : 0.035;
        const len = Math.round(dur * SR);
        for (let i = 0; i < len && at + i < N; i++) {
          const t = i / SR;
          const env = Math.exp(-t / (dur * 0.28));
          layers.hat[at + i] += hp.process(noise()) * env * (busy ? 0.14 : 0.16);
        }
      }
    }
  }
}

// --- 3. Percusion metalica ------------------------------------------------
// Solo en el pico: golpes secos y metalicos en los contratiempos.

{
  const noise = makeNoise(5150);
  const hp = new OnePoleHP(3400);
  const hp2 = new OnePoleHP(5200);
  for (let bar = 0; bar < BARS; bar++) {
    const sec = sectionAt(bar);
    if (!sec.perc) continue;
    const t0 = bar * BAR;
    for (const s of [3, 7, 11, 15]) {
      const at = Math.round((t0 + s * STEP) * SR);
      const len = Math.round(0.09 * SR);
      for (let i = 0; i < len && at + i < N; i++) {
        const t = i / SR;
        const env = Math.exp(-t * 46);
        const f = hp2.process(hp.process(noise()));
        layers.perc[at + i] += f * env * 0.55;
      }
    }
  }
}

// --- 4. Bajo -------------------------------------------------------------
// Root con filtro resonante y envolvente por golpe. Es el instrumento que
// lleva el pulso armonico.

{
  const chordAt = (bar) => CHORDS[bar % CHORDS.length];

  for (let bar = 0; bar < BARS; bar++) {
    const sec = sectionAt(bar);
    if (!sec.bass) continue;
    const chord = chordAt(bar);
    const t0 = bar * BAR;

    for (const s of hits(sec.bass)) {
      const at = Math.round((t0 + s * STEP) * SR);
      const len = Math.round(0.3 * SR);
      const f0 = chord.bass;
      // cada tres pasos sube una octava: da movimiento sin romper el bajo
      const oct = s % 6 === 4 ? 2 : 1;
      const svf = new SVF();
      let phase = 0;
      for (let i = 0; i < len && at + i < N; i++) {
        const t = i / SR;
        phase += (TWO_PI * f0 * oct) / SR;
        // sierra suave
        const saw = 2 * (phase / TWO_PI % 1) - 1;
        const env = Math.exp(-t * 7.5) * (1 - Math.exp(-t * 700));
        const cutoff = 180 + 1500 * Math.exp(-t * 16);
        const f = svf.process(saw, cutoff, 3.2);
        layers.bass[at + i] += saturate(f * env * 0.85, 1.5);
      }
    }
  }
}

// --- 5. Stab --------------------------------------------------------------
// Acorde en 16avos con filtro que se cierra rapido. Es la capa "viva".

{
  const chordAt = (bar) => CHORDS[bar % CHORDS.length];

  for (let bar = 0; bar < BARS; bar++) {
    const sec = sectionAt(bar);
    if (!sec.stab) continue;
    const chord = chordAt(bar);
    const t0 = bar * BAR;

    const idxs = hits(sec.stab);
    for (let k = 0; k < idxs.length; k++) {
      const s = idxs[k];
      const at = Math.round((t0 + s * STEP) * SR);
      const len = Math.round(0.22 * SR);
      const freq = chord.stab[(k + bar) % chord.stab.length];
      const svf = new SVF();
      let p1 = 0;
      let p2 = 0;
      for (let i = 0; i < len && at + i < N; i++) {
        const t = i / SR;
        p1 += (TWO_PI * freq) / SR;
        p2 += (TWO_PI * freq * 1.005) / SR; // detune: da grosor
        const saw1 = 2 * (p1 / TWO_PI % 1) - 1;
        const saw2 = 2 * (p2 / TWO_PI % 1) - 1;
        const square = p1 % TWO_PI < Math.PI ? 1 : -1;
        const env = Math.exp(-t * 20) * (1 - Math.exp(-t * 1500));
        const cutoff = 400 + 3800 * Math.exp(-t * 22);
        const f = svf.process(saw1 * 0.5 + saw2 * 0.35 + square * 0.2, cutoff, 4.5);
        layers.stab[at + i] += f * env * 0.5;
      }
    }
  }
}

// --- 6. Pad ---------------------------------------------------------------
// Sierra con detune, filtro lento. Solo da textura; no lleva el ritmo.

{
  const chordAt = (bar) => CHORDS[bar % CHORDS.length];

  for (let bar = 0; bar < BARS; bar++) {
    const chord = chordAt(bar);
    const t0 = bar * BAR;
    const len = Math.round((BAR + 0.4) * SR);
    const at = Math.round(t0 * SR);
    const detunes = [-0.09, 0, 0.1];

    for (let i = 0; i < len && at + i < N; i++) {
      const t = i / SR;
      const attack = smoothstep(0, 0.55, t);
      const release = smoothstep(0, 0.5, BAR + 0.4 - t);
      const env = attack * release;
      if (env <= 0) continue;

      let voice = 0;
      for (const det of detunes) {
        let sum = 0;
        for (const f of chord.pad) {
          const ph = (TWO_PI * f * (1 + det / 100) * t) % TWO_PI;
          // sierra con 5 armonicos: mas cuerpo que un seno
          sum += Math.sin(ph) + 0.4 * Math.sin(ph * 2) + 0.22 * Math.sin(ph * 3);
        }
        voice += sum * 0.33;
      }
      layers.pad[at + i] += voice * env * 0.085;
    }
  }
}

// --- 7. Motivo principal --------------------------------------------------
// Solo en el pico y en el build: es lo que le da una frase al video.
// El motivo dura 10 pulsos (5 s), asi que entra en el compas 24 y en el 33.

{
  const LEAD_BARS = [24, 33];

  for (const bar of LEAD_BARS) {
    const start = Math.round(bar * BAR * SR);
    let pos = start;
    for (const [freq, beats] of LEAD) {
      const len = Math.round(beats * SPB * SR);
      const detune = 1.0035;
      const svf = new SVF();
      let p1 = 0;
      let p2 = 0;
      for (let i = 0; i < len && pos + i < N; i++) {
        const t = i / SR;
        p1 += (TWO_PI * freq) / SR;
        p2 += (TWO_PI * freq * detune) / SR;
        const saw1 = 2 * (p1 / TWO_PI % 1) - 1;
        const saw2 = 2 * (p2 / TWO_PI % 1) - 1;
        const env = Math.min(1, t * 180) * Math.exp(-t * 2.6);
        const f = svf.process(saw1 * 0.6 + saw2 * 0.4, 2200 + 900 * Math.sin(t * 6), 2.2);
        layers.lead[pos + i] += f * env * 0.34;
      }
      pos += len;
    }
  }
}

// --- 8. Fills, risers e impactos -----------------------------------------

{
  const noise = makeNoise(31415);

  // Riser: ruido con filtro que sube, justo antes del pico y del build.
  const risers = [
    { from: 22, to: 24 }, // entrada al pico
    { from: 31, to: 33 }, // entrada al build
  ];
  for (const r of risers) {
    const t0 = r.from * BAR;
    const dur = (r.to - r.from) * BAR;
    const at = Math.round(t0 * SR);
    const len = Math.round(dur * SR);
    const svf = new SVF();
    for (let i = 0; i < len && at + i < N; i++) {
      const t = i / SR;
      const p = t / dur;
      const env = Math.pow(p, 1.6) * 0.30;
      const f = svf.process(noise(), 400 + 6200 * p * p, 1.6);
      layers.fx[at + i] += f * env;
    }
  }

  // Impacto: golpe grave con cola larga en los cambios de seccion.
  const impacts = [2, 8, 16, 24, 30, 33, 36];
  for (const bar of impacts) {
    const at = Math.round(bar * BAR * SR);
    const len = Math.round(1.4 * SR);
    let phase = 0;
    for (let i = 0; i < len && at + i < N; i++) {
      const t = i / SR;
      phase += (TWO_PI * 42) / SR;
      const env = Math.exp(-t * 4.2) * (1 - Math.exp(-t * 200));
      layers.fx[at + i] += Math.sin(phase) * env * 0.55;
    }
  }

  // Crash: ruido largo y brillante al inicio de las secciones grandes.
  for (const bar of [8, 16, 24, 33]) {
    const at = Math.round(bar * BAR * SR);
    const len = Math.round(1.8 * SR);
    const hp = new OnePoleHP(5200);
    for (let i = 0; i < len && at + i < N; i++) {
      const t = i / SR;
      const env = Math.exp(-t * 2.6) * (1 - Math.exp(-t * 700));
      layers.fx[at + i] += hp.process(noise()) * env * 0.20;
    }
  }

  // Fill de caja al final del tramo groove, para no entrar plano.
  for (const bar of [7, 15, 23, 32]) {
    for (let s = 8; s < 16; s++) {
      const at = Math.round((bar * BAR + s * STEP) * SR);
      const len = Math.round(0.1 * SR);
      for (let i = 0; i < len && at + i < N; i++) {
        const t = i / SR;
        const env = Math.exp(-t * 40);
        layers.snare[at + i] += noise() * env * 0.22 * ((s - 7) / 8);
      }
    }
  }
}

// --- Sidechain ------------------------------------------------------------
// El bajo, el stab y el pad bajan con cada bombo. Es lo que hace que el
// groove "respire" en vez de sonar como un bloque plano.

{
  const DEPTH = 0.55;
  const REL = 0.14;
  let lastKick = -10;
  let ki = 0;
  const kicks = kickTimes.slice().sort((a, b) => a - b);

  for (let i = 0; i < N; i++) {
    const t = i / SR;
    while (ki < kicks.length && kicks[ki] <= t) {
      lastKick = kicks[ki];
      ki++;
    }
    const since = t - lastKick;
    const pump = 1 - DEPTH * Math.exp(-since / REL);
    layers.bass[i] *= pump;
    layers.stab[i] *= pump;
    layers.pad[i] *= 1 - (DEPTH * 0.45) * Math.exp(-since / (REL * 1.6));
  }
}

// --- Filtro por seccion ----------------------------------------------------
// El stab se abre y se cierra segun la seccion: en el break suena tapado y
// en el pico abierto. Sin esto el break no se percibe como un break. El
// corte se suaviza para que el cambio de seccion no chasquee.

{
  let cutoff = 900;
  const smooth = 1 - Math.exp((-TWO_PI * 4) / SR); // seguimiento ~4 Hz
  let prev = 0;
  for (let i = 0; i < N; i++) {
    const target = sectionAt(Math.floor(i / SR / BAR)).cutoff;
    cutoff += smooth * (target - cutoff);
    const coeff = 1 - Math.exp((-TWO_PI * cutoff) / SR);
    prev += coeff * (layers.stab[i] - prev);
    layers.stab[i] = prev;
  }
}

// --- Mezcla final ---------------------------------------------------------

if (process.env.DEBUG_MUSIC) {
  const rmsOf = (buf, a, b) => {
    let sum = 0;
    for (let i = a; i < b; i++) sum += buf[i] * buf[i];
    return (10 * Math.log10(sum / Math.max(1, b - a) + 1e-20)).toFixed(1);
  };
  for (let s = 0; s < DURATION; s += 4) {
    const a = Math.round(s * SR);
    const b = Math.min(N, Math.round((s + 4) * SR));
    console.log(
      `  t=${String(s).padStart(2)}s kick=${rmsOf(layers.kick, a, b)} ` +
        `snare=${rmsOf(layers.snare, a, b)} hat=${rmsOf(layers.hat, a, b)} ` +
        `perc=${rmsOf(layers.perc, a, b)} bass=${rmsOf(layers.bass, a, b)} ` +
        `stab=${rmsOf(layers.stab, a, b)} pad=${rmsOf(layers.pad, a, b)} ` +
        `lead=${rmsOf(layers.lead, a, b)} fx=${rmsOf(layers.fx, a, b)}`,
    );
  }
}

const left = new Float32Array(N);
const right = new Float32Array(N);
const FADE_IN = 1.2;
const FADE_OUT = 4.0;

for (let i = 0; i < N; i++) {
  const t = i / SR;
  const bar = Math.floor(t / BAR);
  const sec = sectionAt(bar);
  const g = sec.gain;

  const mono =
    layers.kick[i] * (g.kick ?? 1.0) +
    layers.snare[i] * (g.snare ?? 0.85) +
    layers.hat[i] * (g.hat ?? 0.75) +
    layers.perc[i] * (g.perc ?? 0.7) +
    layers.bass[i] * (g.bass ?? 1.0) +
    layers.stab[i] * (g.stab ?? 0.8) +
    layers.pad[i] * (g.pad ?? 0.8) +
    layers.lead[i] * (g.lead ?? 0.9) +
    layers.fx[i] * 0.8;

  let env = 1;
  if (t < FADE_IN) env *= t / FADE_IN;
  const tail = DURATION - t;
  if (tail < FADE_OUT) env *= Math.max(0, tail / FADE_OUT);

  // Un poco de diferencia stereo: el pad abre, el nucleo se queda centrado.
  const width = 0.05 * Math.sin(TWO_PI * 0.037 * t);
  left[i] = mono * env * (1 + width);
  right[i] = mono * env * (1 - width);
}

// --- Master ---------------------------------------------------------------

// 1) Realce de frecuencia. Se hace antes de normalizar para que el pico
//    final sea el que se pide, no el que deja el realce.
//    - paso alto a 40 Hz: el retumbe de debajo no se oye en un movil.
//    - +1.5 dB a 200 Hz: cuerpo del bajo.
//    - +2 dB a 3 kHz: el ataque de la caja y de los charles.
//    - +1 dB de agudillo desde 6 kHz: brillo.
{
  const hp = new Biquad();
  hp.set("highpass", 40, 0.707);
  const body = new Biquad();
  body.set("peaking", 200, 1.0, 1.5);
  const attack = new Biquad();
  attack.set("peaking", 3000, 1.0, 2.0);
  const air = new Biquad();
  air.set("highshelf", 6000, 0.707, 1.0);

  for (let i = 0; i < N; i++) {
    left[i] = air.process(attack.process(body.process(hp.process(left[i]))));
    right[i] = air.process(attack.process(body.process(hp.process(right[i]))));
  }
}

// 2) Compresor suave en el bus: solo agarra las crestas, para que el groove
//    tenga cuerpo sin aplanar el contraste entre secciones.
{
  const THRESH = 0.62;
  for (let i = 0; i < N; i++) {
    for (const buf of [left, right]) {
      const x = buf[i];
      const a = Math.abs(x);
      if (a <= THRESH) continue;
      const over = (a - THRESH) / (1 - THRESH);
      buf[i] = Math.sign(x) * (THRESH + (1 - THRESH) * Math.tanh(over * 1.15));
    }
  }
}

// 3) Normalizacion a -4 dBFS de pico. LAME se pasa unos 2 dB en los
//    transientes, asi que el pico del mp3 queda alrededor de -1.8 dBFS.
let peak = 0;
for (let i = 0; i < N; i++) {
  if (!Number.isFinite(left[i]) || !Number.isFinite(right[i])) {
    throw new Error(`muestra no finita en ${i} (${i / SR}s): el filtro se disparo`);
  }
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}
const gain = peak > 0 ? db(-4.0) / peak : 1;
for (let i = 0; i < N; i++) {
  left[i] *= gain;
  right[i] *= gain;
}

// --- Escritura del WAV ---------------------------------------------------

const writeWav = (path, channels, sampleRate, frames) => {
  const numChannels = channels.length;
  const dataLength = frames[0].length * numChannels * 2;
  const buffer = Buffer.alloc(44 + dataLength);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * 2, 28);
  buffer.writeUInt16LE(numChannels * 2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataLength, 40);
  let off = 44;
  for (let i = 0; i < frames[0].length; i++) {
    for (let c = 0; c < numChannels; c++) {
      const s = clamp(channels[c][i], -1, 1);
      buffer.writeInt16LE(Math.round(s * 32767), off);
      off += 2;
    }
  }
  writeFileSync(path, buffer);
};

mkdirSync(OUT_DIR, { recursive: true });
writeWav(WAV_PATH, [left, right], SR, [left, right]);

// --- Exportacion ----------------------------------------------------------
// El WAV ya viene ecualizado y normalizado, aqui solo se codifica a mp3.

execFileSync("ffmpeg", [
  "-hide_banner",
  "-loglevel",
  "error",
  "-y",
  "-i",
  WAV_PATH,
  "-c:a",
  "libmp3lame",
  "-b:a",
  "192k",
  MP3_PATH,
]);

console.log(
  `\n  musica: ${BPM} BPM · La menor · ${BARS} compases · ${DURATION.toFixed(1)}s`,
);
console.log(`  -> ${MP3_PATH}\n`);
