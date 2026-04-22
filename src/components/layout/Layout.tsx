/* Reference: ./DESIGN.md — Lovable/Claude design system */
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { CartSidebar } from '../cart/CartSidebar';

export function Layout() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: '#f7f4ed', width: '100%' }}>
      <Navbar />
      <main style={{ flex: 1, width: '100%' }}>
        <Outlet />
      </main>
      <CartSidebar />
      <footer
        style={{
          borderTop: '1px solid #eceae4',
          padding: '2rem 1.5rem',
          width: '100%',
        }}
      >
        <div
          style={{
            maxWidth: '72rem',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.875rem',
            color: '#5f5f5d',
          }}
        >
          <span style={{ fontWeight: 500, color: '#1c1c1c' }}>FiestaMágica</span>
          <span>© {new Date().getFullYear()} · Cotillón con amor · Envíos a todo el país</span>
        </div>
      </footer>
    </div>
  );
}
