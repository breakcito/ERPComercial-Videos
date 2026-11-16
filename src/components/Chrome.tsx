import { Easing, interpolate, useCurrentFrame } from "remotion";
import { brand, font, palette } from "../theme";

/**
 * Encabezado permanente: el reloj del turno a la izquierda y la marca a la
 * derecha. El reloj es el hilo visual del video.
 */
export const Hud: React.FC<{ chapter: string | null; index: string | null }> = ({
  chapter,
  index,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: p,
      }}
    >
      {chapter ? (
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 9,
              height: 9,
              background: palette.amber,
              boxShadow: `0 0 12px ${palette.amber}`,
            }}
          />
          <div
            style={{
              fontFamily: font.mono,
              fontSize: 22,
              letterSpacing: "0.08em",
              color: palette.amberBright,
            }}
          >
            {index}
          </div>
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.22)" }} />
          <div
            style={{
              fontFamily: font.sans,
              fontWeight: 600,
              fontSize: 20,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: palette.textDim,
            }}
          >
            {chapter}
          </div>
        </div>
      ) : (
        <div />
      )}

      <div
        style={{
          fontFamily: font.sans,
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: "0.22em",
          color: "rgba(244,245,247,0.68)",
        }}
      >
        {brand.short}
      </div>
    </div>
  );
};

/**
 * Panel de cristal del sistema. Va pegado al borde inferior, sin bordes
 * redondeados ni sombra: se lee como una pantalla, no como una tarjeta
 * pegada encima de la foto.
 */
export const GlassPanel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: 1000,
      height: 600,
      background: "linear-gradient(180deg, rgba(8,9,11,0.82) 0%, rgba(6,7,9,0.96) 30%)",
      backdropFilter: "blur(16px)",
      borderTop: `1px solid ${palette.amber}33`,
      boxShadow: `0 -30px 70px rgba(0,0,0,0.55), inset 0 1px 0 ${palette.amber}22`,
      padding: "40px 60px 34px",
      ...style,
    }}
  >
    {children}
  </div>
);
