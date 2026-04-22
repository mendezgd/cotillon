/* Reference: ./DESIGN.md — Lovable/Claude design system */
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

const BTN_INSET =
  'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px';

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
                  backgroundColor: isActive ? '#1c1c1c' : isDone ? 'rgba(28,28,28,0.06)' : 'rgba(28,28,28,0.03)',
                  color: isActive ? '#fcfbf8' : isDone ? '#1c1c1c' : '#5f5f5d',
                  boxShadow: isActive ? BTN_INSET : 'none',
                }}>
                  <Icon style={{ width: 12, height: 12 }} />
                  {label}
                </div>
                {i < STEPS.length - 1 && <div style={{ width: '32px', height: '1px', backgroundColor: '#eceae4' }} />}
              </div>
            );
          })}
        </div>

        {/* Confirmation */}
        {step === 'confirmation' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '64px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
          >
            <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(28,28,28,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle style={{ width: 28, height: 28, color: '#1c1c1c' }} />
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600, letterSpacing: '-0.9px', color: '#1c1c1c' }}>
              ¡Compra confirmada!
            </h2>
            <p style={{ fontSize: '14px', color: '#5f5f5d', maxWidth: '360px' }}>
              Tu pedido fue procesado correctamente. Recibirás un email de confirmación.
            </p>
            {transactionId && (
              <p style={{ fontSize: '11px', color: '#5f5f5d', fontFamily: 'monospace', backgroundColor: 'rgba(28,28,28,0.04)', padding: '6px 16px', borderRadius: '4px', border: '1px solid #eceae4' }}>
                ID: {transactionId}
              </p>
            )}
            <button
              onClick={() => { reset(); navigate('/'); }}
              style={{ marginTop: '8px', padding: '10px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, color: '#fcfbf8', backgroundColor: '#1c1c1c', border: 'none', cursor: 'pointer', boxShadow: BTN_INSET }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Volver al inicio
            </button>
          </motion.div>
        ) : (
          /* Two-column: form + summary */
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,3fr) minmax(0,2fr)', gap: '32px', alignItems: 'start' }}
            className="checkout-grid"
          >
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
            <div>
              <OrderSummaryPanel shippingCost={shippingCost} total={total} />
            </div>
          </div>
        )}

      </Container>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
