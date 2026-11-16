import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "./fonts";
import { Background } from "./components/Background";
import { GlassPanel, Hud } from "./components/Chrome";
import { Message } from "./components/Message";
import { RoleBadge } from "./components/RoleBadge";
import { Marca } from "./components/brand";
import { CicloScreen, SCREENS } from "./components/screens";
import { font, layout, palette } from "./theme";
import type { Beat, Scene, VideoData } from "./video-data";

/* ------------------------------------------------------------------ */
/* Mezcla de audio                                                     */
/* ------------------------------------------------------------------ */

const MUSIC_GAIN = 1.15;
const MUSIC_DUCK_DB = 7;
const VOICE_GAIN = 0.75;
const VOICE_TAIL = 0.12;
const DUCK_LEAD = 0.1;
const DUCK_ATTACK = 0.1;
const DUCK_RELEASE = 0.18;

const smoothstep = (x: number): number => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

const duckAt = (beats: Beat[], t: number): number => {
  let duck = 0;
  for (const beat of beats) {
    const start = beat.startMs / 1000 - DUCK_LEAD;
    const end = beat.endMs / 1000 - VOICE_TAIL;
    if (t < start || t > end + DUCK_RELEASE) continue;
    duck = Math.max(
      duck,
      t < end
        ? smoothstep((t - start) / DUCK_ATTACK)
        : 1 - smoothstep((t - end) / DUCK_RELEASE),
    );
  }
  return duck;
};

const MusicBed: React.FC<{ beats: Beat[] }> = ({ beats }) => {
  const { durationInFrames, fps } = useVideoConfig();

  const volume = (frame: number): number => {
    const fade = interpolate(
      frame,
      [0, 24, durationInFrames - 78, durationInFrames],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    const duck = Math.pow(10, (-MUSIC_DUCK_DB * duckAt(beats, frame / fps)) / 20);
    return MUSIC_GAIN * duck * fade;
  };

  return <Audio src={staticFile("music/bed.mp3")} volume={volume} />;
};

/* ------------------------------------------------------------------ */
/* Subtitulos                                                          */
/* ------------------------------------------------------------------ */

const Captions: React.FC<{ beats: Beat[] }> = ({ beats }) => {
  const frame = useCurrentFrame();

  const active = beats.find(
    (b) => frame >= b.startFrame && frame <= b.startFrame + b.durationInFrames + 12,
  );

  if (!active || active.moment === "marca") return null;

  const local = frame - active.startFrame;
  const total = active.durationInFrames;

  const inP = interpolate(local, [0, 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const outP = interpolate(local, [total + 2, total + 12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const opacity = Math.min(inP, outP);
  if (opacity <= 0.001) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        bottom: layout.captionBottom,
        display: "flex",
        justifyContent: "center",
        opacity,
        translate: `0 ${interpolate(inP, [0, 1], [10, 0])}px`,
        zIndex: 50,
      }}
    >
      <div
        style={{
          fontFamily: font.sans,
          fontWeight: 600,
          fontSize: 32,
          lineHeight: 1.34,
          textAlign: "center",
          color: "#FFFFFF",
          background: "rgba(10,11,13,0.76)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          padding: "16px 28px",
          maxWidth: 920,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}
      >
        {active.vo}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Capa de fotografia                                                  */
/* ------------------------------------------------------------------ */

const PhotoLayer: React.FC<{
  src: string;
  durationInFrames: number;
  fadeIn: number;
  fadeOut: number;
  direction: 0 | 1;
}> = ({ src, durationInFrames, fadeIn, fadeOut, direction }) => {
  const frame = useCurrentFrame();

  const inP =
    fadeIn > 0
      ? interpolate(frame, [0, fadeIn], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.quad),
        })
      : 1;

  const outP =
    fadeOut > 0
      ? interpolate(frame, [durationInFrames - fadeOut, durationInFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.quad),
        })
      : 1;

  return (
    <Background
      src={src}
      durationInFrames={durationInFrames}
      direction={direction}
      opacity={Math.min(inP, outP)}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Disposicion del mensaje                                             */
/* ------------------------------------------------------------------ */

type Layout = "panel" | "lower";

const MESSAGE_STYLE: Record<Layout, { box: React.CSSProperties; size: number }> = {
  panel: {
    box: { top: 360, left: 80, width: 920, height: 420, justifyContent: "flex-start" },
    size: 58,
  },
  lower: {
    box: { top: 620, left: 80, width: 920, height: 380, justifyContent: "flex-end" },
    size: 62,
  },
};

/* ------------------------------------------------------------------ */
/* Panel de sistema                                                    */
/* ------------------------------------------------------------------ */

const PanelWrapper: React.FC<{ children: React.ReactNode; durationInFrames: number }> = ({
  children,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const outP = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  return <GlassPanel style={{ opacity: Math.min(inP, outP) }}>{children}</GlassPanel>;
};

/* ------------------------------------------------------------------ */
/* Escena                                                              */
/* ------------------------------------------------------------------ */

const SceneRenderer: React.FC<{ scene: Scene; data: VideoData; index: number }> = ({
  scene,
  data,
  index,
}) => {
  const beat = data.beats.find((b) => b.id === scene.beatIds[0]);
  const isClosing = beat?.moment === "marca";

  // El panel del sistema: uno por escena, con su identificador.
  const ScreenComponent = scene.screen
    ? scene.screen === "ciclo"
      ? () => <CicloScreen activo={11} />
      : SCREENS[scene.screen]
    : null;

  const messageLayout: Layout = scene.screen ? "panel" : "lower";

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Fondo fotografico */}
      {!isClosing ? (
        <PhotoLayer
          src={scene.photo}
          durationInFrames={scene.durationInFrames}
          fadeIn={12}
          fadeOut={12}
          direction={index % 2 === 0 ? 0 : 1}
        />
      ) : null}

      {/* Cierre a pantalla completa */}
      {isClosing ? <Marca /> : null}

      {/* Encabezado */}
      {!isClosing ? (
        <div style={{ position: "absolute", top: 104, left: 80, width: 920, zIndex: 20 }}>
          <Hud chapter={data.title.toUpperCase()} index={data.blockNumber} />
        </div>
      ) : null}

      {/* Rol responsable */}
      {scene.role && !isClosing ? (
        <div style={{ position: "absolute", top: 180, right: 80, zIndex: 30 }}>
          <RoleBadge role={scene.role} durationInFrames={scene.durationInFrames} />
        </div>
      ) : null}

      {/* Mensaje en pantalla */}
      {beat && !isClosing ? (
        <div
          style={{
            position: "absolute",
            ...MESSAGE_STYLE[messageLayout].box,
            zIndex: 20,
          }}
        >
          <Message
            text={beat.onScreen}
            start={4}
            end={scene.durationInFrames - 6}
            size={MESSAGE_STYLE[messageLayout].size}
          />
        </div>
      ) : null}

      {/* Panel del sistema */}
      {ScreenComponent && !isClosing ? (
        <PanelWrapper durationInFrames={scene.durationInFrames}>
          <ScreenComponent />
        </PanelWrapper>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Video completo                                                      */
/* ------------------------------------------------------------------ */

export const VideoComposition: React.FC<{ data: VideoData }> = ({ data }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: palette.void }}>
      {data.scenes.map((scene, i) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationInFrames}
        >
          <SceneRenderer scene={scene} data={data} index={i} />
        </Sequence>
      ))}

      {data.beats.map((beat) => (
        <Audio
          key={beat.id}
          src={staticFile(beat.file)}
          from={beat.startFrame}
          volume={VOICE_GAIN}
        />
      ))}

      <MusicBed beats={data.beats} />
      <Captions beats={data.beats} />
    </AbsoluteFill>
  );
};
