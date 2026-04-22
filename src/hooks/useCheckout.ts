import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { processPayment } from '../services/paymentService';
import type { ShippingFormData, PaymentFormData } from '../services/validationSchemas';
import type { PaymentStatus } from '../types';

export type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

export function useCheckout() {
  const { items, subtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [shipping, setShipping] = useState<ShippingFormData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const shippingCost = subtotal() >= 10000 ? 0 : 850;
  const total = subtotal() + shippingCost;

  const submitShipping = (data: ShippingFormData) => {
    setShipping(data);
    setStep('payment');
  };

  const submitPayment = async (data: PaymentFormData) => {
    setPaymentStatus('processing');
    setErrorMessage(null);

    const result = await processPayment(
      {
        cardNumber: data.cardNumber,
        cardHolder: data.cardHolder,
        expiry: data.expiry,
        cvv: data.cvv,
      },
      {
        items,
        subtotal: subtotal(),
        shipping: shippingCost,
        total,
      },
    );

    if (result.status === 'success') {
      setTransactionId(result.transactionId ?? null);
      setPaymentStatus('success');
      clearCart();
      setStep('confirmation');
    } else {
      setPaymentStatus('error');
      setErrorMessage(result.errorMessage ?? 'Error desconocido');
    }
  };

  const reset = () => {
    setStep('shipping');
    setShipping(null);
    setPaymentStatus('idle');
    setTransactionId(null);
    setErrorMessage(null);
  };

  return {
    step,
    shipping,
    paymentStatus,
    transactionId,
    errorMessage,
    shippingCost,
    total,
    submitShipping,
    submitPayment,
    reset,
    setStep,
  };
}
