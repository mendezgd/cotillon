import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { processPayment } from '../services/paymentService';
import { getShippingCost } from '../services/argentina';
import type { ShippingFormData, CardFormData } from '../services/validationSchemas';
import type { PaymentMethod, PaymentStatus } from '../types';

export type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

export function useCheckout() {
  const { items, subtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [shipping, setShipping] = useState<ShippingFormData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  const shippingCost = getShippingCost(subtotal(), shipping?.province ?? '');
  const total = subtotal() + shippingCost;

  const submitShipping = (data: ShippingFormData) => {
    setShipping(data);
    setStep('payment');
  };

  const submitPayment = async (method: PaymentMethod, cardData?: CardFormData) => {
    setPaymentStatus('processing');
    setPaymentMethod(method);
    setErrorMessage(null);

    const result = await processPayment(
      {
        paymentMethod: method,
        cardNumber: cardData?.cardNumber,
        cardHolder: cardData?.cardHolder,
        expiry: cardData?.expiry,
        cvv: cardData?.cvv,
        installments: cardData?.installments,
      },
      { items, subtotal: subtotal(), shipping: shippingCost, total },
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
    setPaymentMethod(null);
  };

  return {
    step,
    shipping,
    paymentStatus,
    paymentMethod,
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
