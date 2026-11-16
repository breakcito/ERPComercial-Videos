import { Easing, interpolate, useCurrentFrame } from "remotion";
import { font, palette } from "../theme";

/**
 * Mensaje en pantalla de un beat: entra con un desplazamiento corto,
 * se mantiene legible y sale antes de que entre el siguiente.
 */
export const Message: React.FC<{
  text: string;
  start: number;
  end: number;
  size?: number;
  hero?: boolean;
  align?: "left" | "center";
  accentBar?: boolean;
  accent?: string;
}> = ({
  text,
  start,
  end,
  size = 62,
  hero = false,
  align = "left",
  accentBar = true,
  accent,
}) => {
  const frame = useCurrentFrame();

  const inP = interpolate(frame, [start, start + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const outP = interpolate(frame, [end - 9, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const opacity = Math.min(inP, outP);
  if (opacity <= 0.001) return null;

  const shift = interpolate(inP, [0, 1], [26, 0]);

  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        alignItems: "flex-start",
        justifyContent: align === "center" ? "center" : "flex-start",
        opacity,
        translate: `0 ${shift}px`,
      }}
    >
      {accentBar ? (
        <div
          style={{
            width: 6,
            alignSelf: "stretch",
            minHeight: hero ? size * 1.1 : size * 1.15,
            background: `linear-gradient(180deg, ${accent ?? palette.amberBright}, ${accent ?? palette.amberDeep})`,
            boxShadow: `0 0 22px ${accent ?? palette.amberGlow}`,
            flexShrink: 0,
          }}
        />
      ) : null}

      <div
        style={{
          fontFamily: font.sans,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1.14,
          letterSpacing: "-0.022em",
          color: palette.text,
          textAlign: align,
          maxWidth: 840,
          textWrap: "balance",
          textShadow: "0 6px 34px rgba(0,0,0,0.75)",
        }}
      >
        {text}
      </div>
    </div>
  );
};
