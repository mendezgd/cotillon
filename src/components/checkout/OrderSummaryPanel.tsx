/* Reference: ./DESIGN.md §4 Cards — cream bg, #eceae4 border, 12px radius */
import { useCartStore } from '../../store/cartStore';

interface Props {
  shippingCost: number;
  total: number;
}

export function OrderSummaryPanel({ shippingCost, total }: Props) {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);

  return (
    <div
      style={{
        backgroundColor: 'rgba(28,28,28,0.02)',
        borderRadius: '12px',
        border: '1px solid #eceae4',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#1c1c1c' }}>Resumen del pedido</h3>

      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map(({ product, quantity }) => (
          <li key={product.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #eceae4', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', color: '#1c1c1c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
              <p style={{ fontSize: '11px', color: '#5f5f5d' }}>x{quantity}</p>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#1c1c1c', flexShrink: 0 }}>
              ${(product.price * quantity).toLocaleString('es-AR')}
            </span>
          </li>
        ))}
      </ul>

      <div style={{ borderTop: '1px solid #eceae4', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#5f5f5d' }}>
          <span>Subtotal</span>
          <span>${subtotal().toLocaleString('es-AR')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#5f5f5d' }}>
          <span>Envío</span>
          <span>{shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-AR')}`}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600, color: '#1c1c1c', borderTop: '1px solid #eceae4', paddingTop: '8px' }}>
          <span>Total</span>
          <span>${total.toLocaleString('es-AR')}</span>
        </div>
      </div>
    </div>
  );
}
