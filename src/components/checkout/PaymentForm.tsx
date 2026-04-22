/* Reference: ./DESIGN.md §4 Buttons & Inputs */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, Lock, User } from 'lucide-react';
import { paymentSchema, type PaymentFormData } from '../../services/validationSchemas';
import { FormField } from '../ui/FormField';
import { maskCardNumber, formatExpiry } from '../../services/paymentService';
import type { PaymentStatus } from '../../types';

const BTN_INSET =
  'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px';

interface Props {
  onSubmit: (data: PaymentFormData) => Promise<void>;
  status: PaymentStatus;
  errorMessage: string | null;
  onBack: () => void;
}

export function PaymentForm({ onSubmit, status, errorMessage, onBack }: Props) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const isProcessing = status === 'processing';

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1c1c1c', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Lock style={{ width: 14, height: 14, color: '#5f5f5d' }} /> Pago seguro
      </h3>

      {/* Security notice */}
      <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#5f5f5d', backgroundColor: 'rgba(28,28,28,0.03)', border: '1px solid #eceae4', borderRadius: '6px', padding: '10px 12px' }}>
        <Lock style={{ width: 12, height: 12, flexShrink: 0, marginTop: '1px' }} />
        Tus datos están encriptados y protegidos.
      </div>

      <FormField
        label="Número de tarjeta"
        icon={<CreditCard style={{ width: 13, height: 13 }} />}
        placeholder="1234 5678 9012 3456"
        inputMode="numeric"
        maxLength={19}
        error={errors.cardNumber}
        {...register('cardNumber', {
          onChange: (e) => setValue('cardNumber', maskCardNumber(e.target.value)),
        })}
      />
      <FormField
        label="Titular de la tarjeta"
        icon={<User style={{ width: 13, height: 13 }} />}
        placeholder="MARIA GARCIA"
        error={errors.cardHolder}
        {...register('cardHolder')}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField
          label="Vencimiento (MM/AA)"
          placeholder="08/27"
          maxLength={5}
          error={errors.expiry}
          {...register('expiry', {
            onChange: (e) => setValue('expiry', formatExpiry(e.target.value)),
          })}
        />
        <FormField
          label="CVV"
          type="password"
          placeholder="···"
          maxLength={4}
          inputMode="numeric"
          error={errors.cvv}
          {...register('cvv')}
        />
      </div>

      {errorMessage && (
        <div style={{ fontSize: '12px', color: 'rgb(220,38,38)', backgroundColor: 'rgb(254,242,242)', border: '1px solid rgb(252,165,165)', borderRadius: '6px', padding: '10px 12px' }}>
          {errorMessage}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
        {/* Ghost button */}
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#1c1c1c',
            backgroundColor: 'transparent',
            border: '1px solid rgba(28,28,28,0.4)',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            opacity: isProcessing ? 0.4 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          ← Volver
        </button>

        {/* Primary Dark button */}
        <button
          type="submit"
          disabled={isProcessing}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#fcfbf8',
            backgroundColor: '#1c1c1c',
            border: 'none',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            opacity: isProcessing ? 0.7 : 1,
            boxShadow: BTN_INSET,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'opacity 0.15s',
          }}
        >
          {isProcessing ? (
            <>
              <span style={{ width: '12px', height: '12px', border: '2px solid rgba(252,251,248,0.3)', borderTopColor: '#fcfbf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
              Procesando...
            </>
          ) : (
            'Pagar ahora'
          )}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
