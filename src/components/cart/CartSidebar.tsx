/* Reference: ./DESIGN.md — sidebar with CSS vars */
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

export function CartSidebar() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, subtotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
            style={{ position: 'fixed', inset: 0, zIndex: 40, backgroundColor: 'var(--overlay)', backdropFilter: 'blur(2px)' }}
          />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{
              position: 'fixed', right: 0, top: 0, height: '100%', width: '100%', maxWidth: '380px',
              zIndex: 50, backgroundColor: 'var(--bg)', borderLeft: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', transition: 'background-color 0.25s ease',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                <ShoppingBag style={{ width: 15, height: 15 }} /> Mi carrito
              </h2>
              <button onClick={closeCart} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: '4px' }}>
                <X style={{ width: 15, height: 15 }} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '160px', color: 'var(--text-muted)', gap: '12px' }}>
                    <span style={{ fontSize: '40px', opacity: 0.35 }}>🛒</span>
                    <p style={{ fontSize: '13px' }}>Tu carrito está vacío</p>
                  </motion.div>
                ) : (
                  items.map(({ product, quantity }) => (
                    <motion.div key={product.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} style={{ display: 'flex', gap: '12px' }}>
                      <img src={product.image} alt={product.name} style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>${(product.price * quantity).toLocaleString('es-AR')}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                          <button onClick={() => updateQuantity(product.id, quantity - 1)} style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)' }}>
                            <Minus style={{ width: 10, height: 10 }} />
                          </button>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', width: '16px', textAlign: 'center' }}>{quantity}</span>
                          <button onClick={() => updateQuantity(product.id, quantity + 1)} disabled={quantity >= product.stock} style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid var(--border)', background: 'none', cursor: quantity >= product.stock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', opacity: quantity >= product.stock ? 0.3 : 1 }}>
                            <Plus style={{ width: 10, height: 10 }} />
                          </button>
                          <button onClick={() => removeItem(product.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.15s' }}>
                            <Trash2 style={{ width: 13, height: 13 }} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>${subtotal().toLocaleString('es-AR')}</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Envío gratis en compras +$10.000</p>
                <Link to="/checkout" onClick={closeCart} style={{
                  display: 'block', width: '100%', textAlign: 'center',
                  padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
                  color: 'var(--action-text)', backgroundColor: 'var(--action-bg)',
                  textDecoration: 'none', boxShadow: 'var(--btn-shadow)', transition: 'opacity 0.15s',
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Finalizar compra
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
