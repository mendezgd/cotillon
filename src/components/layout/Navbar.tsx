/* Reference: ./DESIGN.md §4 Navigation — cream bg, charcoal links, inset-shadow CTA */
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { Container } from '../ui/Container';

const BTN_INSET =
  'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/productos', label: 'Productos' },
];

export function Navbar() {
  const { totalItems, toggleCart } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const count = totalItems();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        backgroundColor: '#f7f4ed',
        borderBottom: '1px solid #eceae4',
      }}
    >
      <Container>
        <nav
          style={{
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: '#1c1c1c',
              fontWeight: 600,
              fontSize: '15px',
            }}
          >
            <Sparkles style={{ width: 16, height: 16, opacity: 0.5 }} />
            FiestaMágica
          </Link>

          {/* Desktop links */}
          <ul
            style={{
              display: 'flex',
              gap: '24px',
              listStyle: 'none',
              alignItems: 'center',
            }}
            className="hidden-mobile"
          >
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  style={{
                    fontSize: '14px',
                    textDecoration: 'none',
                    color: location.pathname === to ? '#1c1c1c' : '#5f5f5d',
                    fontWeight: location.pathname === to ? 500 : 400,
                    transition: 'color 0.15s',
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Cart + mobile toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.button
              whileTap={{ opacity: 0.8 }}
              onClick={toggleCart}
              aria-label={`Carrito (${count} items)`}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#1c1c1c',
                backgroundColor: '#f7f4ed',
                border: '1px solid rgba(28,28,28,0.4)',
                cursor: 'pointer',
                boxShadow: BTN_INSET,
              }}
            >
              <ShoppingCart style={{ width: 14, height: 14 }} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{
                      backgroundColor: '#1c1c1c',
                      color: '#fcfbf8',
                      fontSize: '11px',
                      fontWeight: 700,
                      borderRadius: '9999px',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {count > 9 ? '9+' : count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menú"
              style={{
                display: 'none',
                padding: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#5f5f5d',
              }}
              className="show-mobile"
            >
              {menuOpen ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              overflow: 'hidden',
              backgroundColor: '#f7f4ed',
              borderTop: '1px solid #eceae4',
            }}
          >
            <Container>
              <ul style={{ listStyle: 'none', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {NAV_LINKS.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      style={{ display: 'block', padding: '4px 0', fontSize: '14px', color: '#1c1c1c', textDecoration: 'none' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive helpers */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
