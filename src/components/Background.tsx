import { CSSProperties } from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { palette } from "../theme";

/**
 * Fondo fotografico a sangre completa, con movimiento lento (Ken Burns)
 * y veladuras que abren sitio a la interfaz y a los textos.
 */
export const Background: React.FC<{
  src: string;
  durationInFrames: number;
  /** 0 = zoom hacia adentro, 1 = hacia afuera. */
  direction?: 0 | 1;
  opacity?: number;
  /** Vello de color: el frio para los problemas, el calido para el turno. */
  tint?: { color: string; opacity: number } | null;
  style?: CSSProperties;
}> = ({ src, durationInFrames, direction = 0, opacity = 1, tint = null, style }) => {
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [0, durationInFrames], direction === 0 ? [1.02, 1.12] : [1.12, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.32, 0, 0.2, 1),
  });

  const panX = interpolate(frame, [0, durationInFrames], direction === 0 ? [0, -26] : [0, 26], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.32, 0, 0.2, 1),
  });

  const panY = interpolate(frame, [0, durationInFrames], direction === 0 ? [0, 18] : [0, -18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.32, 0, 0.2, 1),
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: palette.void, opacity, ...style }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: `${zoom}`,
          translate: `${panX}px ${panY}px`,
        }}
      />

      {/* Veladura superior: deja respirar el encabezado. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(7,8,10,0.92) 0%, rgba(7,8,10,0.55) 14%, rgba(7,8,10,0) 34%)",
        }}
      />

      {/* Veladura inferior: campo oscuro para la interfaz. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(7,8,10,0) 34%, rgba(7,8,10,0.72) 47%, rgba(7,8,10,0.96) 58%, #07080A 72%)",
        }}
      />

      {/* Vineta: enfoca el centro y apaga las esquinas. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 78% at 50% 30%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.58) 100%)",
        }}
      />

      {/* Vello de color del acto. */}
      {tint ? (
        <AbsoluteFill
          style={{
            background: tint.color,
            opacity: tint.opacity,
            mixBlendMode: "multiply",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
