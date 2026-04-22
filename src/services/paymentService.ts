import type { PaymentData, OrderSummary, PaymentStatus } from '../types';

export interface PaymentResult {
  status: PaymentStatus;
  transactionId?: string;
  errorMessage?: string;
}

// Simulated SDK — replace with real Mercado Pago / Stripe SDK calls
const simulateNetworkDelay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

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

export async function processPayment(
  payment: PaymentData,
  order: OrderSummary,
): Promise<PaymentResult> {
  await simulateNetworkDelay(2000);

  const cardRaw = payment.cardNumber.replace(/\s/g, '');
  if (!luhnCheck(cardRaw)) {
    return { status: 'error', errorMessage: 'Número de tarjeta inválido.' };
  }

  // Simulate random network failure ~10% of the time
  if (Math.random() < 0.1) {
    return {
      status: 'error',
      errorMessage: 'Error de red. Por favor intentá de nuevo.',
    };
  }

  const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  console.info('[PaymentService] Payment approved', {
    transactionId,
    amount: order.total,
  });

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
