/* Reference: ./DESIGN.md §4 Buttons & Inputs */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, Lock, User, Building2, Smartphone, Copy, Check } from 'lucide-react';
import { cardSchema, type CardFormData } from '../../services/validationSchemas';
import { INSTALLMENT_OPTIONS, TRANSFER_INFO, MP_INFO } from '../../services/argentina';
import { FormField } from '../ui/FormField';
import { maskCardNumber, formatExpiry } from '../../services/paymentService';
import type { PaymentMethod, PaymentStatus } from '../../types';

interface Props {
  onSubmit: (method: PaymentMethod, cardData?: CardFormData) => Promise<void>;
  status: PaymentStatus;
  errorMessage: string | null;
  onBack: () => void;
}

const METHOD_OPTIONS: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { id: 'mercadopago', label: 'MercadoPago', icon: <Smartphone style={{ width: 15, height: 15 }} /> },
  { id: 'card',        label: 'Tarjeta',     icon: <CreditCard style={{ width: 15, height: 15 }} /> },
  { id: 'transfer',    label: 'Transferencia', icon: <Building2 style={{ width: 15, height: 15 }} /> },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button onClick={handleCopy} type="button" style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500,
      color: 'var(--text-muted)', backgroundColor: 'var(--tint)', border: '1px solid var(--border)',
      cursor: 'pointer', transition: 'color 0.15s',
    }}>
      {copied ? <Check style={{ width: 11, height: 11 }} /> : <Copy style={{ width: 11, height: 11 }} />}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
}

export function PaymentForm({ onSubmit, status, errorMessage, onBack }: Props) {
  const [method, setMethod] = useState<PaymentMethod>('mercadopago');
  const isProcessing = status === 'processing';

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: { installments: 1 },
  });

  const handleCardSubmit = (data: CardFormData) => onSubmit('card', data);
  const handleConfirm = () => onSubmit(method);

  const btnBase: React.CSSProperties = {
    padding: '11px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
    border: 'none', cursor: isProcessing ? 'not-allowed' : 'pointer',
    transition: 'opacity 0.15s', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Lock style={{ width: 14, height: 14, color: 'var(--text-muted)' }} /> Método de pago
      </h3>

      {/* Method selector */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {METHOD_OPTIONS.map(({ id, label, icon }) => {
          const active = method === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setMethod(id)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '9px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
                backgroundColor: active ? 'var(--action-bg)' : 'var(--bg)',
                color: active ? 'var(--action-text)' : 'var(--text-muted)',
                border: active ? '1px solid transparent' : '1px solid var(--border)',
                boxShadow: active ? 'var(--btn-shadow)' : 'none',
              }}
            >
              {icon}{label}
            </button>
          );
        })}
      </div>

      {/* ── MercadoPago ── */}
      {method === 'mercadopago' && (
        <TransferPanel
          emoji="🔵"
          title="Transferencia por MercadoPago"
          rows={[
            { label: 'Alias MP', value: MP_INFO.alias, copy: true },
          ]}
          instructions={`Realizá la transferencia al alias de MercadoPago y enviá el comprobante a ventas@fiestamagica.ar con tu nombre y número de orden. Confirmamos el pedido al recibir el comprobante.`}
          isProcessing={isProcessing}
          errorMessage={errorMessage}
          onBack={onBack}
          onConfirm={handleConfirm}
          confirmLabel="Confirmar pedido"
          btnBase={btnBase}
        />
      )}

      {/* ── Tarjeta ── */}
      {method === 'card' && (
        <form onSubmit={handleSubmit(handleCardSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Card network badges */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <CardBadge label="VISA" color="#1a1f71" />
            <CardBadge label="MASTERCARD" color="#eb001b" color2="#f79e1b" />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>Débito y crédito</span>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)', backgroundColor: 'var(--tint)', border: '1px solid var(--border)', borderRadius: '6px', padding: '10px 12px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <Lock style={{ width: 12, height: 12, flexShrink: 0, marginTop: '1px' }} />
            Tus datos están encriptados. No almacenamos información de tarjetas.
          </div>

          <FormField
            label="Número de tarjeta"
            icon={<CreditCard style={{ width: 13, height: 13 }} />}
            placeholder="1234 5678 9012 3456"
            inputMode="numeric"
            maxLength={19}
            error={errors.cardNumber}
            {...register('cardNumber', { onChange: (e) => setValue('cardNumber', maskCardNumber(e.target.value)) })}
          />
          <FormField
            label="Titular de la tarjeta"
            icon={<User style={{ width: 13, height: 13 }} />}
            placeholder="MARIA GARCIA"
            error={errors.cardHolder}
            {...register('cardHolder')}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <FormField
              label="Vencimiento (MM/AA)"
              placeholder="08/27"
              maxLength={5}
              error={errors.expiry}
              {...register('expiry', { onChange: (e) => setValue('expiry', formatExpiry(e.target.value)) })}
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

          {/* Cuotas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>Cuotas</label>
            <select
              {...register('installments', { valueAsNumber: true })}
              style={{
                width: '100%', padding: '8px 10px', borderRadius: '6px', fontSize: '13px',
                color: 'var(--text)', backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)', outline: 'none', fontFamily: 'inherit', appearance: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-act)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              {INSTALLMENT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {errorMessage && <ErrorBox message={errorMessage} />}

          <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
            <button type="button" onClick={onBack} disabled={isProcessing} style={{ ...btnBase, flex: 1, color: 'var(--text)', backgroundColor: 'transparent', border: '1px solid var(--border-act)', opacity: isProcessing ? 0.4 : 1 }}>
              ← Volver
            </button>
            <button type="submit" disabled={isProcessing} style={{ ...btnBase, flex: 2, color: 'var(--action-text)', backgroundColor: 'var(--action-bg)', boxShadow: 'var(--btn-shadow)', opacity: isProcessing ? 0.7 : 1 }}>
              {isProcessing
                ? <><Spinner />Procesando...</>
                : 'Pagar ahora'}
            </button>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </form>
      )}

      {/* ── Transferencia bancaria ── */}
      {method === 'transfer' && (
        <TransferPanel
          emoji="🏦"
          title="Transferencia bancaria"
          rows={[
            { label: 'Banco',   value: TRANSFER_INFO.bank },
            { label: 'CBU',     value: TRANSFER_INFO.cbu,   copy: true, mono: true },
            { label: 'Alias',   value: TRANSFER_INFO.alias, copy: true, mono: true },
            { label: 'CUIT',    value: TRANSFER_INFO.cuit,  mono: true },
            { label: 'Titular', value: TRANSFER_INFO.owner },
          ]}
          instructions={`Realizá la transferencia y enviá el comprobante a ventas@fiestamagica.ar con tu nombre y número de orden. Confirmamos el pedido al recibir el comprobante (24 hs hábiles).`}
          isProcessing={isProcessing}
          errorMessage={errorMessage}
          onBack={onBack}
          onConfirm={handleConfirm}
          confirmLabel="Confirmar pedido"
          btnBase={btnBase}
        />
      )}
    </div>
  );
}

/* ── Small helpers ── */

function Spinner() {
  return (
    <span style={{ width: '12px', height: '12px', border: '2px solid rgba(28,28,28,0.2)', borderTopColor: 'var(--action-text)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div style={{ fontSize: '12px', color: 'rgb(220,38,38)', backgroundColor: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: '6px', padding: '10px 12px' }}>
      {message}
    </div>
  );
}

function CardBadge({ label, color, color2 }: { label: string; color: string; color2?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, display: 'inline-block' }} />
      {color2 && <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color2, display: 'inline-block', marginLeft: '-4px' }} />}
      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.03em' }}>{label}</span>
    </div>
  );
}

function ActionButtons({ isProcessing, onBack, onConfirm, label, btnBase }: {
  isProcessing: boolean; onBack: () => void; onConfirm: () => void; label: string; btnBase: React.CSSProperties;
}) {
  return (
    <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
      <button type="button" onClick={onBack} disabled={isProcessing} style={{ ...btnBase, flex: 1, color: 'var(--text)', backgroundColor: 'transparent', border: '1px solid var(--border-act)', opacity: isProcessing ? 0.4 : 1 }}>
        ← Volver
      </button>
      <button type="button" onClick={onConfirm} disabled={isProcessing} style={{ ...btnBase, flex: 2, color: 'var(--action-text)', backgroundColor: 'var(--action-bg)', boxShadow: 'var(--btn-shadow)', opacity: isProcessing ? 0.7 : 1 }}>
        {isProcessing ? <><Spinner />Procesando...</> : label}
      </button>
    </div>
  );
}

interface TransferRow { label: string; value: string; copy?: boolean; mono?: boolean }

function TransferPanel({ emoji, title, rows, instructions, isProcessing, errorMessage, onBack, onConfirm, confirmLabel, btnBase }: {
  emoji: string; title: string; rows: TransferRow[];
  instructions: string; isProcessing: boolean; errorMessage: string | null;
  onBack: () => void; onConfirm: () => void; confirmLabel: string;
  btnBase: React.CSSProperties;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--tint)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{emoji} {title}</p>
        {rows.map(({ label, value, copy, mono }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', gap: '8px' }}>
            <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, color: 'var(--text)', fontFamily: mono ? 'monospace' : 'inherit', wordBreak: 'break-all', textAlign: 'right' }}>
              {value}
              {copy && <CopyButton text={value} />}
            </span>
          </div>
        ))}
        <div style={{ marginTop: '6px', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--tint-md)', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          📧 {instructions}
        </div>
      </div>
      {errorMessage && <ErrorBox message={errorMessage} />}
      <ActionButtons isProcessing={isProcessing} onBack={onBack} onConfirm={onConfirm} label={confirmLabel} btnBase={btnBase} />
    </div>
  );
}
