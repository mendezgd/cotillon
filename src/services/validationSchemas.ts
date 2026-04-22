import { z } from 'zod';
import { PROVINCES } from './argentina';

export const shippingSchema = z.object({
  fullName: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(80)
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Solo se permiten letras'),
  dni: z
    .string()
    .regex(/^\d{7,8}$/, 'DNI inválido (7 u 8 dígitos sin puntos)'),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{8,15}$/, 'Teléfono inválido (ej: 11 1234-5678)'),
  address: z.string().min(5, 'Dirección muy corta').max(120),
  city: z.string().min(2, 'Ciudad requerida'),
  province: z.string().refine((v) => (PROVINCES as readonly string[]).includes(v), 'Seleccioná una provincia'),
  postalCode: z
    .string()
    .regex(/^[A-Z]?\d{4}[A-Z]{0,3}$/, 'Código postal inválido (ej: 1043 o B1234ABC)'),
});

export const cardSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^[\d\s]{19}$/, 'Número de tarjeta inválido'),
  cardHolder: z
    .string()
    .min(3, 'Nombre requerido')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Solo letras'),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato MM/AA')
    .refine((val) => {
      const [month, year] = val.split('/').map(Number);
      return new Date(2000 + year, month - 1) >= new Date();
    }, 'Tarjeta vencida'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV inválido'),
  installments: z.number().int().min(1),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;
export type CardFormData = z.infer<typeof cardSchema>;
/* Kept for backwards compat with useCheckout */
export type PaymentFormData = CardFormData;
