/* Reference: ./DESIGN.md */
import { Outlet, Link } from 'react-router-dom';
import { Sparkles, Heart, Star, Mail } from 'lucide-react';
import { Navbar } from './Navbar';
import { CartSidebar } from '../cart/CartSidebar';

export function Layout() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)', width: '100%', transition: 'background-color 0.25s ease' }}>
      <Navbar />
      <main style={{ flex: 1, width: '100%' }}>
        <Outlet />
      </main>
      <CartSidebar />
      <footer style={{ borderTop: '1px solid var(--border)', padding: '48px 1.5rem 32px', width: '100%', backgroundColor: 'var(--bg-subtle)', transition: 'background-color 0.25s ease' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '40px' }}>
          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '16px', color: 'var(--text)' }}>
              <Sparkles style={{ width: 16, height: 16, opacity: 0.5 }} />
              FiestaMágica
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '220px' }}>
              Cotillón, globos y disfraces para hacer de cada celebración un momento único.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              {[Heart, Star, Mail].map((Icon, i) => (
                <button key={i} style={{
                  width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.15s, border-color 0.15s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-act)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <Icon style={{ width: 14, height: 14 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>Tienda</p>
            {[
              { to: '/productos', label: 'Todos los productos' },
              { to: '/productos?categoria=globos', label: 'Globos' },
              { to: '/productos?categoria=decoracion', label: 'Decoración' },
              { to: '/productos?categoria=disfraces', label: 'Disfraces' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>Info</p>
            {['Cómo comprar', 'Envíos y devoluciones', 'Preguntas frecuentes', 'Contacto'].map((label) => (
              <span key={label} style={{ fontSize: '13px', color: 'var(--text-muted)', cursor: 'default' }}>{label}</span>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: '1152px', margin: '32px auto 0', paddingTop: '24px', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>© {new Date().getFullYear()} FiestaMágica · Cotillón con amor</span>
          <span>Envíos a todo el país 🚚</span>
        </div>
      </footer>
    </div>
  );
}
