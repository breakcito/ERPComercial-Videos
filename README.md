# ERP COMERCIAL · Serie de videos verticales

14 videos verticales (1080x1920) para el ERP COMERCIAL de IntelliApps:
1 video general de 75 s y 13 videos de proceso de 45 s.

## Estructura

```
content/                 Guiones (fuente de verdad)
  general.json             video general
  processes/NN-*.json       un archivo por proceso
src/
  data.ts                  Datos ficticios de la serie (proveedores, lotes, importes)
  components/
    screens.tsx             Los 14 prototipos de pantalla del sistema
    ui.tsx                  Primitivas de los paneles
    brand.tsx               Carta de cierre
    Background/Chrome/...   Fondo, encabezado, mensaje, rol
  VideoComposition.tsx    Renderizador comun a los 14 videos
  video-data.ts            Une guiones + manifiesto de tiempos
  generated/               Manifiestos con los tiempos de cada beat
public/
  plant/                    82 fotografias de planta (una por escena)
  vo/                       Locucion sintetizada, un mp3 por beat
  music/bed.mp3             Cama musical de la serie
  brand/                    Logos de IntelliApps
  fonts/                    Inter + JetBrains Mono
scripts/
  build-content.mjs        Escribe content/ desde la definicion de la serie
  generate-vo.mjs          Sintetiza la locucion (say + ffmpeg) y arma la linea de tiempo
  generate-music.mjs       Sintetiza la cama musical
  render-all.mjs           Exporta los 14 mp4
  prepare-landing.mjs      Version web + miniaturas para el landing
  check-brief.mjs          Verifica que la serie cumpla el brief
```

## Pipeline

```bash
npm install
npm run content     # guiones -> content/
npm run voice       # locucion + manifiesto -> public/vo/, src/generated/
npm run lint        # eslint + tsc
npm run render      # out/00-general.mp4 y out/procesos/*.mp4
node scripts/prepare-landing.mjs   # landing/videos/ + landing/thumbnails/
node scripts/check-brief.mjs       # control de calidad del brief
npm run dev         # Remotion Studio
```

## Locucion

Voz sintetizada de macOS (`Paulina`, es_MX) a 200 wpm, con la misma voz en los
14 videos. La cadena de ffmpeg aplica un leve realce, compresion y normalizacion
de sonoridad para que la voz se entienda sobre la musica.

La cama musical (`public/music/bed.mp3`) es sintetica: osciladores, filtros y
un secuenciador, sin samples ni licencias. Durante la locucion el bajo se
atenua 7 dB de forma automatica.

## Datos

Todos los numeros que aparecen en pantalla salen de `src/data.ts`: el mismo
proveedor, el mismo lote (LT-0001), la misma placa (ABC-123) y la misma guia
(GR-88231) en toda la serie. Los importes se calculan a partir de la ley, el
peso y el precio, de modo que el neto, el valor y el saldo cuadran entre si.

## Control de calidad

`scripts/check-brief.mjs` verifica:

- duracion dentro de +-5 s del objetivo en cada video
- maximo 8 palabras por texto en pantalla
- locucion de cierre exacta y CTA en pantalla identico al brief
- ausencia de cliches, porcentajes inventados y terminos vetados
- ausencia del preambulo de manual: nada de "cuadernos, WhatsApp y planillas",
  "cada uno con su version", "sin rastro", "nadie sabe"
- una foto distinta por escena dentro de cada video
- panel de sistema en toda escena de contenido
- primer beat = situacion problema, ultimo beat = cierre
- el landing tampoco usa esas frases
