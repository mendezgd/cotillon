/* Reference: ./DESIGN.md */
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Package, CreditCard } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useCheckout } from '../hooks/useCheckout';
import { ShippingForm } from '../components/checkout/ShippingForm';
import { PaymentForm } from '../components/checkout/PaymentForm';
import { OrderSummaryPanel } from '../components/checkout/OrderSummaryPanel';
import { Container } from '../components/ui/Container';

const STEPS = [
  { id: 'shipping', label: 'Envío', icon: Package },
  { id: 'payment', label: 'Pago', icon: CreditCard },
  { id: 'confirmation', label: 'Confirmación', icon: CheckCircle },
];

export function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const navigate = useNavigate();
  if (items.length === 0) return <Navigate to="/productos" replace />;

  const { step, paymentStatus, transactionId, errorMessage, shippingCost, total, submitShipping, submitPayment, reset, setStep } = useCheckout();

  return (
    <div style={{ width: '100%', padding: '48px 0' }}>
      <Container>
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '48px' }}>
          {STEPS.map(({ id, label, icon: Icon }, i) => {
            const stepIdx = STEPS.findIndex((s) => s.id === step);
            const isActive = id === step;
            const isDone = STEPS.findIndex((s) => s.id === id) < stepIdx;
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                  backgroundColor: isActive ? 'var(--action-bg)' : isDone ? 'var(--tint-md)' : 'var(--tint)',
                  color: isActive ? 'var(--action-text)' : 'var(--text)',
                  boxShadow: isActive ? 'var(--btn-shadow)' : 'none',
                }}>
                  <Icon style={{ width: 12, height: 12 }} />{label}
                </div>
                {i < STEPS.length - 1 && <div style={{ width: '32px', height: '1px', backgroundColor: 'var(--border)' }} />}
              </div>
            );
          })}
        </div>

        {step === 'confirmation' ? (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '64px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--tint-md)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle style={{ width: 28, height: 28, color: 'var(--text)' }} />
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 600, letterSpacing: '-0.9px', color: 'var(--text)' }}>¡Compra confirmada!</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '360px' }}>Tu pedido fue procesado correctamente. Recibirás un email de confirmación.</p>
            {transactionId && (
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', backgroundColor: 'var(--tint)', padding: '6px 16px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                ID: {transactionId}
              </p>
            )}
            <button onClick={() => { reset(); navigate('/'); }} style={{
              marginTop: '8px', padding: '10px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
              color: 'var(--action-text)', backgroundColor: 'var(--action-bg)',
              border: 'none', cursor: 'pointer', boxShadow: 'var(--btn-shadow)',
            }}>
              Volver al inicio
            </button>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,3fr) minmax(0,2fr)', gap: '32px', alignItems: 'start' }} className="checkout-grid">
            <div>
              <AnimatePresence mode="wait">
                {step === 'shipping' && (
                  <motion.div key="shipping" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                    <ShippingForm onSubmit={submitShipping} />
                  </motion.div>
                )}
                {step === 'payment' && (
                  <motion.div key="payment" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
                    <PaymentForm onSubmit={submitPayment} status={paymentStatus} errorMessage={errorMessage} onBack={() => setStep('shipping')} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div><OrderSummaryPanel shippingCost={shippingCost} total={total} /></div>
          </div>
        )}
      </Container>
      <style>{`@media (max-width: 768px) { .checkout-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
