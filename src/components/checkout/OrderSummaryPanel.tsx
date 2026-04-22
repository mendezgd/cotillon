/* Reference: ./DESIGN.md §4 Cards */
import { useCartStore } from '../../store/cartStore';

interface Props { shippingCost: number; total: number }

export function OrderSummaryPanel({ shippingCost, total }: Props) {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);

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
          <span>Envío</span><span>{shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-AR')}`}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600, color: 'var(--text)', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
          <span>Total</span><span>${total.toLocaleString('es-AR')}</span>
        </div>
      </div>
    </div>
  );
}
