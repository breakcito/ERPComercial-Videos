/**
 * Datos ficticios de la serie.
 *
 * Todo lo que aparece en pantalla sale de aqui, para que los 14 videos
 * hablen del mismo caso: el mismo proveedor, el mismo camion, el mismo
 * lote, el mismo cliente. Los importes son coherentes entre si (el neto
 * sale del bruto menos la tara, el valor sale de la ley por el precio).
 */

/* ------------------------------------------------------------------ */
/* Personas y empresas                                                */
/* ------------------------------------------------------------------ */

export const proveedores = {
  andes: {
    nombre: "Minera Los Andes S.A.C.",
    zona: "Cerro Rico",
    producto: "Aurífero",
    material: "Mixto",
    telefono: "987 654 210",
  },
  roman: {
    nombre: "Cooperativa Minera San Román",
    zona: "Cerro Azul",
    producto: "Aurífero",
    material: "Sulfuro",
    telefono: "912 445 780",
  },
  faro: {
    nombre: "Minera El Faro S.A.C.",
    zona: "Pampa Alta",
    producto: "Polimetálico",
    material: "Óxido",
    telefono: "934 118 205",
  },
} as const;

export const transportistas = {
  norte: "Transportes del Norte S.A.C.",
  andinos: "Transportes Andinos S.R.L.",
} as const;

export const clientes = {
  aurora: "Planta de Beneficio Aurora S.A.C.",
  norte: "Comercializadora del Norte E.I.R.L.",
} as const;

export const laboratorios = {
  metalurgico: "Laboratorio Metalúrgico Andes",
  central: "Lab. Central Intellab",
} as const;

export const unidades = [
  {
    id: "U-2024-0114",
    transportista: transportistas.norte,
    placa: "ABC-123",
    conductor: "Juan Ccahuana Mamani",
    vehiculo: "Volquete 3 ejes",
    guia: "GR-88231",
    ingreso: "08:42",
    salida: "09:58",
    programado: true,
    acompanante: "Jorge Mamani",
  },
  {
    id: "U-2024-0115",
    transportista: transportistas.andinos,
    placa: "UV-456",
    conductor: "Luis Rojas Chambilla",
    vehiculo: "Volquete 4 ejes",
    guia: "—",
    ingreso: "10:16",
    salida: "11:40",
    programado: false,
    acompanante: "—",
  },
] as const;

export const visitas = [
  {
    id: "V-2024-0031",
    motivo: "Entrega de agua",
    visitante: "Distribuidora Hidrosur S.A.C.",
    documento: "RUC 2050-88214-3",
    autoriza: "Ing. Raúl Medina · Jefe de Planta",
    ingreso: "09:12",
    salida: "09:48",
  },
  {
    id: "V-2024-0032",
    motivo: "Almuerzo del personal",
    visitante: "Restaurante El Hornero",
    documento: "RUC 2049-55170-8",
    autoriza: "Sra. Carmen Rojas · Contabilidad",
    ingreso: "12:05",
    salida: "12:41",
  },
  {
    id: "V-2024-0033",
    motivo: "Entrevista de trabajo",
    visitante: "Diego Alonso",
    documento: "DNI 71-483 290",
    autoriza: "Sra. Carmen Rojas · RR.HH.",
    ingreso: "16:20",
    salida: "17:02",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Lotes y pesajes                                                    */
/* ------------------------------------------------------------------ */

export const lotes = [
  {
    id: "LT-0001",
    proveedor: proveedores.andes.nombre,
    producto: "Aurífero",
    material: "Mixto",
    zona: "Cerro Rico",
    netoKg: 24830,
    au: 3.42,
    ag: 21.5,
    humedad: 6.8,
    recuperacion: 87.4,
    ensayo: "EN-10428",
    particionado: true,
  },
  {
    id: "LT-0002",
    proveedor: proveedores.roman.nombre,
    producto: "Aurífero",
    material: "Sulfuro",
    zona: "Cerro Azul",
    netoKg: 18420,
    au: 4.85,
    ag: 31.2,
    humedad: 8.2,
    recuperacion: 84.1,
    ensayo: "EN-10435",
    particionado: false,
  },
  {
    id: "LT-0003",
    proveedor: proveedores.faro.nombre,
    producto: "Polimetálico",
    material: "Óxido",
    zona: "Pampa Alta",
    netoKg: 21960,
    au: 2.75,
    ag: 18.4,
    humedad: 5.4,
    recuperacion: 79.8,
    ensayo: "EN-10441",
    particionado: false,
  },
  {
    id: "LT-0004",
    proveedor: proveedores.andes.nombre,
    producto: "Aurífero",
    material: "Mixto",
    zona: "Cerro Rico",
    netoKg: 16780,
    au: 5.1,
    ag: 28.6,
    humedad: 7.1,
    recuperacion: 89.0,
    ensayo: "EN-10452",
    particionado: false,
  },
] as const;

export const lote1 = lotes[0];

/** Partes en que llego el lote LT-0001 (llego en dos unidades). */
export const partesLote1 = [
  {
    parte: "Parte 1",
    placa: "ABC-123",
    transportista: transportistas.norte,
    guia: "GR-88231",
    taraKg: 22480,
    brutoKg: 35440,
    netoKg: 12960,
    hora: "08:42",
  },
  {
    parte: "Parte 2",
    placa: "XYZ-789",
    transportista: transportistas.norte,
    guia: "GR-88232",
    taraKg: 21960,
    brutoKg: 33830,
    netoKg: 11870,
    hora: "09:35",
  },
] as const;

/** Ticket de balanza del lote LT-0001 (una fila por unidad). */
export const pesajesLote1 = [
  { unidad: "ABC-123", tara: 22480, bruto: 35440, neto: 12960 },
  { unidad: "XYZ-789", tara: 21960, bruto: 33830, neto: 11870 },
] as const;

/* ------------------------------------------------------------------ */
/* Guias                                                              */
/* ------------------------------------------------------------------ */

export const guiasRecepcion = [
  {
    guia: "GR-88231",
    transportista: transportistas.norte,
    placa: "ABC-123",
    lote: "LT-0001",
    peso: 12960,
    tipo: "Transporte",
  },
  {
    guia: "GR-88232",
    transportista: transportistas.norte,
    placa: "XYZ-789",
    lote: "LT-0001",
    peso: 11870,
    tipo: "Remisión",
  },
] as const;

export const guiasDespacho = [
  { guia: "GR-88240", placa: "ABC-123", carga: 19050 },
  { guia: "GR-88247", placa: "UV-456", carga: 19050 },
  { guia: "GR-88255", placa: "XYZ-789", carga: 19060 },
] as const;

/* ------------------------------------------------------------------ */
/* Cierre de leyes                                                    */
/* ------------------------------------------------------------------ */

export const analisisLote1 = [
  {
    id: "AN-1",
    laboratorio: laboratorios.metalurgico,
    responsable: "Proveedor",
    ensayo: "EN-10428",
    au: 3.55,
    ag: 22.1,
    humedad: 6.8,
    recuperacion: 87.4,
  },
  {
    id: "AN-2",
    laboratorio: laboratorios.metalurgico,
    responsable: "Empresa",
    ensayo: "EN-10431",
    au: 3.29,
    ag: 20.9,
    humedad: 6.8,
    recuperacion: 87.4,
  },
] as const;

/** Analisis de la muestra que el proveedor envio antes del mineral. */
export const analisisMuestra = {
  id: "MS-221",
  laboratorio: laboratorios.metalurgico,
  responsable: "Proveedor",
  ensayo: "EN-10398",
  au: 3.6,
  ag: 21.8,
  humedad: 6.8,
  recuperacion: 87.4,
} as const;

/* ------------------------------------------------------------------ */
/* Valorizaciones                                                     */
/* ------------------------------------------------------------------ */

export const precioInternacional = { au: 2385.6, ag: 26.4 };
export const precioCliente = { au: 2410.0, ag: 26.75 };
export const maquilaPct = 2.5;

/** Valorizacion de compra de LT-0001 (Minera Los Andes). */
export const valorizacionCompra = {
  codigo: "VC-2024-0001",
  proveedor: proveedores.andes.nombre,
  lote: "LT-0001",
  netoT: 24.83,
  auGramos: 84.92,
  auOz: 2.7302,
  auValor: 6513.16,
  agGramos: 533.84,
  agOz: 17.1635,
  agValor: 453.12,
  subtotal: 6966.27,
  maquila: 174.16,
  total: 6792.12,
  anticipo: 1500.0,
  saldo: 5292.12,
} as const;

/** Blending BL-0001: LT-0002 + LT-0003 + LT-0004. */
export const blending = {
  codigo: "BL-0001",
  lotes: [
    { lote: "LT-0002", t: 18.42, au: 4.85, valor: 6852.04 },
    { lote: "LT-0003", t: 21.96, au: 2.75, valor: 4631.84 },
    { lote: "LT-0004", t: 16.78, au: 5.1, valor: 6563.73 },
  ],
  pesoT: 57.16,
  au: 4.12,
  ag: 25.52,
  valor: 18047.61,
} as const;

/** Valorizacion de venta de BL-0001 a Planta de Beneficio Aurora. */
export const valorizacionVenta = {
  codigo: "VV-2024-0007",
  cliente: clientes.aurora,
  despacho: "DP-2024-0031",
  lote: "BL-0001",
  netoT: 57.16,
  auGramos: 235.31,
  auOz: 7.5652,
  auValor: 18232.21,
  agGramos: 1458.68,
  agOz: 46.8975,
  agValor: 1254.51,
  total: 19486.72,
  anticipo: 4000.0,
  saldo: 15486.72,
} as const;

/* ------------------------------------------------------------------ */
/* Despacho, anticipos y contabilidad                                  */
/* ------------------------------------------------------------------ */

export const despacho = {
  codigo: "DP-2024-0031",
  cliente: clientes.aurora,
  origen: "BL-0001",
  pesoT: 57.16,
  vehiculos: [
    { placa: "ABC-123", carga: 19050, guia: "GR-88240" },
    { placa: "UV-456", carga: 19050, guia: "GR-88247" },
    { placa: "XYZ-789", carga: 19060, guia: "GR-88255" },
  ],
} as const;

export const anticiposProveedor = [
  {
    codigo: "AP-0001",
    beneficiario: proveedores.andes.nombre,
    monto: 1500.0,
    usado: 1500.0,
    en: "VC-2024-0001 · LT-0001",
  },
  {
    codigo: "AP-0002",
    beneficiario: proveedores.roman.nombre,
    monto: 2000.0,
    usado: 0.0,
    en: "Sin aplicar",
  },
] as const;

export const anticiposCliente = [
  {
    codigo: "AC-0001",
    beneficiario: clientes.aurora,
    monto: 4000.0,
    usado: 4000.0,
    en: "F001-00000741 · BL-0001",
  },
  {
    codigo: "AC-0002",
    beneficiario: clientes.norte,
    monto: 1200.0,
    usado: 0.0,
    en: "Sin aplicar",
  },
] as const;

export const comprobanteCompra = {
  codigo: "F001-00001234",
  tipo: "Compra de mineral",
  proveedor: proveedores.andes.nombre,
  valorizacion: "VC-2024-0001",
  total: 6792.12,
  anticipo: 1500.0,
  saldo: 5292.12,
} as const;

export const comprobanteVenta = {
  codigo: "F001-00000741",
  tipo: "Venta de mineral",
  cliente: clientes.aurora,
  valorizacion: "VV-2024-0007",
  total: 19486.72,
  anticipo: 4000.0,
  saldo: 15486.72,
} as const;

export const condicionesComerciales = [
  {
    tercero: proveedores.andes.nombre,
    tipo: "Proveedor",
    elemento: "Oro (Au)",
    leyInicio: "0.00",
    leyFin: "5.00 g/t",
    maquila: "US$ 180",
    recup: "90%",
    consumo: "US$ 25",
    riesgo: "US$ 15",
  },
  {
    tercero: proveedores.andes.nombre,
    tipo: "Proveedor",
    elemento: "Oro (Au)",
    leyInicio: "5.01",
    leyFin: "15.00 g/t",
    maquila: "US$ 160",
    recup: "92%",
    consumo: "US$ 20",
    riesgo: "US$ 12",
  },
  {
    tercero: clientes.aurora,
    tipo: "Cliente",
    elemento: "Plata (Ag)",
    leyInicio: "10.00",
    leyFin: "50.00 g/t",
    maquila: "US$ 120",
    recup: "85%",
    consumo: "US$ 15",
    riesgo: "US$ 10",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Ciclo completo (para el video general)                              */
/* ------------------------------------------------------------------ */

export const cicloModulos = [
  "Programación",
  "Recepción",
  "Balanza",
  "Validación",
  "Guías",
  "Cierre de leyes",
  "Valorización compra",
  "Blending",
  "Despachos",
  "Valorización venta",
  "Anticipos",
  "Contabilidad",
] as const;
