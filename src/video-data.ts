import generalScript from "../content/general.json";
import generalManifest from "./generated/00-general.json";
import script01 from "../content/processes/01-programacion-unidades.json";
import script02 from "../content/processes/02-recepcion-unidades.json";
import script03 from "../content/processes/03-recepcion-visitas.json";
import script04 from "../content/processes/04-balanza.json";
import script05 from "../content/processes/05-validacion-distribucion.json";
import script06 from "../content/processes/06-guias.json";
import script07 from "../content/processes/07-cierre-leyes.json";
import script08 from "../content/processes/08-valorizacion-compra.json";
import script09 from "../content/processes/09-blending.json";
import script10 from "../content/processes/10-programacion-despachos.json";
import script11 from "../content/processes/11-valorizacion-venta.json";
import script12 from "../content/processes/12-anticipos.json";
import script13 from "../content/processes/13-contabilidad.json";
import manifest01 from "./generated/processes/01-programacion-unidades.json";
import manifest02 from "./generated/processes/02-recepcion-unidades.json";
import manifest03 from "./generated/processes/03-recepcion-visitas.json";
import manifest04 from "./generated/processes/04-balanza.json";
import manifest05 from "./generated/processes/05-validacion-distribucion.json";
import manifest06 from "./generated/processes/06-guias.json";
import manifest07 from "./generated/processes/07-cierre-leyes.json";
import manifest08 from "./generated/processes/08-valorizacion-compra.json";
import manifest09 from "./generated/processes/09-blending.json";
import manifest10 from "./generated/processes/10-programacion-despachos.json";
import manifest11 from "./generated/processes/11-valorizacion-venta.json";
import manifest12 from "./generated/processes/12-anticipos.json";
import manifest13 from "./generated/processes/13-contabilidad.json";

export type Beat = {
  id: string;
  sceneId: string;
  file: string;
  startFrame: number;
  durationInFrames: number;
  startMs: number;
  endMs: number;
  layout: "panel" | "lower" | "center";
  moment: string | null;
  vo: string;
  onScreen: string;
  photo: string;
};

export type Scene = {
  id: string;
  photo: string;
  screen: string | null;
  role: string | null;
  startFrame: number;
  durationInFrames: number;
  beatIds: string[];
};

export type VideoData = {
  id: string;
  title: string;
  block: string;
  blockNumber: string;
  fps: number;
  totalFrames: number;
  totalSeconds: number;
  brand: { name: string; fullName: string; tagline: string };
  scenes: Scene[];
  beats: Beat[];
};

type RawScene = {
  id: string;
  photo: string;
  role?: string | null;
  screen?: string | null;
  beats: {
    id: string;
    photo: string;
    layout: string;
    moment?: string | null;
    vo: string;
    onScreen: string;
  }[];
};

type RawScript = {
  id: string;
  title: string;
  block: string;
  blockNumber: string;
  brand: { name: string; fullName: string; tagline: string };
  scenes: RawScene[];
};

type RawManifest = {
  fps: number;
  totalFrames: number;
  totalSeconds: number;
  beats: {
    id: string;
    file: string;
    startFrame: number;
    durationInFrames: number;
    startMs: number;
    endMs: number;
  }[];
  scenes: {
    id: string;
    startFrame: number;
    durationInFrames: number;
    beatIds: string[];
  }[];
};

const build = (script: RawScript, manifest: RawManifest): VideoData => {
  const beats: Beat[] = script.scenes.flatMap((s) =>
    s.beats.map((b) => {
      const timed = manifest.beats.find((t) => t.id === b.id)!;
      return {
        id: b.id,
        sceneId: s.id,
        file: timed.file,
        startFrame: timed.startFrame,
        durationInFrames: timed.durationInFrames,
        startMs: timed.startMs,
        endMs: timed.endMs,
        layout: b.layout as Beat["layout"],
        moment: b.moment ?? null,
        vo: b.vo,
        onScreen: b.onScreen,
        photo: b.photo,
      };
    }),
  );

  const scenes: Scene[] = manifest.scenes.map((s) => {
    const raw = script.scenes.find((x) => x.id === s.id)!;
    return {
      id: s.id,
      photo: raw.photo,
      screen: raw.screen ?? null,
      role: raw.role ?? null,
      startFrame: s.startFrame,
      durationInFrames: s.durationInFrames,
      beatIds: s.beatIds,
    };
  });

  return {
    id: script.id,
    title: script.title,
    block: script.block,
    blockNumber: script.blockNumber,
    fps: manifest.fps,
    totalFrames: manifest.totalFrames,
    totalSeconds: manifest.totalSeconds,
    brand: script.brand,
    scenes,
    beats,
  };
};

export const VIDEOS: VideoData[] = [
  build(generalScript as unknown as RawScript, generalManifest as unknown as RawManifest),
  build(script01 as unknown as RawScript, manifest01 as unknown as RawManifest),
  build(script02 as unknown as RawScript, manifest02 as unknown as RawManifest),
  build(script03 as unknown as RawScript, manifest03 as unknown as RawManifest),
  build(script04 as unknown as RawScript, manifest04 as unknown as RawManifest),
  build(script05 as unknown as RawScript, manifest05 as unknown as RawManifest),
  build(script06 as unknown as RawScript, manifest06 as unknown as RawManifest),
  build(script07 as unknown as RawScript, manifest07 as unknown as RawManifest),
  build(script08 as unknown as RawScript, manifest08 as unknown as RawManifest),
  build(script09 as unknown as RawScript, manifest09 as unknown as RawManifest),
  build(script10 as unknown as RawScript, manifest10 as unknown as RawManifest),
  build(script11 as unknown as RawScript, manifest11 as unknown as RawManifest),
  build(script12 as unknown as RawScript, manifest12 as unknown as RawManifest),
  build(script13 as unknown as RawScript, manifest13 as unknown as RawManifest),
];

export const VIDEO_BY_ID = new Map(VIDEOS.map((v) => [v.id, v]));
