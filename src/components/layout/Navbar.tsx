/* Reference: ./DESIGN.md §4 Navigation */
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Sparkles, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useTheme } from '../../contexts/ThemeContext';
import { Container } from '../ui/Container';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/productos', label: 'Productos' },
];

export function Navbar() {
  const { totalItems, toggleCart } = useCartStore();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const count = totalItems();

  const btnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text)',
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border-act)',
    cursor: 'pointer',
    boxShadow: 'var(--btn-shadow)',
    transition: 'opacity 0.15s',
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50, width: '100%',
      backgroundColor: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      transition: 'background-color 0.25s ease',
    }}>
      <Container>
        <nav style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text)', fontWeight: 600, fontSize: '15px' }}>
            <Sparkles style={{ width: 16, height: 16, opacity: 0.5 }} />
            FiestaMágica
          </Link>

          {/* Desktop links */}
          <ul className="hidden-mobile" style={{ display: 'flex', gap: '24px', listStyle: 'none', alignItems: 'center' }}>
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} style={{
                  fontSize: '14px', textDecoration: 'none',
                  color: location.pathname === to ? 'var(--text)' : 'var(--text-muted)',
                  fontWeight: location.pathname === to ? 500 : 400,
                  transition: 'color 0.15s',
                }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

            {/* Theme toggle */}
            <motion.button
              whileTap={{ opacity: 0.8 }}
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              style={{ ...btnStyle, padding: '6px 10px' }}
            >
              {theme === 'dark'
                ? <Sun style={{ width: 14, height: 14 }} />
                : <Moon style={{ width: 14, height: 14 }} />}
            </motion.button>

            {/* Cart */}
            <motion.button
              whileTap={{ opacity: 0.8 }}
              onClick={toggleCart}
              aria-label={`Carrito (${count} items)`}
              style={{ ...btnStyle, position: 'relative' }}
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
                      backgroundColor: 'var(--action-bg)',
                      color: 'var(--action-text)',
                      fontSize: '11px', fontWeight: 700,
                      borderRadius: '9999px',
                      width: '18px', height: '18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {count > 9 ? '9+' : count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menú"
              className="show-mobile"
              style={{ display: 'none', padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
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
            style={{ overflow: 'hidden', backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border)' }}
          >
            <Container>
              <ul style={{ listStyle: 'none', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {NAV_LINKS.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} onClick={() => setMenuOpen(false)}
                      style={{ display: 'block', padding: '4px 0', fontSize: '14px', color: 'var(--text)', textDecoration: 'none' }}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
