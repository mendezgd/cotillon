/* Reference: ./DESIGN.md §5 Layout — hero 96px+ padding, stats bar, editorial typography */
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../services/products';
import { Container } from '../components/ui/Container';

const BTN_INSET =
  'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px';

export function HomePage() {
  return (
    <div style={{ width: '100%' }}>

      {/* ── Hero ── */}
      <section
        style={{
          width: '100%',
          padding: '96px 0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Atmospheric gradient wash — DESIGN.md §6 Decorative Depth */}
        <div
          aria-hidden
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(192,132,252,0.18) 0%, rgba(244,114,182,0.10) 45%, transparent 70%)',
          }}
        />

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <p style={{ fontSize: '13px', color: '#5f5f5d', marginBottom: '20px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Todo para tu fiesta perfecta ✨
            </p>

            {/* Display Hero — 60px, weight 600, letter-spacing -1.5px */}
            <h1
              style={{
                fontSize: 'clamp(2.25rem, 5.5vw, 3.75rem)',
                fontWeight: 600,
                lineHeight: 1.08,
                letterSpacing: '-1.5px',
                color: '#1c1c1c',
                marginBottom: '24px',
              }}
            >
              Hacé que cada celebración
              <br />
              sea mágica
            </h1>

            {/* Body Large — 18px, weight 400, line-height 1.38 */}
            <p
              style={{
                fontSize: '18px',
                fontWeight: 400,
                lineHeight: 1.38,
                color: '#5f5f5d',
                maxWidth: '420px',
                margin: '0 auto 40px',
              }}
            >
              Globos, disfraces, decoración y cotillón.
              Envío a todo el país.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
              {/* Primary Dark button */}
              <Link
                to="/productos"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '14px',
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
                Ver productos <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>

              {/* Ghost / Outline button */}
              <Link
                to="/productos"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#1c1c1c',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(28,28,28,0.4)',
                  textDecoration: 'none',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Ver ofertas
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Stats Bar — DESIGN.md §4 Stats Bar ── */}
      <section style={{ borderTop: '1px solid #eceae4', borderBottom: '1px solid #eceae4', backgroundColor: '#fcfbf8', padding: '40px 0' }}>
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '32px',
              textAlign: 'center',
            }}
          >
            {[
              { value: '500+', label: 'Productos' },
              { value: '12K+', label: 'Fiestas realizadas' },
              { value: '48h', label: 'Envío express' },
              { value: '100%', label: 'Garantía de calidad' },
            ].map(({ value, label }) => (
              <div key={label}>
                {/* Stats: 48px weight 600, letter-spacing -1.2px */}
                <p style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, letterSpacing: '-1.2px', color: '#1c1c1c', marginBottom: '4px' }}>
                  {value}
                </p>
                <p style={{ fontSize: '14px', color: '#5f5f5d' }}>{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Categories — Template Gallery style, DESIGN.md §4 ── */}
      <section style={{ padding: '80px 0' }}>
        <Container>
          {/* Sub-heading: 36px, weight 600, letter-spacing -0.9px */}
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 600, letterSpacing: '-0.9px', color: '#1c1c1c', marginBottom: '8px' }}>
            Explorá por categoría
          </h2>
          <p style={{ fontSize: '16px', color: '#5f5f5d', marginBottom: '40px' }}>
            Encontrá exactamente lo que necesitás para tu fiesta.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '12px',
            }}
          >
            {CATEGORIES.filter((c) => c.id !== 'todos').map(({ id, label, emoji }, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={`/productos?categoria=${id}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '24px 16px',
                    borderRadius: '12px',
                    backgroundColor: '#f7f4ed',
                    border: '1px solid #eceae4',
                    textDecoration: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(28,28,28,0.4)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#eceae4')}
                >
                  <span style={{ fontSize: '28px' }}>{emoji}</span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#1c1c1c' }}>{label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA Banner — dark charcoal, inset shadow ── */}
      <section style={{ paddingBottom: '80px' }}>
        <Container>
          <div
            style={{
              backgroundColor: '#1c1c1c',
              borderRadius: '16px',
              padding: '48px 32px',
              textAlign: 'center',
              boxShadow: BTN_INSET,
            }}
          >
            <p style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 600, letterSpacing: '-0.9px', color: '#fcfbf8', marginBottom: '8px' }}>
              Envío gratis en compras +$10.000
            </p>
            <p style={{ fontSize: '14px', color: 'rgba(252,251,248,0.55)', marginBottom: '24px' }}>
              Celebrá con todo sin pagar de más.
            </p>
            <Link
              to="/productos"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#1c1c1c',
                backgroundColor: '#fcfbf8',
                textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Ver productos →
            </Link>
          </div>
        </Container>
      </section>

    </div>
  );
}
