import type { PaymentData, PaymentMethod, OrderSummary, PaymentStatus } from '../types';

export interface PaymentResult {
  status: PaymentStatus;
  transactionId?: string;
  errorMessage?: string;
}

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function luhnCheck(number: string): boolean {
  const digits = number.replace(/\s/g, '').split('').reverse().map(Number);
  const sum = digits.reduce((acc, digit, i) => {
    if (i % 2 === 1) {
      const doubled = digit * 2;
      return acc + (doubled > 9 ? doubled - 9 : doubled);
    }
    return acc + digit;
  }, 0);
  return sum % 10 === 0;
}

function makeTransactionId(method: PaymentMethod) {
  const prefix = method === 'mercadopago' ? 'MP' : method === 'transfer' ? 'TRF' : 'TXN';
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export async function processPayment(
  payment: PaymentData,
  _order: OrderSummary,
): Promise<PaymentResult> {
  await delay(1800);

  if (payment.paymentMethod === 'card') {
    const cardRaw = (payment.cardNumber ?? '').replace(/\s/g, '');
    if (!luhnCheck(cardRaw)) {
      return { status: 'error', errorMessage: 'Número de tarjeta inválido.' };
    }
    if (Math.random() < 0.08) {
      return { status: 'error', errorMessage: 'Error de red. Por favor intentá de nuevo.' };
    }
  }

  /* MercadoPago & transfer: always "succeed" at this simulated stage */
  const transactionId = makeTransactionId(payment.paymentMethod);
  return { status: 'success', transactionId };
}

export function maskCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}
