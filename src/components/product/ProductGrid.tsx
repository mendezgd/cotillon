/* Reference: ./DESIGN.md §4 Template Gallery */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { PRODUCTS, CATEGORIES } from '../../services/products';
import { Container } from '../ui/Container';
import type { Category } from '../../types';

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<Category>('todos');
  const filtered = activeCategory === 'todos' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section style={{ padding: '40px 0' }}>
      <Container>
        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '36px' }}>
          {CATEGORIES.map(({ id, label, emoji }) => {
            const isActive = activeCategory === id;
            return (
              <motion.button
                key={id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(id as Category)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.18s',
                  backgroundColor: isActive ? 'var(--action-bg)' : 'var(--bg)',
                  color: isActive ? 'var(--action-text)' : 'var(--text-muted)',
                  border: isActive ? '1px solid transparent' : '1px solid var(--border)',
                  boxShadow: isActive ? 'var(--btn-shadow)' : 'none',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <span>{emoji}</span>{label}
              </motion.button>
            );
          })}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '16px' }}>
          <AnimatePresence>
            {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '64px 0', fontSize: '14px' }}>
            No hay productos en esta categoría.
          </p>
        )}
      </Container>
    </section>
  );
}
