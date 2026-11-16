import React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, font, palette } from "../theme";

/**
 * Carta de cierre de la serie: marca, lema y contacto.
 * Es la misma en los 14 videos: es lo que hace que la serie se lea como
 * una sola pieza.
 */
export const Marca: React.FC = () => {
  const frame = useCurrentFrame();

  const p = interpolate(frame, [4, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const logoP = interpolate(frame, [34, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const ctaP = interpolate(frame, [46, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const lema = ["Menos papel,", "más control,", "mejores decisiones."];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        // Degradado suave en vez de negro plano: la carta final respira.
        background:
          "radial-gradient(120% 78% at 50% 44%, #14171C 0%, #0A0B0E 55%, #07080A 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 26,
          opacity: p,
          translate: `0 ${interpolate(p, [0, 1], [26, 0])}px`,
        }}
      >
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: 24,
            background: `linear-gradient(150deg, ${palette.amberBright}, ${palette.amberDeep})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: `0 16px 50px ${palette.amberGlow}`,
          }}
        >
          <div style={{ width: 54, height: 8, background: "#120C04" }} />
          <div style={{ width: 38, height: 8, background: "#120C04" }} />
          <div style={{ width: 22, height: 8, background: "#120C04" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              fontFamily: font.sans,
              fontWeight: 800,
              fontSize: 66,
              letterSpacing: "0.02em",
              color: palette.text,
              lineHeight: 1,
            }}
          >
            {brand.name}
          </div>
          <div
            style={{
              fontFamily: font.sans,
              fontWeight: 500,
              fontSize: 23,
              letterSpacing: "0.02em",
              color: palette.textDim,
            }}
          >
            {brand.fullName}
          </div>
        </div>
      </div>

      <div
        style={{
          width: 160,
          height: 2,
          background: palette.amber,
          opacity: p * 0.85,
          transform: `scaleX(${p})`,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        {lema.map((w, i) => {
          const wp = interpolate(frame, [18 + i * 8, 18 + i * 8 + 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div
              key={w}
              style={{
                fontFamily: font.sans,
                fontWeight: 600,
                fontSize: 33,
                color: palette.textDim,
                opacity: wp,
                translate: `0 ${interpolate(wp, [0, 1], [16, 0])}px`,
              }}
            >
              {w}
            </div>
          );
        })}
      </div>

      {/* El logotipo de IntelliApps va sobre ficha blanca: su tipografia es
          azul marino y no contrasta con el fondo oscuro. */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          padding: "22px 38px",
          display: "flex",
          alignItems: "center",
          opacity: logoP,
          translate: `0 ${interpolate(logoP, [0, 1], [18, 0])}px`,
          boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
        }}
      >
        <Img
          src={staticFile("brand/logo.svg")}
          style={{ width: 320, height: "auto", display: "block" }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: font.sans,
          fontSize: 26,
          fontWeight: 500,
          color: palette.text,
          opacity: ctaP,
          translate: `0 ${interpolate(ctaP, [0, 1], [14, 0])}px`,
        }}
      >
        <span style={{ color: palette.textMute }}>Web:</span>
        <span style={{ fontWeight: 600 }}>{brand.web}</span>
        <span style={{ color: palette.textMute, margin: "0 4px" }}>·</span>
        <span style={{ color: palette.textMute }}>WhatsApp:</span>
        <span style={{ fontWeight: 600 }}>{brand.phone}</span>
      </div>
    </div>
  );
};
