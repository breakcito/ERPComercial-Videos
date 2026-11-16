import { ReactNode } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { font, palette } from "../theme";

/**
 * Primitivas visuales de los paneles de sistema.
 *
 * Todo esta dimensionado para el panel de 1080x600 (GlassPanel): el area
 * util es de 960 px de ancho por unos 520 de alto, con la barra superior
 * de la pantalla incluida.
 */

/** Entrada suave de un bloque. */
export const Enter: React.FC<{
  delay?: number;
  children: ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        opacity: p,
        translate: `0 ${interpolate(p, [0, 1], [20, 0])}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Label: React.FC<{ children: ReactNode; color?: string }> = ({
  children,
  color = palette.textMute,
}) => (
  <div
    style={{
      fontFamily: font.sans,
      fontWeight: 600,
      fontSize: 15,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{ label: string; tone?: string }> = ({
  label,
  tone = "dim",
}) => {
  const color =
    tone === "amber"
      ? palette.amberBright
      : tone === "green"
        ? palette.green
        : tone === "steel"
          ? palette.steel
          : tone === "red"
            ? palette.red
            : palette.textMute;
  const bg =
    tone === "amber"
      ? "rgba(224,162,71,0.12)"
      : tone === "green"
        ? palette.greenGlow
        : tone === "steel"
          ? "rgba(108,147,200,0.14)"
          : tone === "red"
            ? palette.redGlow
            : "rgba(255,255,255,0.05)";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 32,
        padding: "0 14px",
        borderRadius: 9,
        background: bg,
        border: `1px solid ${color}44`,
        fontFamily: font.sans,
        fontWeight: 600,
        fontSize: 16,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};

export const Row: React.FC<{ children: ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 0",
      borderBottom: `1px solid ${palette.lineSoft}`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Foot: React.FC<{ children: ReactNode; tone?: string }> = ({
  children,
  tone = "dim",
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "16px 22px",
      borderRadius: 14,
      background:
        tone === "amber"
          ? "rgba(224,162,71,0.10)"
          : tone === "green"
            ? palette.greenGlow
            : palette.surfaceAlt,
      border: `1px solid ${tone === "amber" ? "rgba(224,162,71,0.34)" : palette.lineSoft}`,
    }}
  >
    {children}
  </div>
);

/** Contenedor de pantalla: reparte el alto entre cabecera, cuerpo y pie. */
export const Screen: React.FC<{ children: ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 14,
      height: "100%",
      justifyContent: "space-between",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Barra superior de la ventana: nombre del modulo y una pista de estado. */
export const AppBar: React.FC<{ title: string; right?: ReactNode }> = ({
  title,
  right,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 14,
      borderBottom: `1px solid ${palette.line}`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: 3,
          background: palette.amber,
          boxShadow: `0 0 10px ${palette.amber}`,
        }}
      />
      <div
        style={{
          fontFamily: font.sans,
          fontWeight: 700,
          fontSize: 25,
          color: palette.text,
        }}
      >
        {title}
      </div>
    </div>
    {right ? <div>{right}</div> : null}
  </div>
);

/** Columna clave-valor: la etiqueta arriba, el valor debajo. */
export const KV: React.FC<{
  label: string;
  value: string;
  width?: number | string;
  mono?: boolean;
  color?: string;
  size?: number;
}> = ({ label, value, width, mono = false, color = palette.text, size = 21 }) => (
  <div style={{ width, minWidth: 0 }}>
    <div
      style={{
        fontFamily: font.sans,
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: palette.textMute,
        marginBottom: 5,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: mono ? font.mono : font.sans,
        fontWeight: mono ? 500 : 600,
        fontSize: size,
        color,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </div>
  </div>
);

/** Tarjeta de cifra grande. */
export const Stat: React.FC<{
  label: string;
  value: string;
  unit?: string;
  color?: string;
  width?: number | string;
}> = ({ label, value, unit, color = palette.amberBright, width }) => (
  <div
    style={{
      width,
      padding: "14px 18px",
      borderRadius: 12,
      background: palette.surfaceAlt,
      border: `1px solid ${palette.line}`,
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}
  >
    <Label>{label}</Label>
    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
      <div
        style={{
          fontFamily: font.mono,
          fontWeight: 500,
          fontSize: 30,
          color,
        }}
      >
        {value}
      </div>
      {unit ? (
        <div style={{ fontFamily: font.sans, fontSize: 16, color: palette.textMute }}>
          {unit}
        </div>
      ) : null}
    </div>
  </div>
);

/** Cabecera de tabla. */
export const Th: React.FC<{ children: ReactNode; width?: number | string; align?: "left" | "right" }> = ({
  children,
  width,
  align = "left",
}) => (
  <div
    style={{
      width,
      fontFamily: font.sans,
      fontWeight: 600,
      fontSize: 14,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: palette.textMute,
      textAlign: align,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

/** Celda de tabla. */
export const Td: React.FC<{
  children: ReactNode;
  width?: number | string;
  align?: "left" | "right";
  mono?: boolean;
  color?: string;
  size?: number;
}> = ({ children, width, align = "left", mono = false, color = palette.text, size = 20 }) => (
  <div
    style={{
      width,
      fontFamily: mono ? font.mono : font.sans,
      fontWeight: mono ? 500 : 600,
      fontSize: size,
      color,
      textAlign: align,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }}
  >
    {children}
  </div>
);

/** Baraja de formulario: etiqueta a la izquierda, valor a la derecha. */
export const FormRow: React.FC<{
  label: string;
  value: string;
  tone?: "amber" | "green" | "steel" | "plain";
}> = ({ label, value, tone = "plain" }) => {
  const color =
    tone === "amber"
      ? palette.amberBright
      : tone === "green"
        ? palette.green
        : tone === "steel"
          ? palette.steel
          : palette.text;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 18,
        padding: "11px 0",
        borderBottom: `1px solid ${palette.lineSoft}`,
      }}
    >
      <div style={{ fontFamily: font.sans, fontSize: 19, color: palette.textDim }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: font.sans,
          fontWeight: 600,
          fontSize: 20,
          color,
          textAlign: "right",
        }}
      >
        {value}
      </div>
    </div>
  );
};

/** Marca de agua: checks en verde para lo que ya quedo registrado. */
export const Check: React.FC<{ size?: number; color?: string; delay?: number }> = ({
  size = 30,
  color = palette.green,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity: p, flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill={color} fillOpacity="0.18" />
      <path
        d="M6.5 12.4 L10 15.9 L17.4 8.5"
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="22"
        strokeDashoffset={22 * (1 - p)}
      />
    </svg>
  );
};

/** Punto de atencion con halo, para marcar el dato clave. */
export const Pulse: React.FC<{ color?: string; size?: number }> = ({
  color = palette.amber,
  size = 12,
}) => {
  const frame = useCurrentFrame();
  const k = 0.5 + 0.5 * Math.sin((frame / 11) * Math.PI * 2);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 99,
        background: color,
        boxShadow: `0 0 ${8 + k * 14}px ${color}`,
        transform: `scale(${1 + k * 0.2})`,
        flexShrink: 0,
      }}
    />
  );
};

/** Separador con titulo de seccion. */
export const SectionTitle: React.FC<{ children: ReactNode; right?: ReactNode }> = ({
  children,
  right,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 2,
    }}
  >
    <Label color={palette.amberBright}>{children}</Label>
    {right}
  </div>
);
