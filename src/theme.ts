/**
 * Sistema visual del video.
 *
 * Paleta: gris carbon y negro, con acento dorado/ambar.
 * Tipografia: Inter (interfaz y titulos) + JetBrains Mono (datos tabulares).
 */

/** Nombre comercial del sistema. Aparece en el encabezado de cada video. */
export const brand = {
  /** Nombre corto para encabezados. */
  short: "ERP COMERCIAL",
  /** Nombre largo para la portada y el cierre. */
  name: "ERP COMERCIAL",
  fullName: "ERP para comercializadoras de minerales",
  company: "IntelliApps - Soluciones Informáticas",
  tagline: "Menos papel, más control, mejores decisiones.",
  web: "intelli-apps.com",
  phone: "912 800 115",
} as const;

export const palette = {
  void: "#07080A",
  coal: "#0C0D10",
  surface: "#131519",
  surfaceAlt: "#191C21",
  surfaceHigh: "#21252B",
  line: "#282C33",
  lineSoft: "#1D2126",
  text: "#F4F5F7",
  textDim: "#A6ABB4",
  textMute: "#6B717B",
  amber: "#E0A247",
  amberBright: "#F5C77C",
  amberDeep: "#8F5F1E",
  amberGlow: "rgba(224, 162, 71, 0.18)",
  green: "#4FAE83",
  greenGlow: "rgba(79, 174, 131, 0.16)",
  red: "#CE5B50",
  redGlow: "rgba(206, 91, 80, 0.16)",
  steel: "#6C93C8",
} as const;

export const font = {
  sans: "Inter",
  mono: "JetBrainsMono",
} as const;

/** Medidas del montaje (respetan la zona segura: 80 px lateral, 100 arriba y abajo). */
export const layout = {
  /** Encabezado: chip de modulo a la izquierda, marca a la derecha. */
  headerTop: 104,
  headerHeight: 50,
  /** Columna de contenido (respeta la zona segura lateral de 80 px). */
  contentLeft: 80,
  contentWidth: 920,
  /** Mensaje en pantalla sobre la fotografia. */
  messageTop: 600,
  messageHeight: 300,
  /** Panel del ERP. */
  panelTop: 1000,
  panelLeft: 90,
  panelWidth: 900,
  panelHeight: 600,
  /** Posicion del panel de resumen del gancho. */
  hookPanelTop: 1400,
  /** Cierre: logotipo, mensaje y franja de modulos. */
  closeLogoTop: 880,
  closeMessageTop: 1070,
  closeMessageHeight: 240,
  closeStripTop: 1340,
  /** Subtitulos. */
  captionBottom: 128,
} as const;
