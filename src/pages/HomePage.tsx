/* Reference: ./DESIGN.md §5 Layout — hero carousel, stats bar, editorial typography */
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Star, Shield, Zap } from 'lucide-react';
import { CATEGORIES } from '../services/products';
import { Container } from '../components/ui/Container';
import { HeroCarousel } from '../components/HeroCarousel';

const CATEGORY_ACCENT: Record<string, { bg: string; text: string; border: string }> = {
  globos:    { bg: 'var(--cat-globos)',    text: 'var(--cat-globos-text)',    border: 'rgba(234,179,8,0.3)' },
  decoracion:{ bg: 'var(--cat-deco)',      text: 'var(--cat-deco-text)',      border: 'rgba(22,163,74,0.25)' },
  disfraces: { bg: 'var(--cat-disfraces)', text: 'var(--cat-disfraces-text)', border: 'rgba(124,58,237,0.25)' },
  cotillon:  { bg: 'var(--cat-cotillon)',  text: 'var(--cat-cotillon-text)',  border: 'rgba(225,29,72,0.25)' },
};

const STATS = [
  { value: '500+', label: 'Productos', icon: Star },
  { value: '12K+', label: 'Fiestas realizadas', icon: Zap },
  { value: '48h',  label: 'Envío express', icon: Truck },
  { value: '100%', label: 'Garantía de calidad', icon: Shield },
];

export function HomePage() {
  return (
    <div style={{ width: '100%' }}>

      {/* ── Hero Carousel ── */}
      <HeroCarousel />

      {/* ── Stats Bar ── */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-subtle)', padding: '40px 0', transition: 'background-color 0.25s ease' }}>
        <Container>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '32px', textAlign: 'center' }}>
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  backgroundColor: 'var(--tint-md)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon style={{ width: 18, height: 18, color: 'var(--text-muted)' }} />
                </div>
                <p style={{ fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 700, letterSpacing: '-1px', color: 'var(--text)', lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Categories ── */}
      <section style={{ padding: '80px 0' }}>
        <Container>
          <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)', fontWeight: 700, letterSpacing: '-0.9px', color: 'var(--text)', marginBottom: '8px' }}>
            Explorá por categoría
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '40px' }}>
            Encontrá exactamente lo que necesitás para tu fiesta.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(168px,1fr))', gap: '14px' }}>
            {CATEGORIES.filter((c) => c.id !== 'todos').map(({ id, label, emoji }, i) => {
              const accent = CATEGORY_ACCENT[id] ?? { bg: 'var(--tint)', text: 'var(--text)', border: 'var(--border)' };
              return (
                <motion.div key={id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link to={`/productos?categoria=${id}`} className="card-lift"
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: '10px', padding: '28px 16px', borderRadius: '14px',
                      backgroundColor: accent.bg, border: `1px solid ${accent.border}`,
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent.text)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = accent.border)}
                  >
                    <span style={{ fontSize: '32px' }}>{emoji}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: accent.text }}>{label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ paddingBottom: '80px' }}>
        <Container>
          <div style={{
            borderRadius: '20px', padding: '56px 32px', textAlign: 'center', overflow: 'hidden', position: 'relative',
            background: 'linear-gradient(135deg, #1c1c1c 0%, #2d2520 50%, #1c1c1c 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}>
            {/* Subtle festive glow inside banner */}
            <div aria-hidden style={{
              pointerEvents: 'none', position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(251,191,36,0.12) 0%, transparent 70%)',
            }} />
            <p style={{ fontSize: 'clamp(1.3rem,3vw,1.9rem)', fontWeight: 700, letterSpacing: '-0.9px', color: '#fcfbf8', marginBottom: '8px', position: 'relative' }}>
              🚚 Envío gratis en compras +$10.000
            </p>
            <p style={{ fontSize: '14px', color: 'rgba(252,251,248,0.55)', marginBottom: '28px', position: 'relative' }}>
              Celebrá con todo sin pagar de más.
            </p>
            <Link to="/productos" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '11px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
              color: '#1c1c1c', backgroundColor: '#fcfbf8',
              textDecoration: 'none', transition: 'opacity 0.15s', position: 'relative',
              boxShadow: 'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Ver productos <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
