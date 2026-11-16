import React from "react";
import { useCurrentFrame } from "remotion";
import {
  anticiposCliente,
  anticiposProveedor,
  blending,
  cicloModulos,
  comprobanteCompra,
  comprobanteVenta,
  despacho,
  guiasRecepcion,
  laboratorios,
  lote1,
  maquilaPct,
  partesLote1,
  pesajesLote1,
  proveedores,
  transportistas,
  unidades,
  valorizacionCompra,
  valorizacionVenta,
  visitas,
} from "../data";
import { font, palette } from "../theme";
import {
  AppBar,
  Check,
  Chip,
  Enter,
  Foot,
  FormRow,
  KV,
  Label,
  Pulse,
  Row,
  Screen,
  SectionTitle,
  Stat,
  Td,
  Th,
} from "./ui";

/* ================================================================== */
/* 1. Programacion de unidades                                        */
/* ================================================================== */

export const ProgramacionScreen: React.FC = () => (
  <Screen>
    <AppBar
      title="Programación de unidades"
      right={<Chip label="Nueva programación" tone="amber" />}
    />

    <Enter delay={6}>
      <div style={{ display: "flex", gap: 22 }}>
        <KV label="Empresa de transporte" value={transportistas.norte} width={300} />
        <KV label="Vehículo" value="ABC-123" width={150} mono />
        <KV label="Proveedor minero" value={proveedores.andes.nombre} width={300} />
      </div>
    </Enter>

    <Enter delay={16}>
      <div style={{ display: "flex", gap: 22 }}>
        <KV label="Hora de llegada" value="08:30" width={170} mono />
        <KV label="Guías (opcional)" value="GR-88231" width={170} mono />
        <KV label="Estado" value="Confirmada" width={180} color={palette.green} />
      </div>
    </Enter>

    <Enter delay={26}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 20px",
          borderRadius: 12,
          background: palette.surfaceAlt,
          border: `1px solid ${palette.line}`,
        }}
      >
        <Pulse />
        <div style={{ fontFamily: font.sans, fontSize: 19, color: palette.textDim }}>
          Esta programación aparece en Vigilancia: solo hay que confirmar la
          llegada.
        </div>
      </div>
    </Enter>

    <Enter delay={34}>
      <Foot tone="amber">
        <Check size={26} />
        <div style={{ flex: 1, fontFamily: font.sans, fontSize: 19, color: palette.textDim }}>
          Programación PR-2024-0072 · registrada por el área comercial
        </div>
      </Foot>
    </Enter>
  </Screen>
);

/* ================================================================== */
/* 2. Recepcion de unidades                                           */
/* ================================================================== */

export const RecepcionScreen: React.FC = () => (
  <Screen>
    <AppBar title="Recepción de unidades" right={<Chip label="2 ingresos" tone="steel" />} />

    <Enter delay={6}>
      <Row style={{ paddingTop: 0, borderBottom: `1px solid ${palette.line}` }}>
        <Th width={230}>Transportista</Th>
        <Th width={140}>Placa</Th>
        <Th width={210}>Conductor</Th>
        <Th width={110}>Guía</Th>
        <Th width={110} align="right">
          Ingreso
        </Th>
      </Row>
      {unidades.map((u, i) => (
        <Enter key={u.id} delay={12 + i * 8}>
          <Row>
            <Td width={230} size={19}>
              {u.transportista}
            </Td>
            <Td width={140} mono>
              {u.placa}
            </Td>
            <Td width={210} size={19}>
              {u.conductor}
            </Td>
            <Td width={110} mono color={u.guia === "—" ? palette.textMute : palette.text}>
              {u.guia}
            </Td>
            <Td width={110} align="right" mono>
              {u.ingreso}
            </Td>
          </Row>
        </Enter>
      ))}
    </Enter>

    <Enter delay={30}>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ flex: 1 }}>
          <Stat label="Con guía" value="1" unit="unidade" color={palette.steel} />
        </div>
        <div style={{ flex: 1 }}>
          <Stat label="Imprevista" value="1" unit="unidade" color={palette.amberBright} />
        </div>
        <div style={{ flex: 1 }}>
          <Stat label="Evidencias" value="4" unit="archivos" color={palette.green} />
        </div>
      </div>
    </Enter>

    <Enter delay={38}>
      <Foot tone="green">
        <Check size={26} />
        <div style={{ flex: 1, fontFamily: font.sans, fontSize: 19, color: palette.textDim }}>
          U-2024-0115 marcada con salida a las 11:40
        </div>
      </Foot>
    </Enter>
  </Screen>
);

/* ================================================================== */
/* 3. Recepcion de visitas                                            */
/* ================================================================== */

export const VisitasScreen: React.FC = () => (
  <Screen>
    <AppBar title="Recepción de visitas" right={<Chip label="3 visitas" tone="steel" />} />

    <Enter delay={6}>
      <Row style={{ paddingTop: 0, borderBottom: `1px solid ${palette.line}` }}>
        <Th width={230}>Motivo</Th>
        <Th width={250}>Visitante</Th>
        <Th width={230}>Autorizado por</Th>
        <Th width={100} align="right">
          Salida
        </Th>
      </Row>
      {visitas.map((v, i) => (
        <Enter key={v.id} delay={12 + i * 8}>
          <Row>
            <Td width={230} size={19}>
              {v.motivo}
            </Td>
            <Td width={250} size={19}>
              {v.visitante}
            </Td>
            <Td width={230} size={18} color={palette.textDim}>
              {v.autoriza}
            </Td>
            <Td width={100} align="right" mono>
              {v.salida}
            </Td>
          </Row>
        </Enter>
      ))}
    </Enter>

    <Enter delay={34}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "13px 20px",
          borderRadius: 12,
          background: palette.surfaceAlt,
          border: `1px solid ${palette.line}`,
        }}
      >
        <div style={{ fontFamily: font.sans, fontSize: 18, color: palette.textMute }}>
          Documento
        </div>
        <div style={{ fontFamily: font.mono, fontSize: 19, color: palette.text }}>
          {visitas[0].documento}
        </div>
        <div style={{ flex: 1 }} />
        <Chip label="Evidencia adjunta" tone="green" />
      </div>
    </Enter>

    <Enter delay={40}>
      <Foot tone="green">
        <Check size={26} />
        <div style={{ flex: 1, fontFamily: font.sans, fontSize: 19, color: palette.textDim }}>
          Nombre, motivo, documento y responsable de cada visita
        </div>
      </Foot>
    </Enter>
  </Screen>
);

/* ================================================================== */
/* 4. Balanza                                                         */
/* ================================================================== */

export const BalanzaScreen: React.FC = () => (
  <Screen>
    <AppBar title="Balanza" right={<Chip label="Balanza 1 · ticket activo" tone="amber" />} />

    <Enter delay={6}>
      <div style={{ display: "flex", gap: 20 }}>
        <KV label="Lote" value={lote1.id} width={120} mono />
        <KV label="Proveedor" value={lote1.proveedor} width={280} />
        <KV label="Producto" value={lote1.producto} width={150} />
        <KV label="Material" value={lote1.material} width={130} />
        <KV label="Zona de origen" value={lote1.zona} width={140} />
      </div>
    </Enter>

    <Enter delay={16}>
      <Row style={{ paddingTop: 0, borderBottom: `1px solid ${palette.line}` }}>
        <Th width={190}>Unidad</Th>
        <Th width={210} align="right">
          Tara (kg)
        </Th>
        <Th width={210} align="right">
          Bruto (kg)
        </Th>
        <Th width={250} align="right">
          Neto (kg)
        </Th>
        <Th width={90} align="right">
          Estado
        </Th>
      </Row>
      {pesajesLote1.map((p, i) => (
        <Enter key={p.unidad} delay={22 + i * 8}>
          <Row>
            <Td width={190} mono>
              {p.unidad}
            </Td>
            <Td width={210} align="right" mono color={palette.textDim}>
              {p.tara.toLocaleString("es-PE")}
            </Td>
            <Td width={210} align="right" mono color={palette.textDim}>
              {p.bruto.toLocaleString("es-PE")}
            </Td>
            <Td width={250} align="right" mono color={palette.amberBright}>
              {p.neto.toLocaleString("es-PE")}
            </Td>
            <Td width={90} align="right">
              <Chip label={`Parte ${i + 1}`} tone="steel" />
            </Td>
          </Row>
        </Enter>
      ))}
    </Enter>

    <Enter delay={38}>
      <Foot tone="amber">
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: font.sans,
              fontSize: 18,
              color: palette.textDim,
              marginBottom: 4,
            }}
          >
            Peso neto del lote · bruto menos tara
          </div>
          <div style={{ fontFamily: font.mono, fontSize: 26, color: palette.text }}>
            24,830 kg
            <span style={{ fontSize: 18, color: palette.textMute }}> · 24.83 t</span>
          </div>
        </div>
        <Chip label="Lote particionado" tone="amber" />
      </Foot>
    </Enter>
  </Screen>
);

/* ================================================================== */
/* 5. Validacion y distribucion                                       */
/* ================================================================== */

export const ValidacionScreen: React.FC = () => (
  <Screen>
    <AppBar
      title="Validación y distribución"
      right={<Chip label="LT-0001 · validado" tone="green" />}
    />

    <Enter delay={6}>
      <div style={{ display: "flex", gap: 20 }}>
        <KV label="Lote pesado" value="LT-0001" width={130} mono />
        <KV label="Proveedor" value={lote1.proveedor} width={280} />
        <KV label="Peso total" value="24,830 kg" width={160} mono />
        <KV label="Partes" value="2" width={90} mono color={palette.amberBright} />
      </div>
    </Enter>

    <Enter delay={16}>
      <Row style={{ paddingTop: 0, borderBottom: `1px solid ${palette.line}` }}>
        <Th width={150}>Parte</Th>
        <Th width={160}>Vehículo</Th>
        <Th width={170}>Guía</Th>
        <Th width={170}>Hora</Th>
        <Th width={250} align="right">
          Peso neto (kg)
        </Th>
      </Row>
      {partesLote1.map((p, i) => (
        <Enter key={p.parte} delay={22 + i * 8}>
          <Row>
            <Td width={150} size={19}>
              {p.parte}
            </Td>
            <Td width={160} mono>
              {p.placa}
            </Td>
            <Td width={170} mono color={palette.steel}>
              {p.guia}
            </Td>
            <Td width={170} mono color={palette.textDim}>
              {p.hora}
            </Td>
            <Td width={250} align="right" mono>
              {p.netoKg.toLocaleString("es-PE")}
            </Td>
          </Row>
        </Enter>
      ))}
    </Enter>

    <Enter delay={38}>
      <Foot tone="green">
        <Check size={26} />
        <div style={{ flex: 1, fontFamily: font.sans, fontSize: 19, color: palette.textDim }}>
          Cada parte conserva su vehículo y su guía: la trazabilidad no se pierde
        </div>
      </Foot>
    </Enter>
  </Screen>
);

/* ================================================================== */
/* 6. Guias                                                           */
/* ================================================================== */

export const GuiasScreen: React.FC = () => (
  <Screen>
    <AppBar title="Guías de transporte" right={<Chip label="2 guías" tone="steel" />} />

    <Enter delay={6}>
      <Row style={{ paddingTop: 0, borderBottom: `1px solid ${palette.line}` }}>
        <Th width={180}>Guía</Th>
        <Th width={260}>Transportista</Th>
        <Th width={150}>Placa</Th>
        <Th width={160}>Lote</Th>
        <Th width={210} align="right">
          Peso (kg)
        </Th>
      </Row>
      {guiasRecepcion.map((g, i) => (
        <Enter key={g.guia} delay={12 + i * 8}>
          <Row>
            <Td width={180} mono color={palette.steel}>
              {g.guia}
            </Td>
            <Td width={260} size={19}>
              {g.transportista}
            </Td>
            <Td width={150} mono>
              {g.placa}
            </Td>
            <Td width={160} mono>
              {g.lote}
            </Td>
            <Td width={210} align="right" mono color={palette.textDim}>
              {g.peso.toLocaleString("es-PE")}
            </Td>
          </Row>
        </Enter>
      ))}
    </Enter>

    <Enter delay={28}>
      <div
        style={{
          display: "flex",
          gap: 20,
          padding: "16px 22px",
          borderRadius: 12,
          background: palette.surfaceAlt,
          border: `1px solid ${palette.line}`,
        }}
      >
        <div style={{ flex: 1 }}>
          <Label>Documento</Label>
          <div style={{ fontFamily: font.sans, fontSize: 20, color: palette.text, marginTop: 5 }}>
            GR-88231 · Remisión de transporte
          </div>
        </div>
        <div style={{ width: 1, background: palette.line }} />
        <div style={{ flex: 1 }}>
          <Label>Agrupa</Label>
          <div style={{ fontFamily: font.sans, fontSize: 20, color: palette.text, marginTop: 5 }}>
            LT-0001 · Parte 1
          </div>
        </div>
      </div>
    </Enter>

    <Enter delay={36}>
      <Foot tone="amber">
        <div style={{ flex: 1, fontFamily: font.sans, fontSize: 19, color: palette.textDim }}>
          El peso en la guía es documental. El peso real es el de balanza.
        </div>
      </Foot>
    </Enter>
  </Screen>
);

/* ================================================================== */
/* 7. Cierre de leyes                                                 */
/* ================================================================== */

export const LeyesScreen: React.FC = () => (
  <Screen>
    <AppBar title="Cierre de leyes · LT-0001" right={<Chip label="2 análisis" tone="steel" />} />

    <Enter delay={6}>
      <Row style={{ paddingTop: 0, borderBottom: `1px solid ${palette.line}` }}>
        <Th width={140}>Ensayo</Th>
        <Th width={250}>Laboratorio</Th>
        <Th width={160}>Responsable</Th>
        <Th width={150} align="right">
          Au (g/t)
        </Th>
        <Th width={150} align="right">
          Ag (g/t)
        </Th>
        <Th width={100} align="right">
          Rec.
        </Th>
      </Row>
      {[
        { e: "EN-10428", r: "Proveedor", au: 3.55, ag: 22.1, rec: 87.4 },
        { e: "EN-10431", r: "Empresa", au: 3.29, ag: 20.9, rec: 87.4 },
      ].map((a, i) => (
        <Enter key={a.e} delay={12 + i * 8}>
          <Row>
            <Td width={140} mono>
              {a.e}
            </Td>
            <Td width={250} size={19}>
              {laboratorios.metalurgico}
            </Td>
            <Td width={160} size={19} color={palette.textDim}>
              {a.r}
            </Td>
            <Td width={150} align="right" mono>
              {a.au.toFixed(2)}
            </Td>
            <Td width={150} align="right" mono>
              {a.ag.toFixed(2)}
            </Td>
            <Td width={100} align="right" mono color={palette.textDim}>
              {a.rec.toFixed(1)}%
            </Td>
          </Row>
        </Enter>
      ))}
    </Enter>

    <Enter delay={30}>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ flex: 1 }}>
          <Stat label="Ley de cierre Au" value="3.42" unit="g/t" color={palette.amberBright} />
        </div>
        <div style={{ flex: 1 }}>
          <Stat label="Ley de cierre Ag" value="21.50" unit="g/t" color={palette.amberBright} />
        </div>
        <div style={{ flex: 1 }}>
          <Stat label="Humedad" value="6.8" unit="%" color={palette.steel} />
        </div>
        <div style={{ flex: 1 }}>
          <Stat label="Recuperación" value="87.4" unit="%" color={palette.green} />
        </div>
      </div>
    </Enter>

    <Enter delay={38}>
      <Foot tone="amber">
        <div style={{ flex: 1, fontFamily: font.sans, fontSize: 19, color: palette.textDim }}>
          Muestra MS-221 del proveedor enlazada al lote LT-0001
        </div>
        <Chip label="Promedio" tone="amber" />
      </Foot>
    </Enter>
  </Screen>
);

/* ================================================================== */
/* 8. Valorizacion de compra                                          */
/* ================================================================== */

export const CompraScreen: React.FC = () => (
  <Screen>
    <AppBar
      title="Valorización de compra"
      right={<Chip label="VC-2024-0001" tone="amber" />}
    />

    <Enter delay={6}>
      <div style={{ display: "flex", gap: 20 }}>
        <KV label="Proveedor" value={valorizacionCompra.proveedor} width={320} />
        <KV label="Lote" value={valorizacionCompra.lote} width={130} mono />
        <KV label="Neto" value="24.83 t" width={130} mono />
        <KV label="Estado" value="Aprobada" width={140} color={palette.green} />
      </div>
    </Enter>

    <Enter delay={16}>
      <div style={{ display: "flex", gap: 16 }}>
        <div
          style={{
            flex: 1,
            padding: "14px 18px",
            borderRadius: 12,
            background: palette.surfaceAlt,
            border: `1px solid ${palette.line}`,
          }}
        >
          <Label>Oro · ley de cierre 3.42 g/t</Label>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
            <div style={{ fontFamily: font.mono, fontSize: 27, color: palette.amberBright }}>
              US$ 6 513.16
            </div>
            <div style={{ fontFamily: font.sans, fontSize: 16, color: palette.textMute }}>
              84.92 g · 2.7302 oz
            </div>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: "14px 18px",
            borderRadius: 12,
            background: palette.surfaceAlt,
            border: `1px solid ${palette.line}`,
          }}
        >
          <Label>Plata · ley de cierre 21.50 g/t</Label>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
            <div style={{ fontFamily: font.mono, fontSize: 27, color: palette.text }}>
              US$ 453.12
            </div>
            <div style={{ fontFamily: font.sans, fontSize: 16, color: palette.textMute }}>
              533.84 g · 17.1635 oz
            </div>
          </div>
        </div>
      </div>
    </Enter>

    <Enter delay={26}>
      <div>
        <FormRow label="Subtotal" value="US$ 6 966.27" />
        <FormRow label={`Maquila ${maquilaPct.toFixed(2)}%`} value="− US$ 174.16" />
        <FormRow label="Anticipo aplicado" value="− US$ 1 500.00" tone="amber" />
        <FormRow label="Total a pagar" value="US$ 5 292.12" tone="green" />
      </div>
    </Enter>

    <Enter delay={36}>
      <Foot tone="amber">
        <div style={{ flex: 1, fontFamily: font.sans, fontSize: 18, color: palette.textDim }}>
          Precio internacional Au US$ 2 385.60/oz · Ag US$ 26.40/oz · sin
          penalidades
        </div>
      </Foot>
    </Enter>
  </Screen>
);

/* ================================================================== */
/* 9. Blending                                                        */
/* ================================================================== */

export const BlendingScreen: React.FC = () => (
  <Screen>
    <AppBar title="Blending" right={<Chip label="BL-0001" tone="amber" />} />

    <Enter delay={6}>
      <div style={{ display: "flex", gap: 20 }}>
        <KV label="Peso máximo" value="60.00 t" width={150} mono />
        <KV label="Au requerido" value="4.00 g/t" width={160} mono />
        <KV label="Ag requerido" value="24.00 g/t" width={160} mono />
        <KV label="Precio mineral" value="US$ 2 385.60/oz" width={230} mono />
      </div>
    </Enter>

    <Enter delay={16}>
      <Row style={{ paddingTop: 0, borderBottom: `1px solid ${palette.line}` }}>
        <Th width={170}>Lote</Th>
        <Th width={200} align="right">
          Peso (t)
        </Th>
        <Th width={200} align="right">
          Au (g/t)
        </Th>
        <Th width={290} align="right">
          Valor
        </Th>
      </Row>
      {blending.lotes.map((l, i) => (
        <Enter key={l.lote} delay={22 + i * 8}>
          <Row>
            <Td width={170} mono>
              {l.lote}
            </Td>
            <Td width={200} align="right" mono color={palette.textDim}>
              {l.t.toFixed(2)}
            </Td>
            <Td width={200} align="right" mono color={palette.textDim}>
              {l.au.toFixed(2)}
            </Td>
            <Td width={290} align="right" mono>
              US$ {l.valor.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </Td>
          </Row>
        </Enter>
      ))}
    </Enter>

    <Enter delay={44}>
      <Foot tone="green">
        <div style={{ flex: 1, display: "flex", gap: 26 }}>
          <div>
            <Label>Resultado</Label>
            <div style={{ fontFamily: font.mono, fontSize: 24, color: palette.text, marginTop: 4 }}>
              57.16 t
            </div>
          </div>
          <div>
            <Label>Au resultante</Label>
            <div
              style={{ fontFamily: font.mono, fontSize: 24, color: palette.amberBright, marginTop: 4 }}
            >
              4.12 g/t
            </div>
          </div>
          <div>
            <Label>Ag resultante</Label>
            <div style={{ fontFamily: font.mono, fontSize: 24, color: palette.text, marginTop: 4 }}>
              25.52 g/t
            </div>
          </div>
        </div>
      </Foot>
    </Enter>
  </Screen>
);

/* ================================================================== */
/* 10. Programacion de despachos                                      */
/* ================================================================== */

export const DespachoScreen: React.FC = () => (
  <Screen>
    <AppBar
      title="Programación de despachos"
      right={<Chip label="DP-2024-0031" tone="amber" />}
    />

    <Enter delay={6}>
      <div style={{ display: "flex", gap: 20 }}>
        <KV label="Cliente" value={despacho.cliente} width={320} />
        <KV label="Origen" value={despacho.origen} width={130} mono />
        <KV label="Toneladas" value="57.16 t" width={150} mono />
        <KV label="Vehículos" value="3" width={120} mono />
      </div>
    </Enter>

    <Enter delay={16}>
      <Row style={{ paddingTop: 0, borderBottom: `1px solid ${palette.line}` }}>
        <Th width={190}>Vehículo</Th>
        <Th width={200}>Guía</Th>
        <Th width={230} align="right">
          Carga (t)
        </Th>
        <Th width={230}>Programación</Th>
      </Row>
      {despacho.vehiculos.map((v, i) => (
        <Enter key={v.placa} delay={22 + i * 8}>
          <Row>
            <Td width={190} mono>
              {v.placa}
            </Td>
            <Td width={200} mono color={palette.steel}>
              {v.guia}
            </Td>
            <Td width={230} align="right" mono>
              {(v.carga / 1000).toFixed(2)}
            </Td>
            <Td width={230} size={18} color={palette.green}>
              Ingreso generado
            </Td>
          </Row>
        </Enter>
      ))}
    </Enter>

    <Enter delay={46}>
      <Foot tone="green">
        <Check size={26} />
        <div style={{ flex: 1, fontFamily: font.sans, fontSize: 19, color: palette.textDim }}>
          Llegada al cliente confirmada con código, peso y leyes
        </div>
      </Foot>
    </Enter>
  </Screen>
);

/* ================================================================== */
/* 11. Valorizacion de venta                                          */
/* ================================================================== */

export const VentaScreen: React.FC = () => (
  <Screen>
    <AppBar
      title="Valorización de venta"
      right={<Chip label="VV-2024-0007" tone="steel" />}
    />

    <Enter delay={6}>
      <div style={{ display: "flex", gap: 20 }}>
        <KV label="Cliente" value={valorizacionVenta.cliente} width={320} />
        <KV label="Despacho" value={valorizacionVenta.despacho} width={180} mono />
        <KV label="Lote enviado" value={valorizacionVenta.lote} width={150} mono />
        <KV label="Neto" value="57.16 t" width={140} mono />
      </div>
    </Enter>

    <Enter delay={16}>
      <div style={{ display: "flex", gap: 16 }}>
        <div
          style={{
            flex: 1,
            padding: "14px 18px",
            borderRadius: 12,
            background: palette.surfaceAlt,
            border: `1px solid ${palette.line}`,
          }}
        >
          <Label>Oro · 4.12 g/t</Label>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
            <div style={{ fontFamily: font.mono, fontSize: 27, color: palette.amberBright }}>
              US$ 18 232.21
            </div>
            <div style={{ fontFamily: font.sans, fontSize: 16, color: palette.textMute }}>
              7.5652 oz
            </div>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: "14px 18px",
            borderRadius: 12,
            background: palette.surfaceAlt,
            border: `1px solid ${palette.line}`,
          }}
        >
          <Label>Plata · 25.52 g/t</Label>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
            <div style={{ fontFamily: font.mono, fontSize: 27, color: palette.text }}>
              US$ 1 254.51
            </div>
            <div style={{ fontFamily: font.sans, fontSize: 16, color: palette.textMute }}>
              46.8975 oz
            </div>
          </div>
        </div>
      </div>
    </Enter>

    <Enter delay={28}>
      <div>
        <FormRow label="Precio del cliente Au" value="US$ 2 410.00 / oz" />
        <FormRow label="Precio del cliente Ag" value="US$ 26.75 / oz" />
        <FormRow label="Total de la valorización" value="US$ 19 486.72" tone="green" />
      </div>
    </Enter>

    <Enter delay={38}>
      <Foot tone="green">
        <Check size={26} />
        <div style={{ flex: 1, fontFamily: font.sans, fontSize: 19, color: palette.textDim }}>
          Lista para registrar el comprobante de venta
        </div>
      </Foot>
    </Enter>
  </Screen>
);

/* ================================================================== */
/* 12. Anticipos                                                      */
/* ================================================================== */

export const AnticiposScreen: React.FC = () => (
  <Screen>
    <AppBar title="Anticipos" right={<Chip label="Proveedores y clientes" tone="steel" />} />

    <Enter delay={6}>
      <SectionTitle>Dados a proveedores</SectionTitle>
      <Row style={{ paddingTop: 0, borderBottom: `1px solid ${palette.line}` }}>
        <Th width={140}>Código</Th>
        <Th width={300}>Beneficiario</Th>
        <Th width={200} align="right">
          Monto
        </Th>
        <Th width={280} align="right">
          Usado
        </Th>
      </Row>
      {anticiposProveedor.map((a, i) => (
        <Enter key={a.codigo} delay={12 + i * 8}>
          <Row>
            <Td width={140} mono>
              {a.codigo}
            </Td>
            <Td width={300} size={19}>
              {a.beneficiario}
            </Td>
            <Td width={200} align="right" mono>
              US$ {a.monto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </Td>
            <Td width={280} align="right" size={18} color={palette.textDim}>
              {a.en}
            </Td>
          </Row>
        </Enter>
      ))}
    </Enter>

    <Enter delay={32}>
      <SectionTitle>Recibidos de clientes</SectionTitle>
      <Row style={{ paddingTop: 0, borderBottom: `1px solid ${palette.line}` }}>
        <Th width={140}>Código</Th>
        <Th width={300}>Beneficiario</Th>
        <Th width={200} align="right">
          Monto
        </Th>
        <Th width={280} align="right">
          Usado
        </Th>
      </Row>
      {anticiposCliente.map((a, i) => (
        <Enter key={a.codigo} delay={38 + i * 8}>
          <Row>
            <Td width={140} mono>
              {a.codigo}
            </Td>
            <Td width={300} size={19}>
              {a.beneficiario}
            </Td>
            <Td width={200} align="right" mono>
              US$ {a.monto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </Td>
            <Td width={280} align="right" size={18} color={palette.textDim}>
              {a.en}
            </Td>
          </Row>
        </Enter>
      ))}
    </Enter>

    <Enter delay={56}>
      <Foot tone="amber">
        <div style={{ flex: 1, fontFamily: font.sans, fontSize: 19, color: palette.textDim }}>
          En cada anticipo se ve cuánto se usó y en qué comprobante
        </div>
      </Foot>
    </Enter>
  </Screen>
);

/* ================================================================== */
/* 13. Contabilidad: compra y venta                                    */
/* ================================================================== */

export const ContabilidadScreen: React.FC = () => (
  <Screen>
    <AppBar title="Contabilidad · compra y venta" right={<Chip label="2 comprobantes" tone="steel" />} />

    <Enter delay={6}>
      <SectionTitle>Comprobante de compra</SectionTitle>
      <Row style={{ paddingTop: 0, borderBottom: `1px solid ${palette.line}` }}>
        <Th width={190}>Comprobante</Th>
        <Th width={300}>Proveedor</Th>
        <Th width={210}>Valorización</Th>
        <Th width={240} align="right">
          Saldo
        </Th>
      </Row>
      <Row>
        <Td width={190} mono>
          {comprobanteCompra.codigo}
        </Td>
        <Td width={300} size={19}>
          {comprobanteCompra.proveedor}
        </Td>
        <Td width={210} mono color={palette.amberBright}>
          {comprobanteCompra.valorizacion}
        </Td>
        <Td width={240} align="right" mono>
          US$ 5 292.12
        </Td>
      </Row>
    </Enter>

    <Enter delay={26}>
      <SectionTitle>Comprobante de venta</SectionTitle>
      <Row style={{ paddingTop: 0, borderBottom: `1px solid ${palette.line}` }}>
        <Th width={190}>Comprobante</Th>
        <Th width={300}>Cliente</Th>
        <Th width={210}>Valorización</Th>
        <Th width={240} align="right">
          Saldo
        </Th>
      </Row>
      <Row>
        <Td width={190} mono>
          {comprobanteVenta.codigo}
        </Td>
        <Td width={300} size={19}>
          {comprobanteVenta.cliente}
        </Td>
        <Td width={210} mono color={palette.steel}>
          {comprobanteVenta.valorizacion}
        </Td>
        <Td width={240} align="right" mono>
          US$ 15 486.72
        </Td>
      </Row>
    </Enter>

    <Enter delay={46}>
      <Foot tone="green">
        <Check size={26} />
        <div style={{ flex: 1, fontFamily: font.sans, fontSize: 19, color: palette.textDim }}>
          Anticipos deducidos automáticamente: US$ 1 500.00 y US$ 4 000.00
        </div>
      </Foot>
    </Enter>
  </Screen>
);

/* ================================================================== */
/* 14. Ciclo completo (video general)                                  */
/* ================================================================== */

export const CicloScreen: React.FC<{ activo?: number }> = ({ activo }) => {
  const frame = useCurrentFrame();

  return (
    <Screen>
      <AppBar title="ERP COMERCIAL" right={<Chip label="Ciclo completo" tone="amber" />} />

      <Enter delay={4}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }}
        >
          {cicloModulos.map((m, i) => {
            const on = i === activo;
            // Onda suave: los modulos se van encendiendo en orden, como
            // si el ciclo estuviera recorriéndose.
            const wave = 0.5 + 0.5 * Math.sin((frame / 16) * Math.PI * 2 - i * 0.42);
            const border = on
              ? "rgba(224,162,71,0.85)"
              : `rgba(224,162,71,${(0.10 + wave * 0.26).toFixed(3)})`;
            return (
              <div
                key={m}
                style={{
                  padding: "15px 14px",
                  borderRadius: 12,
                  background: on
                    ? "rgba(224,162,71,0.16)"
                    : `rgba(224,162,71,${(wave * 0.05).toFixed(3)})`,
                  border: `1px solid ${border}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  justifyContent: "space-between",
                  minHeight: 92,
                }}
              >
                <div
                  style={{
                    fontFamily: font.mono,
                    fontSize: 15,
                    color: on ? palette.amberBright : palette.textMute,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  style={{
                    fontFamily: font.sans,
                    fontWeight: 600,
                    fontSize: 19,
                    lineHeight: 1.15,
                    color: on ? palette.text : palette.textDim,
                  }}
                >
                  {m}
                </div>
              </div>
            );
          })}
        </div>
      </Enter>

      <Enter delay={20}>
        <Foot tone="amber">
          <div style={{ flex: 1, fontFamily: font.sans, fontSize: 19, color: palette.textDim }}>
            Un solo sistema para toda la operación de mineral
          </div>
        </Foot>
      </Enter>
    </Screen>
  );
};

/* ================================================================== */
/* Registro de pantallas por identificador                             */
/* ================================================================== */

export const SCREENS: Record<string, React.FC<{ activo?: number }>> = {
  programacion: ProgramacionScreen,
  recepcion: RecepcionScreen,
  visitas: VisitasScreen,
  balanza: BalanzaScreen,
  validacion: ValidacionScreen,
  guias: GuiasScreen,
  leyes: LeyesScreen,
  compra: CompraScreen,
  blending: BlendingScreen,
  despacho: DespachoScreen,
  venta: VentaScreen,
  anticipos: AnticiposScreen,
  contabilidad: ContabilidadScreen,
};
