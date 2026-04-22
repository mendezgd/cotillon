/* Reference: ./DESIGN.md */
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { ProductGrid } from '../components/product/ProductGrid';
import { Container } from '../components/ui/Container';
import type { Category } from '../types';

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [initialCategory] = useState<Category>(
    (searchParams.get('categoria') as Category) ?? 'todos',
  );

  return (
    <div style={{ width: '100%' }}>
      <section style={{ borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
        <Container>
          <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 600, letterSpacing: '-0.9px', color: 'var(--text)', marginBottom: '6px' }}>
            Productos
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
            Filtrá por categoría y encontrá lo que buscás.
          </p>
        </Container>
      </section>
      <ProductGrid key={initialCategory} />
    </div>
  );
}
