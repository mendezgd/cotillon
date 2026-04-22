/* Reference: ./DESIGN.md §4 Cards */
import { Truck } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { getShippingEta } from '../../services/argentina';

interface Props { shippingCost: number; total: number; province?: string }

export function OrderSummaryPanel({ shippingCost, total, province }: Props) {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);
  const eta = province ? getShippingEta(province) : null;

  return (
    <div style={{ backgroundColor: 'var(--tint)', borderRadius: '12px', border: '1px solid var(--border)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Resumen del pedido</h3>

      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map(({ product, quantity }) => (
          <li key={product.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>x{quantity}</p>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', flexShrink: 0 }}>
              ${(product.price * quantity).toLocaleString('es-AR')}
            </span>
          </li>
        ))}
      </ul>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
          <span>Subtotal</span><span>${subtotal().toLocaleString('es-AR')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Truck style={{ width: 12, height: 12 }} /> Envío
          </span>
          <span style={{ color: shippingCost === 0 ? 'var(--cat-deco-text)' : 'var(--text-muted)' }}>
            {shippingCost === 0 ? '🎉 Gratis' : `$${shippingCost.toLocaleString('es-AR')}`}
          </span>
        </div>
        {eta && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Entrega estimada: <strong style={{ color: 'var(--text)' }}>{eta}</strong>
          </div>
        )}
        {subtotal() < 10_000 && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', backgroundColor: 'var(--tint-md)', borderRadius: '6px', padding: '8px 10px', lineHeight: 1.5 }}>
            Sumá ${(10_000 - subtotal()).toLocaleString('es-AR')} más para obtener <strong>envío gratis</strong>.
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, color: 'var(--text)', borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '4px' }}>
          <span>Total</span>
          <div style={{ textAlign: 'right' }}>
            <div>${total.toLocaleString('es-AR')}</div>
            <div style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text-muted)' }}>ARS · precio final</div>
          </div>
        </div>
      </div>

      {/* Cuotas hint */}
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', backgroundColor: 'var(--tint)', borderRadius: '6px', padding: '8px 10px', lineHeight: 1.6 }}>
        💳 Hasta <strong style={{ color: 'var(--text)' }}>12 cuotas sin interés</strong> con Visa y Mastercard
      </div>
    </div>
  );
}
