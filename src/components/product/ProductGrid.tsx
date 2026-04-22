/* Reference: ./DESIGN.md §4 Template Gallery — 12px radius cards, #eceae4 border, hover darkening */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { PRODUCTS, CATEGORIES } from '../../services/products';
import { Container } from '../ui/Container';
import type { Category } from '../../types';

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<Category>('todos');

  const filtered =
    activeCategory === 'todos'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section style={{ padding: '40px 0' }}>
      <Container>
        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
          {CATEGORIES.map(({ id, label, emoji }) => {
            const isActive = activeCategory === id;
            return (
              <motion.button
                key={id}
                whileTap={{ opacity: 0.8 }}
                onClick={() => setActiveCategory(id as Category)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  backgroundColor: isActive ? '#1c1c1c' : '#f7f4ed',
                  color: isActive ? '#fcfbf8' : '#1c1c1c',
                  border: isActive ? '1px solid #1c1c1c' : '1px solid #eceae4',
                  boxShadow: isActive
                    ? 'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px'
                    : 'none',
                }}
              >
                <span>{emoji}</span>
                {label}
              </motion.button>
            );
          })}
        </div>

        {/* Grid — Template Gallery style */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <AnimatePresence>
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: '#5f5f5d', padding: '64px 0', fontSize: '14px' }}>
            No hay productos en esta categoría.
          </p>
        )}
      </Container>
    </section>
  );
}
