/* Reference: ./DESIGN.md §4 Cards — cream bg, border, 12px radius, no shadow */
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';

interface Props { product: Product }

export function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => { addItem(product); setAdded(true); setTimeout(() => setAdded(false), 1500); };

  const displayPrice = product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{ backgroundColor: 'var(--bg)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.15s, background-color 0.25s ease' }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-act)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)')}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', backgroundColor: 'var(--tint)' }}>
        <img src={product.image} alt={product.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        {product.badge && (
          <span style={{
            position: 'absolute', top: '8px', left: '8px', fontSize: '11px', fontWeight: 500,
            padding: '2px 8px', borderRadius: '4px',
            backgroundColor: 'var(--bg)', color: 'var(--text)',
            border: '1px solid var(--border)', textTransform: 'capitalize',
          }}>
            {product.badge}
          </span>
        )}
        {product.discountPercent && (
          <span style={{
            position: 'absolute', top: '8px', right: '8px', fontSize: '11px', fontWeight: 600,
            padding: '2px 8px', borderRadius: '4px',
            backgroundColor: 'var(--action-bg)', color: 'var(--action-text)',
          }}>
            -{product.discountPercent}%
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <h3 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
            ${displayPrice.toLocaleString('es-AR')}
          </span>
          {product.discountPercent && (
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              ${product.price.toLocaleString('es-AR')}
            </span>
          )}
        </div>
        <motion.button
          whileTap={{ opacity: 0.8 }}
          onClick={handleAdd}
          disabled={product.stock === 0}
          style={{
            marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
            cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
            opacity: product.stock === 0 ? 0.4 : 1,
            backgroundColor: 'var(--action-bg)', color: 'var(--action-text)',
            border: 'none', boxShadow: product.stock > 0 ? 'var(--btn-shadow)' : 'none',
            transition: 'opacity 0.15s',
          }}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span key="check" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check style={{ width: 13, height: 13 }} /> Agregado
              </motion.span>
            ) : (
              <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShoppingCart style={{ width: 13, height: 13 }} />
                {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
