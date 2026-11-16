import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { font } from "../theme";

export const RoleBadge: React.FC<{
  role: string;
  durationInFrames?: number;
}> = ({ role, durationInFrames = 120 }) => {
  const frame = useCurrentFrame();

  // Entrada suave (0.4s) y salida suave (0.5s)
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 16, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    },
  );

  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 18px",
        background: "rgba(15, 18, 24, 0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 8,
        border: "1px solid rgba(255, 255, 255, 0.16)",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
        opacity,
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255, 255, 255, 0.75)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span
        style={{
          fontFamily: font.sans,
          fontWeight: 600,
          fontSize: 18,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#E2E8F0",
        }}
      >
        {role}
      </span>
    </div>
  );
};
