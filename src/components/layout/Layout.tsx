/* Reference: ./DESIGN.md */
import { Outlet } from 'react-router-dom';
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
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', width: '100%' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: 500, color: 'var(--text)' }}>FiestaMágica</span>
          <span>© {new Date().getFullYear()} · Cotillón con amor · Envíos a todo el país</span>
        </div>
      </footer>
    </div>
  );
}
