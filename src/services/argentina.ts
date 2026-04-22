export const PROVINCES = [
  'CABA',
  'Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
] as const;

export type Province = (typeof PROVINCES)[number];

const ZONE_1 = new Set(['CABA', 'Buenos Aires']);
const ZONE_2 = new Set(['Córdoba', 'Santa Fe', 'Entre Ríos', 'Mendoza', 'La Pampa', 'San Luis']);

export function getShippingCost(subtotal: number, province: string): number {
  if (subtotal >= 10_000) return 0;
  if (ZONE_1.has(province)) return 850;
  if (ZONE_2.has(province)) return 1_500;
  return 2_500;
}

export function getShippingEta(province: string): string {
  if (ZONE_1.has(province)) return '2–3 días hábiles';
  if (ZONE_2.has(province)) return '3–5 días hábiles';
  return '5–8 días hábiles';
}

export const INSTALLMENT_OPTIONS = [
  { value: 1,  label: '1 pago sin interés' },
  { value: 3,  label: '3 cuotas sin interés' },
  { value: 6,  label: '6 cuotas sin interés' },
  { value: 12, label: '12 cuotas sin interés' },
];

/* Bank transfer info — replace with real CBU/alias */
export const TRANSFER_INFO = {
  bank:    'Banco Galicia',
  cbu:     '0070199420000000123456',
  alias:   'fiestamagica.ar',
  cuit:    '20-12345678-9',
  owner:   'FiestaMágica SRL',
};

/* MercadoPago info */
export const MP_INFO = {
  alias: 'fiestamagica.mp',
  link:  'https://link.mercadopago.com.ar/fiestamagica',
};
