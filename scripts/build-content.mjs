#!/usr/bin/env node
/**
 * Genera los guiones de la serie a partir de una unica definicion.
 *
 * Salidas:
 *   content/general.json          -> video general (75 s)
 *   content/processes/NN-*.json   -> un video por proceso (45 s)
 *
 * Cada escena declara: foto de planta, panel de sistema opcional, rol
 * responsable y los beats (locucion + texto en pantalla).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROCESSES_DIR = join(ROOT, "content", "processes");

mkdirSync(PROCESSES_DIR, { recursive: true });

const BRAND = {
  name: "ERP COMERCIAL",
  fullName: "ERP para comercializadoras de minerales",
  tagline: "Menos papel, más control, mejores decisiones.",
};

const CIERRE = {
  id: "b_cierre",
  photo: "plant/cierre-amanecer.jpg",
  layout: "center",
  moment: "marca",
  vo: "ERP COMERCIAL. Solicita tu demo.",
  onScreen: "Web: intelli-apps.com · WhatsApp: 912 800 115",
};

/** Ritmo por tipo de video. */
const TIMING = {
  general: { leadIn: 0.12, pause: 0.5, gap: 0.25, closingPause: 1.7 },
  proceso: { leadIn: 0.22, pause: 1.1, gap: 0.3, closingPause: 1.8 },
};

/* ------------------------------------------------------------------ */
/* Video general                                                       */
/* ------------------------------------------------------------------ */

const GENERAL = {
  brand: BRAND,
  fps: 30,
  id: "00-general",
  title: "El ciclo completo del mineral",
  block: "General",
  blockNumber: "00",
  timing: TIMING.general,
  scenes: [
    {
      id: "s1",
      photo: "plant/g01-cuaderno.jpg",
      role: null,
      screen: null,
      beats: [
        {
          id: "b01",
          photo: "plant/g01-cuaderno.jpg",
          layout: "lower",
          moment: "problema",
          vo: "El mineral se anota en cuadernos, WhatsApp y planillas. Cada uno con su versión.",
          onScreen: "Cada uno con su versión",
        },
      ],
    },
    {
      id: "s2",
      photo: "plant/g02-programacion.jpg",
      role: "Área comercial",
      screen: "programacion",
      beats: [
        {
          id: "b02",
          photo: "plant/g02-programacion.jpg",
          layout: "panel",
          vo: "El área comercial programa la llegada del mineral con todos los datos.",
          onScreen: "Llega programado, con todos los datos",
        },
      ],
    },
    {
      id: "s3",
      photo: "plant/g03-recepcion.jpg",
      role: "Vigilancia",
      screen: "recepcion",
      beats: [
        {
          id: "b03",
          photo: "plant/g03-recepcion.jpg",
          layout: "panel",
          vo: "Vigilancia registra el ingreso y marca la salida del vehículo.",
          onScreen: "Vigilancia registra el ingreso",
        },
      ],
    },
    {
      id: "s4",
      photo: "plant/g04-balanza.jpg",
      role: "Balanza",
      screen: "balanza",
      beats: [
        {
          id: "b04",
          photo: "plant/g04-balanza.jpg",
          layout: "panel",
          vo: "En balanza se pesa: tara, bruto y neto. El peso real queda en el sistema.",
          onScreen: "Tara, bruto y neto",
        },
      ],
    },
    {
      id: "s5",
      photo: "plant/g05-validacion.jpg",
      role: "Balanza",
      screen: "validacion",
      beats: [
        {
          id: "b05",
          photo: "plant/g05-validacion.jpg",
          layout: "panel",
          vo: "El lote se valida y se distribuye en partes, con trazabilidad de cada unidad.",
          onScreen: "Cada parte, con su trazabilidad",
        },
      ],
    },
    {
      id: "s6",
      photo: "plant/g06-guias.jpg",
      role: "Vigilancia",
      screen: "guias",
      beats: [
        {
          id: "b06",
          photo: "plant/g06-guias.jpg",
          layout: "panel",
          vo: "Las guías de transporte se registran y agrupan con sus lotes.",
          onScreen: "Guías agrupadas con sus lotes",
        },
      ],
    },
    {
      id: "s7",
      photo: "plant/g07-leyes.jpg",
      role: "Laboratorio",
      screen: "leyes",
      beats: [
        {
          id: "b07",
          photo: "plant/g07-leyes.jpg",
          layout: "panel",
          vo: "El laboratorio reporta las leyes y el proveedor cierra el acuerdo contigo.",
          onScreen: "Leyes acordadas con el proveedor",
        },
      ],
    },
    {
      id: "s8",
      photo: "plant/g08-compra.jpg",
      role: "Área comercial",
      screen: "compra",
      beats: [
        {
          id: "b08",
          photo: "plant/g08-compra.jpg",
          layout: "panel",
          vo: "Con las leyes cerradas, la compra se valoriza en oro y plata.",
          onScreen: "Compra valorizada en oro y plata",
        },
      ],
    },
    {
      id: "s9",
      photo: "plant/g09-blending.jpg",
      role: "Área comercial",
      screen: "blending",
      beats: [
        {
          id: "b09",
          photo: "plant/g09-blending.jpg",
          layout: "panel",
          vo: "Se mezcla lo ya comprado para llegar a las leyes que pide el cliente.",
          onScreen: "La mezcla que pide el cliente",
        },
      ],
    },
    {
      id: "s10",
      photo: "plant/g10-despacho.jpg",
      role: "Área comercial",
      screen: "despacho",
      beats: [
        {
          id: "b10",
          photo: "plant/g10-despacho.jpg",
          layout: "panel",
          vo: "El despacho se programa por vehículos y la balanza carga cada carro.",
          onScreen: "Despacho programado, unidad por unidad",
        },
      ],
    },
    {
      id: "s11",
      photo: "plant/g11-venta.jpg",
      role: "Área comercial",
      screen: "venta",
      beats: [
        {
          id: "b11",
          photo: "plant/g11-venta.jpg",
          layout: "panel",
          vo: "El cliente manda su valorización y tú la registras junto a lo enviado.",
          onScreen: "La valorización del cliente, registrada",
        },
      ],
    },
    {
      id: "s12",
      photo: "plant/g12-anticipos.jpg",
      role: "Contabilidad",
      screen: "anticipos",
      beats: [
        {
          id: "b12",
          photo: "plant/g12-anticipos.jpg",
          layout: "panel",
          vo: "Cada anticipo se ve, y también se ve en qué compra o factura se usó.",
          onScreen: "Cada anticipo, con su uso",
        },
      ],
    },
    {
      id: "s13",
      photo: "plant/g13-contabilidad.jpg",
      role: "Contabilidad",
      screen: "contabilidad",
      beats: [
        {
          id: "b13",
          photo: "plant/g13-contabilidad.jpg",
          layout: "panel",
          vo: "El comprobante de compra y el de venta se registran con sus anticipos deducidos.",
          onScreen: "Comprobantes con anticipos deducidos",
        },
      ],
    },
    {
      id: "s14",
      photo: "plant/g14-ciclo.jpg",
      role: null,
      screen: "ciclo",
      beats: [
        {
          id: "b14",
          photo: "plant/g14-ciclo.jpg",
          layout: "panel",
          vo: "Todo el mineral, de la programación a la contabilidad, en un solo sistema.",
          onScreen: "Todo en un solo sistema",
        },
      ],
    },
    {
      id: "s_cierre",
      photo: "plant/cierre-amanecer.jpg",
      role: null,
      screen: null,
      beats: [
        {
          ...CIERRE,
          vo: "ERP COMERCIAL. Menos papel, más control, mejores decisiones. Solicita tu demo.",
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Videos por proceso                                                  */
/* ------------------------------------------------------------------ */

const VIDEOS = [
  {
    id: "01-programacion-unidades",
    title: "Programación de Unidades",
    block: "Recepción",
    blockNumber: "01",
    scenes: [
      {
        id: "s1",
        photo: "plant/p01-1-telefono.jpg",
        role: "Jefe comercial",
        beats: [
          {
            id: "b01",
            photo: "plant/p01-1-telefono.jpg",
            layout: "lower",
            moment: "problema",
            vo: "El proveedor avisa que su camión ya salió de la mina. Si nadie en planta se entera, el mineral espera afuera.",
            onScreen: "Si nadie lo sabe, el mineral espera",
          },
        ],
      },
      {
        id: "s2",
        photo: "plant/p01-2-escritorio.jpg",
        role: "Jefe comercial",
        screen: "programacion",
        beats: [
          {
            id: "b02",
            photo: "plant/p01-2-escritorio.jpg",
            layout: "panel",
            vo: "En ERP COMERCIAL el jefe comercial programa la llegada: empresa de transporte, vehículo, proveedor y hora estimada de ingreso.",
            onScreen: "Transporte, vehículo, proveedor y hora",
          },
        ],
      },
      {
        id: "s3",
        photo: "plant/p01-3-pantalla.jpg",
        role: "Jefe comercial",
        screen: "programacion",
        beats: [
          {
            id: "b03",
            photo: "plant/p01-3-pantalla.jpg",
            layout: "panel",
            vo: "Las guías se pueden agregar de forma opcional, solo si el proveedor ya las tiene a la mano en ese momento.",
            onScreen: "Guías opcionales",
          },
        ],
      },
      {
        id: "s4",
        photo: "plant/p01-6-programacion.jpg",
        role: "Jefe comercial",
        screen: "programacion",
        beats: [
          {
            id: "b04",
            photo: "plant/p01-6-programacion.jpg",
            layout: "panel",
            vo: "Queda todo en una sola programación, con su hora, su unidad, su proveedor y el estado de la llegada.",
            onScreen: "Una sola programación, con su hora",
          },
        ],
      },
      {
        id: "s5",
        photo: "plant/p01-4-garita.jpg",
        role: "Vigilancia",
        screen: "programacion",
        beats: [
          {
            id: "b05",
            photo: "plant/p01-4-garita.jpg",
            layout: "panel",
            vo: "La programación aparece en el área de vigilancia, que solo tiene que confirmar que el vehículo llegó.",
            onScreen: "Vigilancia solo confirma la llegada",
          },
        ],
      },
      {
        screen: "programacion",
        id: "s6",
        photo: "plant/p01-5-reloj.jpg",
        role: null,
        beats: [
          {
            id: "b06",
            photo: "plant/p01-5-reloj.jpg",
            layout: "lower",
            vo: "El mineral entra con su hora real de llegada, y sin llamadas de ida y vuelta entre áreas.",
            onScreen: "Hora real de llegada, sin llamadas",
          },
        ],
      },
      { id: "s_cierre", photo: "plant/cierre-amanecer.jpg", role: null, beats: [CIERRE] },
    ],
  },

  {
    id: "02-recepcion-unidades",
    title: "Recepción de Unidades",
    block: "Recepción",
    blockNumber: "02",
    scenes: [
      {
        id: "s1",
        photo: "plant/p02-1-espera.jpg",
        role: "Vigilancia",
        beats: [
          {
            id: "b01",
            photo: "plant/p02-1-espera.jpg",
            layout: "lower",
            moment: "problema",
            vo: "Llega un camión sin aviso. La garita lo anota en un cuaderno y el resto de la planta no se entera.",
            onScreen: "Un camión sin aviso",
          },
        ],
      },
      {
        id: "s2",
        photo: "plant/p02-2-libreta.jpg",
        role: "Vigilancia",
        screen: "recepcion",
        beats: [
          {
            id: "b02",
            photo: "plant/p02-2-libreta.jpg",
            layout: "panel",
            vo: "Vigilancia registra el ingreso: empresa de transporte, placa, conductor y tipo de vehículo pesado.",
            onScreen: "Transportista, placa, conductor y vehículo",
          },
        ],
      },
      {
        id: "s3",
        photo: "plant/p02-3-bitacora.jpg",
        role: "Vigilancia",
        screen: "recepcion",
        beats: [
          {
            id: "b03",
            photo: "plant/p02-3-bitacora.jpg",
            layout: "panel",
            vo: "Si trae guías, se registran. También los vehículos acompañantes y los acompañantes de cabina de la unidad.",
            onScreen: "Guías, acompañantes y cabina",
          },
        ],
      },
      {
        id: "s4",
        photo: "plant/p02-6-programado.jpg",
        role: "Vigilancia",
        screen: "recepcion",
        beats: [
          {
            id: "b04",
            photo: "plant/p02-6-programado.jpg",
            layout: "panel",
            vo: "Y si el camión llega sin programar, también se registra. El ingreso no depende de que alguien lo anotara antes.",
            onScreen: "También entra lo que llega sin programar",
          },
        ],
      },
      {
        id: "s5",
        photo: "plant/p02-4-evidencia.jpg",
        role: "Vigilancia",
        screen: "recepcion",
        beats: [
          {
            id: "b05",
            photo: "plant/p02-4-evidencia.jpg",
            layout: "panel",
            vo: "Puedes adjuntar fotos y videos como evidencia del ingreso, para respaldar lo que viste en la garita.",
            onScreen: "Fotos y videos como evidencia",
          },
        ],
      },
      {
        screen: "recepcion",
        id: "s6",
        photo: "plant/p02-5-salida.jpg",
        role: "Vigilancia",
        beats: [
          {
            id: "b06",
            photo: "plant/p02-5-salida.jpg",
            layout: "lower",
            vo: "Cuando el mineral sale de planta, marcas su salida y el recorrido completo queda cerrado en el mismo registro.",
            onScreen: "Ingreso y salida, con evidencia",
          },
        ],
      },
      { id: "s_cierre", photo: "plant/cierre-amanecer.jpg", role: null, beats: [CIERRE] },
    ],
  },

  {
    id: "03-recepcion-visitas",
    title: "Recepción de Visitas",
    block: "Recepción",
    blockNumber: "03",
    scenes: [
      {
        id: "s1",
        photo: "plant/p03-1-porton.jpg",
        role: "Vigilancia",
        beats: [
          {
            id: "b01",
            photo: "plant/p03-1-porton.jpg",
            layout: "lower",
            moment: "problema",
            vo: "A la planta entra el proveedor de agua, el almuerzo del personal o un postulante a empleo. Y todos por el mismo portón.",
            onScreen: "Todos entran por el mismo portón",
          },
        ],
      },
      {
        id: "s2",
        photo: "plant/p03-2-recepcion.jpg",
        role: "Vigilancia",
        screen: "visitas",
        beats: [
          {
            id: "b02",
            photo: "plant/p03-2-recepcion.jpg",
            layout: "panel",
            vo: "Vigilancia registra la visita: quién es, qué documento trae y a qué hora llegó a la planta.",
            onScreen: "Quién es, su documento y su hora",
          },
        ],
      },
      {
        id: "s3",
        photo: "plant/p03-3-entrevista.jpg",
        role: "Vigilancia",
        screen: "visitas",
        beats: [
          {
            id: "b03",
            photo: "plant/p03-3-entrevista.jpg",
            layout: "panel",
            vo: "Se indica qué persona de la empresa autoriza el ingreso, para que quede claro quién responde por esa visita.",
            onScreen: "El autorizado por tu empresa",
          },
        ],
      },
      {
        id: "s4",
        photo: "plant/p03-6-motivo.jpg",
        role: "Vigilancia",
        screen: "visitas",
        beats: [
          {
            id: "b04",
            photo: "plant/p03-6-motivo.jpg",
            layout: "panel",
            vo: "El motivo también queda registrado: entrega de agua, almuerzo del personal o entrevista de trabajo.",
            onScreen: "El motivo de la visita, registrado",
          },
        ],
      },
      {
        id: "s5",
        photo: "plant/p03-4-camara.jpg",
        role: "Vigilancia",
        screen: "visitas",
        beats: [
          {
            id: "b05",
            photo: "plant/p03-4-camara.jpg",
            layout: "panel",
            vo: "Puedes adjuntar fotos y videos como evidencia, y marcar la salida cuando la visita termina.",
            onScreen: "Evidencia y marca de salida",
          },
        ],
      },
      {
        screen: "visitas",
        id: "s6",
        photo: "plant/p03-5-lista.jpg",
        role: null,
        beats: [
          {
            id: "b06",
            photo: "plant/p03-5-lista.jpg",
            layout: "lower",
            vo: "Queda un registro de visitas con nombre, motivo, documento y responsable de autorizar cada ingreso.",
            onScreen: "Registro de visitas con responsable",
          },
        ],
      },
      { id: "s_cierre", photo: "plant/cierre-amanecer.jpg", role: null, beats: [CIERRE] },
    ],
  },

  {
    id: "04-balanza",
    title: "Balanza",
    block: "Recepción",
    blockNumber: "04",
    scenes: [
      {
        id: "s1",
        photo: "plant/p04-1-bascula.jpg",
        role: "Balanza",
        beats: [
          {
            id: "b01",
            photo: "plant/p04-1-bascula.jpg",
            layout: "lower",
            moment: "problema",
            vo: "El camión llega con mineral. En la balanza hay que anotar tara, bruto y neto, sin equivocar ni un kilo.",
            onScreen: "Tara, bruto y neto, sin errores",
          },
        ],
      },
      {
        id: "s2",
        photo: "plant/p04-2-formulario.jpg",
        role: "Balanza",
        screen: "balanza",
        beats: [
          {
            id: "b02",
            photo: "plant/p04-2-formulario.jpg",
            layout: "panel",
            vo: "El lote se crea con código automático o digitado: proveedor, producto aurífero o polimetálico y tipo de material.",
            onScreen: "Proveedor, producto y tipo de material",
          },
        ],
      },
      {
        id: "s3",
        photo: "plant/p04-3-display.jpg",
        role: "Balanza",
        screen: "balanza",
        beats: [
          {
            id: "b03",
            photo: "plant/p04-3-display.jpg",
            layout: "panel",
            vo: "El peso inicial puede venir de la máquina de balanza o digitado. Se descarga, se pesa y el neto sale solo.",
            onScreen: "El neto sale del bruto menos la tara",
          },
        ],
      },
      {
        id: "s4",
        photo: "plant/p04-4-particion.jpg",
        role: "Balanza",
        screen: "balanza",
        beats: [
          {
            id: "b04",
            photo: "plant/p04-4-particion.jpg",
            layout: "panel",
            vo: "Si el lote llega en varios carros, se marca particionado y se pesa por partes hasta completarlo.",
            onScreen: "Lotes particionados, pesados por partes",
          },
        ],
      },
      {
        id: "s5",
        photo: "plant/p04-5-carga.jpg",
        role: "Balanza",
        screen: "balanza",
        beats: [
          {
            id: "b05",
            photo: "plant/p04-5-carga.jpg",
            layout: "panel",
            vo: "Cuando el camión viene a cargar, se registra la tara, se carga el mineral y se pesa el bruto.",
            onScreen: "Cuando viene a cargar: tara y bruto",
          },
        ],
      },
      {
        screen: "balanza",
        id: "s6",
        photo: "plant/p04-6-resumen.jpg",
        role: null,
        beats: [
          {
            id: "b06",
            photo: "plant/p04-6-resumen.jpg",
            layout: "lower",
            vo: "Todos los lotes y blendings pesados se ven en el resumen de balanza, con su peso y su unidad.",
            onScreen: "Todo pesado, en el resumen de balanza",
          },
        ],
      },
      { id: "s_cierre", photo: "plant/cierre-amanecer.jpg", role: null, beats: [CIERRE] },
    ],
  },

  {
    id: "05-validacion-distribucion",
    title: "Validación y Distribución",
    block: "Recepción",
    blockNumber: "05",
    scenes: [
      {
        id: "s1",
        photo: "plant/p05-1-dos-camiones.jpg",
        role: "Balanza",
        beats: [
          {
            id: "b01",
            photo: "plant/p05-1-dos-camiones.jpg",
            layout: "lower",
            moment: "problema",
            vo: "Un lote puede llegar pesado en varios carros y en varias salidas. Cada parte tiene que quedar ordenada.",
            onScreen: "Un lote que llegó en varios carros",
          },
        ],
      },
      {
        id: "s2",
        photo: "plant/p05-2-pantalla.jpg",
        role: "Balanza",
        screen: "validacion",
        beats: [
          {
            id: "b02",
            photo: "plant/p05-2-pantalla.jpg",
            layout: "panel",
            vo: "En validación tomas el lote ya pesado en balanza y lo distribuyes en partes, una por unidad.",
            onScreen: "Tomas el lote y lo distribuyes en partes",
          },
        ],
      },
      {
        id: "s3",
        photo: "plant/p05-3-documentos.jpg",
        role: "Balanza",
        screen: "validacion",
        beats: [
          {
            id: "b03",
            photo: "plant/p05-3-documentos.jpg",
            layout: "panel",
            vo: "Cada parte queda con su vehículo y su guía, y así se mantiene la trazabilidad de toda la recepción.",
            onScreen: "Cada parte, con su vehículo y su guía",
          },
        ],
      },
      {
        id: "s4",
        photo: "plant/p05-6-peso-total.jpg",
        role: "Balanza",
        screen: "validacion",
        beats: [
          {
            id: "b04",
            photo: "plant/p05-6-peso-total.jpg",
            layout: "panel",
            vo: "El peso total del lote no cambia, y cada parte muestra lo que le corresponde de ese peso.",
            onScreen: "El peso total no cambia",
          },
        ],
      },
      {
        id: "s5",
        photo: "plant/p05-4-oficina.jpg",
        role: "Área comercial",
        screen: "validacion",
        beats: [
          {
            id: "b05",
            photo: "plant/p05-4-oficina.jpg",
            layout: "panel",
            vo: "Con eso, el resto de los procesos de compra puede seguir con el mineral correctamente documentado.",
            onScreen: "El mineral queda documentado para comprar",
          },
        ],
      },
      {
        screen: "validacion",
        id: "s6",
        photo: "plant/p05-5-archivo.jpg",
        role: null,
        beats: [
          {
            id: "b06",
            photo: "plant/p05-5-archivo.jpg",
            layout: "lower",
            vo: "Validas, distribuyes y sigues con la compra. Sin volver a pasar el mineral por la balanza.",
            onScreen: "Validas y sigues, sin rehacer el pesaje",
          },
        ],
      },
      { id: "s_cierre", photo: "plant/cierre-amanecer.jpg", role: null, beats: [CIERRE] },
    ],
  },

  {
    id: "06-guias",
    title: "Guías",
    block: "Recepción",
    blockNumber: "06",
    scenes: [
      {
        id: "s1",
        photo: "plant/p06-1-cuaderno.jpg",
        role: "Vigilancia",
        beats: [
          {
            id: "b01",
            photo: "plant/p06-1-cuaderno.jpg",
            layout: "lower",
            moment: "problema",
            vo: "Cada carro que entra a planta trae su guía de transporte. Si se anotan en un cuaderno, nadie las encuentra.",
            onScreen: "Cada carro trae una guía",
          },
        ],
      },
      {
        id: "s2",
        photo: "plant/p06-2-guia.jpg",
        role: "Vigilancia",
        screen: "guias",
        beats: [
          {
            id: "b02",
            photo: "plant/p06-2-guia.jpg",
            layout: "panel",
            vo: "En ERP COMERCIAL registras la guía de transporte o remisión de cada vehículo que trae mineral.",
            onScreen: "Registras la guía de cada vehículo",
          },
        ],
      },
      {
        id: "s3",
        photo: "plant/p06-3-remision.jpg",
        role: "Vigilancia",
        screen: "guias",
        beats: [
          {
            id: "b03",
            photo: "plant/p06-3-remision.jpg",
            layout: "panel",
            vo: "La guía agrupa los lotes o las partes de un lote que llegaron en esa misma unidad vehicular.",
            onScreen: "Una guía agrupa sus lotes o partes",
          },
        ],
      },
      {
        id: "s4",
        photo: "plant/p06-6-peso.jpg",
        role: "Vigilancia",
        screen: "guias",
        beats: [
          {
            id: "b04",
            photo: "plant/p06-6-peso.jpg",
            layout: "panel",
            vo: "Se puede indicar el peso de cada lote dentro de la guía, para completar el documento de transporte.",
            onScreen: "El peso de cada lote en la guía",
          },
        ],
      },
      {
        id: "s5",
        photo: "plant/p06-4-laptop.jpg",
        role: "Vigilancia",
        screen: "guias",
        beats: [
          {
            id: "b05",
            photo: "plant/p06-4-laptop.jpg",
            layout: "panel",
            vo: "Ese peso es solo documental. El peso real de cada lote es el que registró la balanza.",
            onScreen: "Documental. El real es el de balanza",
          },
        ],
      },
      {
        screen: "guias",
        id: "s6",
        photo: "plant/p06-5-archivo.jpg",
        role: null,
        beats: [
          {
            id: "b06",
            photo: "plant/p06-5-archivo.jpg",
            layout: "lower",
            vo: "La guía deja trazada la recepción, lote por lote y unidad por unidad.",
            onScreen: "La guía deja trazada la recepción",
          },
        ],
      },
      { id: "s_cierre", photo: "plant/cierre-amanecer.jpg", role: null, beats: [CIERRE] },
    ],
  },

  {
    id: "07-cierre-leyes",
    title: "Cierre de Leyes",
    block: "Valorización",
    blockNumber: "07",
    scenes: [
      {
        id: "s1",
        photo: "plant/p07-1-muestras.jpg",
        role: "Laboratorio",
        beats: [
          {
            id: "b01",
            photo: "plant/p07-1-muestras.jpg",
            layout: "lower",
            moment: "problema",
            vo: "El mineral llegó y ya fue pesado. Falta lo más discutido: la ley. Y no todos miden igual.",
            onScreen: "Falta la ley, y no todos miden igual",
          },
        ],
      },
      {
        id: "s2",
        photo: "plant/p07-2-informe.jpg",
        role: "Laboratorio",
        screen: "leyes",
        beats: [
          {
            id: "b02",
            photo: "plant/p07-2-informe.jpg",
            layout: "panel",
            vo: "Por cada análisis registras el laboratorio donde se hizo, quién se hace cargo y el número de ensayo.",
            onScreen: "Laboratorio, responsable y ensayo",
          },
        ],
      },
      {
        id: "s3",
        photo: "plant/p07-3-analizador.jpg",
        role: "Laboratorio",
        screen: "leyes",
        beats: [
          {
            id: "b03",
            photo: "plant/p07-3-analizador.jpg",
            layout: "panel",
            vo: "Se registran las leyes de oro y plata, la humedad del mineral y la recuperación obtenida.",
            onScreen: "Oro, plata, humedad y recuperación",
          },
        ],
      },
      {
        id: "s4",
        photo: "plant/p07-4-dos-analisis.jpg",
        role: "Laboratorio",
        screen: "leyes",
        beats: [
          {
            id: "b04",
            photo: "plant/p07-4-dos-analisis.jpg",
            layout: "panel",
            vo: "Los análisis se agrupan y se define la ley de cierre: el promedio o la ley acordada con el proveedor.",
            onScreen: "Ley de cierre: promedio o la acordada",
          },
        ],
      },
      {
        id: "s5",
        photo: "plant/p07-5-bolsita.jpg",
        role: null,
        screen: "leyes",
        beats: [
          {
            id: "b05",
            photo: "plant/p07-5-bolsita.jpg",
            layout: "lower",
            vo: "Si el proveedor mandó muestras antes de enviar su mineral, esos análisis se enlazan al lote recibido.",
            onScreen: "Las muestras previas se enlazan al lote",
          },
        ],
      },
      {
        screen: "leyes",
        id: "s6",
        photo: "plant/p07-6-cierre.jpg",
        role: null,
        beats: [
          {
            id: "b06",
            photo: "plant/p07-6-cierre.jpg",
            layout: "lower",
            vo: "Con las leyes cerradas y acordadas por las dos partes, la compra ya tiene su base para valorizarse.",
            onScreen: "Leyes cerradas, base para comprar",
          },
        ],
      },
      { id: "s_cierre", photo: "plant/cierre-amanecer.jpg", role: null, beats: [CIERRE] },
    ],
  },

  {
    id: "08-valorizacion-compra",
    title: "Valorización de Compra",
    block: "Valorización",
    blockNumber: "08",
    scenes: [
      {
        id: "s1",
        photo: "plant/p08-1-bocamina.jpg",
        role: "Área comercial",
        beats: [
          {
            id: "b01",
            photo: "plant/p08-1-bocamina.jpg",
            layout: "lower",
            moment: "problema",
            vo: "Con las leyes ya cerradas, hay que ponerles precio a esos lotes. Y eso se negocia uno por uno.",
            onScreen: "Con las leyes cerradas, hay que poner precio",
          },
        ],
      },
      {
        id: "s2",
        photo: "plant/p08-2-propuesta.jpg",
        role: "Área comercial",
        screen: "compra",
        beats: [
          {
            id: "b02",
            photo: "plant/p08-2-propuesta.jpg",
            layout: "panel",
            vo: "Registras la propuesta de compra y eliges el proveedor. Aparecen todos los lotes que tiene registrados.",
            onScreen: "Eliges el proveedor y aparecen sus lotes",
          },
        ],
      },
      {
        id: "s3",
        photo: "plant/p08-3-lotes.jpg",
        role: "Área comercial",
        screen: "compra",
        beats: [
          {
            id: "b03",
            photo: "plant/p08-3-lotes.jpg",
            layout: "panel",
            vo: "Al elegir los lotes, la valorización se arma con oro y plata, usando las leyes acordadas en el cierre.",
            onScreen: "Valorización en oro y plata",
          },
        ],
      },
      {
        id: "s4",
        photo: "plant/p08-4-precio.jpg",
        role: "Área comercial",
        screen: "compra",
        beats: [
          {
            id: "b04",
            photo: "plant/p08-4-precio.jpg",
            layout: "panel",
            vo: "Se registra la maquila, el precio internacional del mineral y las penalidades que apliquen al lote.",
            onScreen: "Maquila, precio internacional y penalidades",
          },
        ],
      },
      {
        id: "s5",
        photo: "plant/p08-5-aprobacion.jpg",
        role: "Área comercial",
        screen: "compra",
        beats: [
          {
            id: "b05",
            photo: "plant/p08-5-aprobacion.jpg",
            layout: "panel",
            vo: "Cuando la propuesta se aprueba, el sistema genera la valorización de compra con todos esos conceptos.",
            onScreen: "Aprobada la propuesta, se genera la valorización",
          },
        ],
      },
      {
        screen: "compra",
        id: "s6",
        photo: "plant/p08-6-anticipo.jpg",
        role: null,
        beats: [
          {
            id: "b06",
            photo: "plant/p08-6-anticipo.jpg",
            layout: "lower",
            vo: "Y desde ahí puedes aplicar los anticipos que le diste al proveedor en esa compra.",
            onScreen: "Aplicas los anticipos del proveedor",
          },
        ],
      },
      { id: "s_cierre", photo: "plant/cierre-amanecer.jpg", role: null, beats: [CIERRE] },
    ],
  },

  {
    id: "09-blending",
    title: "Blending",
    block: "Valorización",
    blockNumber: "09",
    scenes: [
      {
        id: "s1",
        photo: "plant/p09-1-acopios.jpg",
        role: "Área comercial",
        beats: [
          {
            id: "b01",
            photo: "plant/p09-1-acopios.jpg",
            layout: "lower",
            moment: "problema",
            vo: "El cliente pide un mineral con leyes específicas. Los lotes que tienes comprados no dan esa ley solos.",
            onScreen: "El cliente pide leyes que no tienes",
          },
        ],
      },
      {
        id: "s2",
        photo: "plant/p09-2-pantalla.jpg",
        role: "Área comercial",
        screen: "blending",
        beats: [
          {
            id: "b02",
            photo: "plant/p09-2-pantalla.jpg",
            layout: "panel",
            vo: "En blending mezclas lotes que ya compraste, para llegar a la ley que pide el cliente.",
            onScreen: "Mezclas lotes que ya compraste",
          },
        ],
      },
      {
        id: "s3",
        photo: "plant/p09-3-panel.jpg",
        role: "Área comercial",
        screen: "blending",
        beats: [
          {
            id: "b03",
            photo: "plant/p09-3-panel.jpg",
            layout: "panel",
            vo: "En modo inteligente fijas el peso máximo, las leyes requeridas y el precio del mineral que quieres vender.",
            onScreen: "Peso máximo, leyes requeridas y precio",
          },
        ],
      },
      {
        id: "s4",
        photo: "plant/p09-4-aerea.jpg",
        role: "Área comercial",
        screen: "blending",
        beats: [
          {
            id: "b04",
            photo: "plant/p09-4-aerea.jpg",
            layout: "panel",
            vo: "El sistema busca la combinación más óptima y rentable con esos criterios, entre todos tus lotes.",
            onScreen: "La combinación más óptima y rentable",
          },
        ],
      },
      {
        id: "s5",
        photo: "plant/p09-6-lotes.jpg",
        role: "Área comercial",
        screen: "blending",
        beats: [
          {
            id: "b05",
            photo: "plant/p09-6-lotes.jpg",
            layout: "panel",
            vo: "Te muestra de qué lotes sale la mezcla, cuánto mineral entra y cuánto queda en stock.",
            onScreen: "De qué lotes sale la mezcla",
          },
        ],
      },
      {
        screen: "blending",
        id: "s6",
        photo: "plant/p09-5-manual.jpg",
        role: null,
        beats: [
          {
            id: "b06",
            photo: "plant/p09-5-manual.jpg",
            layout: "lower",
            vo: "También puedes hacerlo manual: eliges los lotes y ves las leyes resultantes de esa combinación.",
            onScreen: "O manual: eliges lotes y calculas leyes",
          },
        ],
      },
      { id: "s_cierre", photo: "plant/cierre-amanecer.jpg", role: null, beats: [CIERRE] },
    ],
  },

  {
    id: "10-programacion-despachos",
    title: "Programación de Despachos",
    block: "Despacho",
    blockNumber: "10",
    scenes: [
      {
        id: "s1",
        photo: "plant/p10-1-fila.jpg",
        role: "Área comercial",
        beats: [
          {
            id: "b01",
            photo: "plant/p10-1-fila.jpg",
            layout: "lower",
            moment: "problema",
            vo: "Ya compraste el mineral. Ahora hay que mandarlo al cliente, con los carros correctos para cada envío.",
            onScreen: "Hay que mandarlo en los carros correctos",
          },
        ],
      },
      {
        id: "s2",
        photo: "plant/p10-2-despachador.jpg",
        role: "Área comercial",
        screen: "despacho",
        beats: [
          {
            id: "b02",
            photo: "plant/p10-2-despachador.jpg",
            layout: "panel",
            vo: "Eliges los lotes o blendings que vas a despachar y las toneladas exactas a enviar.",
            onScreen: "Eliges lotes o blendings y las toneladas",
          },
        ],
      },
      {
        id: "s3",
        photo: "plant/p10-3-tablet.jpg",
        role: "Área comercial",
        screen: "despacho",
        beats: [
          {
            id: "b03",
            photo: "plant/p10-3-tablet.jpg",
            layout: "panel",
            vo: "El stock se reparte entre los vehículos y se generan las programaciones de ingreso de cada unidad.",
            onScreen: "El stock se reparte entre los vehículos",
          },
        ],
      },
      {
        id: "s4",
        photo: "plant/p10-4-cola.jpg",
        role: "Vigilancia",
        screen: "despacho",
        beats: [
          {
            id: "b04",
            photo: "plant/p10-4-cola.jpg",
            layout: "panel",
            vo: "Vigilancia recibe los carros en el portón y balanza los carga, igual que en la recepción de mineral.",
            onScreen: "Vigilancia recibe y balanza carga",
          },
        ],
      },
      {
        id: "s5",
        photo: "plant/p10-5-guia.jpg",
        role: "Área comercial",
        screen: "despacho",
        beats: [
          {
            id: "b05",
            photo: "plant/p10-5-guia.jpg",
            layout: "panel",
            vo: "En el módulo registras la guía de cada vehículo que sale con mineral hacia el cliente.",
            onScreen: "La guía de cada vehículo",
          },
        ],
      },
      {
        screen: "despacho",
        id: "s6",
        photo: "plant/p10-6-llegada.jpg",
        role: null,
        beats: [
          {
            id: "b06",
            photo: "plant/p10-6-llegada.jpg",
            layout: "lower",
            vo: "Y confirmas la llegada al cliente con el código, el peso y las leyes que él registró en su proceso.",
            onScreen: "Llegada confirmada con código, peso y leyes",
          },
        ],
      },
      { id: "s_cierre", photo: "plant/cierre-amanecer.jpg", role: null, beats: [CIERRE] },
    ],
  },

  {
    id: "11-valorizacion-venta",
    title: "Valorización de Venta",
    block: "Despacho",
    blockNumber: "11",
    scenes: [
      {
        id: "s1",
        photo: "plant/p11-1-documento.jpg",
        role: "Área comercial",
        beats: [
          {
            id: "b01",
            photo: "plant/p11-1-documento.jpg",
            layout: "lower",
            moment: "problema",
            vo: "El cliente recibió el mineral y manda su valorización con las leyes y los precios que le aplicó.",
            onScreen: "El cliente manda su valorización",
          },
        ],
      },
      {
        id: "s2",
        photo: "plant/p11-2-pantalla.jpg",
        role: "Área comercial",
        screen: "venta",
        beats: [
          {
            id: "b02",
            photo: "plant/p11-2-pantalla.jpg",
            layout: "panel",
            vo: "En valorización de venta eliges los lotes que se enviaron en el despacho, uno o varios.",
            onScreen: "Eliges los lotes enviados en el despacho",
          },
        ],
      },
      {
        id: "s3",
        photo: "plant/p11-5-lote.jpg",
        role: "Área comercial",
        screen: "venta",
        beats: [
          {
            id: "b03",
            photo: "plant/p11-5-lote.jpg",
            layout: "panel",
            vo: "Puedes tomar uno o varios lotes de una misma valorización, según lo que haya enviado el cliente.",
            onScreen: "Uno o varios lotes, en una valorización",
          },
        ],
      },
      {
        id: "s4",
        photo: "plant/p11-3-precios.jpg",
        role: "Área comercial",
        screen: "venta",
        beats: [
          {
            id: "b04",
            photo: "plant/p11-3-precios.jpg",
            layout: "panel",
            vo: "Defines las leyes y el precio de oro y plata de cada uno de los lotes enviados.",
            onScreen: "Leyes y precio de cada lote enviado",
          },
        ],
      },
      {
        id: "s5",
        photo: "plant/p11-6-total.jpg",
        role: null,
        screen: "venta",
        beats: [
          {
            id: "b05",
            photo: "plant/p11-6-total.jpg",
            layout: "lower",
            vo: "El sistema calcula el valor de cada lote con esos precios y arma el total de la venta.",
            onScreen: "El valor de cada lote, calculado",
          },
        ],
      },
      {
        screen: "venta",
        id: "s6",
        photo: "plant/p11-4-escritorio.jpg",
        role: null,
        beats: [
          {
            id: "b06",
            photo: "plant/p11-4-escritorio.jpg",
            layout: "lower",
            vo: "La valorización queda lista para registrar el comprobante de venta y emitir la factura.",
            onScreen: "Lista para registrar el comprobante",
          },
        ],
      },
      { id: "s_cierre", photo: "plant/cierre-amanecer.jpg", role: null, beats: [CIERRE] },
    ],
  },

  {
    id: "12-anticipos",
    title: "Anticipos de Proveedores y Clientes",
    block: "Contabilidad",
    blockNumber: "12",
    scenes: [
      {
        id: "s1",
        photo: "plant/p12-1-duda.jpg",
        role: "Contabilidad",
        beats: [
          {
            id: "b01",
            photo: "plant/p12-1-duda.jpg",
            layout: "lower",
            moment: "problema",
            vo: "Un proveedor te pide un anticipo. Un cliente te adelanta una venta. Después nadie sabe en qué se usaron.",
            onScreen: "Anticipos dados y recibidos, sin rastro",
          },
        ],
      },
      {
        id: "s2",
        photo: "plant/p12-2-monitor.jpg",
        role: "Contabilidad",
        screen: "anticipos",
        beats: [
          {
            id: "b02",
            photo: "plant/p12-2-monitor.jpg",
            layout: "panel",
            vo: "Contabilidad registra los anticipos que se dan a los proveedores y los que envían los clientes.",
            onScreen: "Contabilidad registra los anticipos",
          },
        ],
      },
      {
        id: "s3",
        photo: "plant/p12-6-banco.jpg",
        role: "Contabilidad",
        screen: "anticipos",
        beats: [
          {
            id: "b03",
            photo: "plant/p12-6-banco.jpg",
            layout: "panel",
            vo: "Cada anticipo tiene su código, su monto, su fecha y el beneficiario al que corresponde.",
            onScreen: "Código, monto y fecha",
          },
        ],
      },
      {
        id: "s4",
        photo: "plant/p12-3-libreta.jpg",
        role: "Contabilidad",
        screen: "anticipos",
        beats: [
          {
            id: "b04",
            photo: "plant/p12-3-libreta.jpg",
            layout: "panel",
            vo: "En cada anticipo ves cuánto se ha usado y cuánto queda disponible todavía.",
            onScreen: "Cuánto se usó y cuánto queda",
          },
        ],
      },
      {
        id: "s5",
        photo: "plant/p12-4-carpeta.jpg",
        role: "Contabilidad",
        screen: "anticipos",
        beats: [
          {
            id: "b05",
            photo: "plant/p12-4-carpeta.jpg",
            layout: "panel",
            vo: "Los anticipos del proveedor se ven aplicados en cada valorización de compra en la que se usaron.",
            onScreen: "Aplicados en cada valorización de compra",
          },
        ],
      },
      {
        screen: "anticipos",
        id: "s6",
        photo: "plant/p12-5-scanner.jpg",
        role: null,
        beats: [
          {
            id: "b06",
            photo: "plant/p12-5-scanner.jpg",
            layout: "lower",
            vo: "Los del cliente, en las facturas de venta registradas y en las valorizaciones que las respaldan.",
            onScreen: "Los del cliente, en las facturas de venta",
          },
        ],
      },
      { id: "s_cierre", photo: "plant/cierre-amanecer.jpg", role: null, beats: [CIERRE] },
    ],
  },

  {
    id: "13-contabilidad",
    title: "Contabilidad: Compra y Venta",
    block: "Contabilidad",
    blockNumber: "13",
    scenes: [
      {
        id: "s1",
        photo: "plant/p13-1-papel.jpg",
        role: "Contabilidad",
        beats: [
          {
            id: "b01",
            photo: "plant/p13-1-papel.jpg",
            layout: "lower",
            moment: "problema",
            vo: "El mineral ya está comprado y ya está vendido. Falta registrar el comprobante y descontar los anticipos.",
            onScreen: "El mineral ya está comprado y vendido",
          },
        ],
      },
      {
        id: "s2",
        photo: "plant/p13-2-monitor.jpg",
        role: "Contabilidad",
        screen: "contabilidad",
        beats: [
          {
            id: "b02",
            photo: "plant/p13-2-monitor.jpg",
            layout: "panel",
            vo: "En compra registras el comprobante y eliges la valorización de compra acordada con el proveedor.",
            onScreen: "Compras: eliges la valorización acordada",
          },
        ],
      },
      {
        id: "s3",
        photo: "plant/p13-3-deduccion.jpg",
        role: "Contabilidad",
        screen: "contabilidad",
        beats: [
          {
            id: "b03",
            photo: "plant/p13-3-deduccion.jpg",
            layout: "panel",
            vo: "Los anticipos que esa valorización indica se deducen automáticamente, sin volver a cargarlos a mano.",
            onScreen: "Los anticipos se deducen solos",
          },
        ],
      },
      {
        id: "s4",
        photo: "plant/p13-6-saldo.jpg",
        role: null,
        screen: "contabilidad",
        beats: [
          {
            id: "b04",
            photo: "plant/p13-6-saldo.jpg",
            layout: "lower",
            vo: "El saldo del comprobante queda con lo que falta por pagar a cada proveedor.",
            onScreen: "El saldo, con lo que falta por pagar",
          },
        ],
      },
      {
        id: "s5",
        photo: "plant/p13-4-venta.jpg",
        role: "Contabilidad",
        screen: "contabilidad",
        beats: [
          {
            id: "b05",
            photo: "plant/p13-4-venta.jpg",
            layout: "panel",
            vo: "En venta registras el comprobante y eliges los lotes valorizados, en una o varias valorizaciones de venta.",
            onScreen: "Ventas: eliges los lotes valorizados",
          },
        ],
      },
      {
        screen: "contabilidad",
        id: "s6",
        photo: "plant/p13-5-escritorio.jpg",
        role: null,
        beats: [
          {
            id: "b06",
            photo: "plant/p13-5-escritorio.jpg",
            layout: "lower",
            vo: "Y seleccionas los anticipos que te dio el cliente para deducirlos de la factura.",
            onScreen: "Seleccionas los anticipos del cliente",
          },
        ],
      },
      { id: "s_cierre", photo: "plant/cierre-amanecer.jpg", role: null, beats: [CIERRE] },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Escritura                                                           */
/* ------------------------------------------------------------------ */

writeFileSync(
  join(ROOT, "content", "general.json"),
  `${JSON.stringify(GENERAL, null, 2)}\n`,
);

for (const video of VIDEOS) {
  const payload = {
    brand: BRAND,
    fps: 30,
    id: video.id,
    title: video.title,
    block: video.block,
    blockNumber: video.blockNumber,
    timing: TIMING.proceso,
    scenes: video.scenes,
  };
  writeFileSync(
    join(PROCESSES_DIR, `${video.id}.json`),
    `${JSON.stringify(payload, null, 2)}\n`,
  );
}

console.log(`Guiones escritos: 1 general + ${VIDEOS.length} procesos.`);
