/* Reference: ./DESIGN.md — cream sidebar, #eceae4 borders, charcoal buttons */
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

const BTN_INSET =
  'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px';

export function CartSidebar() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, subtotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40,
              backgroundColor: 'rgba(28,28,28,0.35)',
              backdropFilter: 'blur(2px)',
            }}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              height: '100%',
              width: '100%',
              maxWidth: '380px',
              zIndex: 50,
              backgroundColor: '#f7f4ed',
              borderLeft: '1px solid #eceae4',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #eceae4' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#1c1c1c' }}>
                <ShoppingBag style={{ width: 15, height: 15 }} />
                Mi carrito
              </h2>
              <button
                onClick={closeCart}
                style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#5f5f5d', borderRadius: '4px' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(28,28,28,0.04)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent')}
              >
                <X style={{ width: 15, height: 15 }} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '160px', color: '#5f5f5d', gap: '12px' }}
                  >
                    <span style={{ fontSize: '40px', opacity: 0.4 }}>🛒</span>
                    <p style={{ fontSize: '13px' }}>Tu carrito está vacío</p>
                  </motion.div>
                ) : (
                  items.map(({ product, quantity }) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      style={{ display: 'flex', gap: '12px' }}
                    >
                      {/* Image — DESIGN.md: 1px solid #eceae4 border, 8px radius */}
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #eceae4', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: 500, color: '#1c1c1c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {product.name}
                        </p>
                        <p style={{ fontSize: '13px', color: '#5f5f5d', marginTop: '2px' }}>
                          ${(product.price * quantity).toLocaleString('es-AR')}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #eceae4', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1c1c1c' }}
                          >
                            <Minus style={{ width: 10, height: 10 }} />
                          </button>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: '#1c1c1c', width: '16px', textAlign: 'center' }}>{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            disabled={quantity >= product.stock}
                            style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #eceae4', background: 'none', cursor: quantity >= product.stock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1c1c1c', opacity: quantity >= product.stock ? 0.3 : 1 }}
                          >
                            <Plus style={{ width: 10, height: 10 }} />
                          </button>
                          <button
                            onClick={() => removeItem(product.id)}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#5f5f5d', transition: 'color 0.15s' }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#1c1c1c')}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#5f5f5d')}
                          >
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
              <div style={{ padding: '16px 20px', borderTop: '1px solid #eceae4', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#5f5f5d' }}>Subtotal</span>
                  <span style={{ fontWeight: 600, color: '#1c1c1c' }}>${subtotal().toLocaleString('es-AR')}</span>
                </div>
                <p style={{ fontSize: '11px', color: '#5f5f5d' }}>Envío gratis en compras +$10.000</p>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#fcfbf8',
                    backgroundColor: '#1c1c1c',
                    textDecoration: 'none',
                    boxShadow: BTN_INSET,
                    transition: 'opacity 0.15s',
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
