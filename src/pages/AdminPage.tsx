import { useState } from 'react';
import { Truck, CheckCircle, Clock, XCircle, ChevronDown, ReceiptText, Sparkles, Package } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { AdminProductsTab } from './AdminProductsTab';
import type { OrderStatus } from '../types';

/* ── Status config ─────────────────────────────────────────────── */
const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pendiente:             { label: 'Pendiente comprobante', color: '#92400e', bg: '#fef3c7', icon: <Clock style={{ width: 12, height: 12 }} /> },
  comprobante_recibido:  { label: 'Comprobante recibido',  color: '#1e40af', bg: '#dbeafe', icon: <ReceiptText style={{ width: 12, height: 12 }} /> },
  confirmado:            { label: 'Pago confirmado',       color: '#14532d', bg: '#dcfce7', icon: <CheckCircle style={{ width: 12, height: 12 }} /> },
  enviado:               { label: 'Enviado',               color: '#4c1d95', bg: '#ede9fe', icon: <Truck style={{ width: 12, height: 12 }} /> },
  cancelado:             { label: 'Cancelado',             color: '#7f1d1d', bg: '#fee2e2', icon: <XCircle style={{ width: 12, height: 12 }} /> },
};

const NEXT_STATUS: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  pendiente:            { status: 'comprobante_recibido', label: 'Marcar comprobante recibido' },
  comprobante_recibido: { status: 'confirmado',           label: 'Confirmar pago' },
  confirmado:           { status: 'enviado',              label: 'Marcar como enviado' },
};

const METHOD_LABEL: Record<string, string> = {
  mercadopago: '🔵 MercadoPago',
  card:        '💳 Tarjeta',
  transfer:    '🏦 Transferencia',
};

const FILTER_TABS: { id: OrderStatus | 'todos'; label: string }[] = [
  { id: 'todos',            label: 'Todos' },
  { id: 'pendiente',        label: 'Pendientes' },
  { id: 'comprobante_recibido', label: 'Con comprobante' },
  { id: 'confirmado',       label: 'Confirmados' },
  { id: 'enviado',          label: 'Enviados' },
  { id: 'cancelado',        label: 'Cancelados' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

/* ── PIN gate ──────────────────────────────────────────────────── */
const ADMIN_PIN = '1234'; // cambiar por el PIN deseado

function PinGate({ onAuth }: { onAuth: () => void }) {
  const [pin, setPin] = useState('');
  const [err, setErr] = useState(false);

  const check = () => {
    if (pin === ADMIN_PIN) { onAuth(); }
    else { setErr(true); setPin(''); }
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)' }}>
      <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px' }}>🔐</div>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px' }}>Panel admin</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Ingresá el PIN para continuar.</p>
        <input
          type="password"
          value={pin}
          onChange={(e) => { setPin(e.target.value); setErr(false); }}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          placeholder="PIN"
          style={{
            padding: '10px 12px', borderRadius: '8px', fontSize: '16px', textAlign: 'center',
            border: `1px solid ${err ? 'rgb(220,38,38)' : 'var(--border)'}`,
            backgroundColor: 'var(--bg)', color: 'var(--text)', outline: 'none', letterSpacing: '0.3em',
          }}
        />
        {err && <p style={{ fontSize: '12px', color: 'rgb(220,38,38)', marginTop: '-8px' }}>PIN incorrecto</p>}
        <button onClick={check} style={{
          padding: '11px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
          color: 'var(--action-text)', backgroundColor: 'var(--action-bg)',
          border: 'none', cursor: 'pointer',
        }}>
          Entrar
        </button>
      </div>
    </div>
  );
}

/* ── Main admin page ────────────────────────────────────────────── */
export function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<'pedidos' | 'productos'>('pedidos');
  const [filter, setFilter] = useState<OrderStatus | 'todos'>('todos');
  const [expanded, setExpanded] = useState<string | null>(null);
  const { orders, updateStatus } = useOrderStore();

  if (!authed) return <PinGate onAuth={() => setAuthed(true)} />;

  const filtered = filter === 'todos' ? orders : orders.filter((o) => o.status === filter);

  const counts = orders.reduce<Record<string, number>>(
    (acc, o) => { acc[o.status] = (acc[o.status] ?? 0) + 1; return acc; },
    {},
  );

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--bg)', transition: 'background-color 0.25s ease' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles style={{ width: 16, height: 16, opacity: 0.5 }} />
          <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>FiestaMágica</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', borderLeft: '1px solid var(--border)', paddingLeft: '10px' }}>Panel de administración</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>🕐 Pendientes: <strong style={{ color: counts['pendiente'] ? '#92400e' : 'var(--text)' }}>{counts['pendiente'] ?? 0}</strong></span>
          <span>📦 Total: <strong style={{ color: 'var(--text)' }}>{orders.length}</strong></span>
        </div>
      </header>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Tab navigation */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
          {([
            { id: 'pedidos',   label: 'Pedidos',   icon: <ReceiptText size={14} /> },
            { id: 'productos', label: 'Productos',  icon: <Package size={14} /> },
          ] as const).map(({ id, label, icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', border: 'none', borderRadius: '8px 8px 0 0',
                  backgroundColor: active ? 'var(--bg)' : 'transparent',
                  color: active ? 'var(--text)' : 'var(--text-muted)',
                  borderBottom: active ? '2px solid var(--action-bg)' : '2px solid transparent',
                  marginBottom: '-1px',
                }}
              >
                {icon} {label}
              </button>
            );
          })}
        </div>

        {/* Productos tab */}
        {tab === 'productos' && <AdminProductsTab />}

        {tab === 'pedidos' && <>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '12px', marginBottom: '32px' }}>
          {(['pendiente', 'comprobante_recibido', 'confirmado', 'enviado'] as OrderStatus[]).map((s) => {
            const meta = STATUS_META[s];
            return (
              <div key={s} style={{ borderRadius: '10px', border: '1px solid var(--border)', padding: '14px 16px', backgroundColor: 'var(--tint)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: meta.color }}>
                  {meta.icon} {meta.label}
                </div>
                <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px' }}>{counts[s] ?? 0}</p>
              </div>
            );
          })}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
          {FILTER_TABS.map(({ id, label }) => {
            const active = filter === id;
            return (
              <button key={id} onClick={() => setFilter(id)}
                style={{
                  padding: '6px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', border: active ? '1px solid transparent' : '1px solid var(--border)',
                  backgroundColor: active ? 'var(--action-bg)' : 'var(--bg)',
                  color: active ? 'var(--action-text)' : 'var(--text-muted)',
                }}
              >
                {label}
                {id !== 'todos' && counts[id] ? ` (${counts[id]})` : ''}
              </button>
            );
          })}
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            No hay pedidos en esta categoría.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map((order) => {
              const meta = STATUS_META[order.status];
              const next = NEXT_STATUS[order.status];
              const isExpanded = expanded === order.id;

              return (
                <div key={order.id} style={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', overflow: 'hidden' }}>
                  {/* Order row */}
                  <div
                    onClick={() => setExpanded(isExpanded ? null : order.id)}
                    style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}
                  >
                    {/* Status badge */}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600, backgroundColor: meta.bg, color: meta.color, flexShrink: 0 }}>
                      {meta.icon} {meta.label}
                    </span>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.shipping.fullName} · {order.shipping.city}, {order.shipping.province}
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {formatDate(order.createdAt)} · {METHOD_LABEL[order.paymentMethod]} · {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Total */}
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', flexShrink: 0 }}>
                      ${order.total.toLocaleString('es-AR')}
                    </span>

                    <ChevronDown style={{ width: 16, height: 16, color: 'var(--text-muted)', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none', flexShrink: 0 }} />
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid var(--border)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--tint)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                        {/* Customer info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cliente</p>
                          {[
                            ['Nombre', order.shipping.fullName],
                            ['DNI', order.shipping.dni],
                            ['Email', order.shipping.email],
                            ['Teléfono', order.shipping.phone],
                            ['Dirección', order.shipping.address],
                            ['CP', order.shipping.postalCode],
                          ].map(([label, val]) => (
                            <div key={label} style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
                              <span style={{ color: 'var(--text-muted)', minWidth: '60px', flexShrink: 0 }}>{label}</span>
                              <span style={{ color: 'var(--text)', wordBreak: 'break-all' }}>{val}</span>
                            </div>
                          ))}
                        </div>

                        {/* Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Productos</p>
                          {order.items.map(({ product, quantity }) => (
                            <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', gap: '8px' }}>
                              <span style={{ color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name} x{quantity}</span>
                              <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>${(product.price * quantity).toLocaleString('es-AR')}</span>
                            </div>
                          ))}
                          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '6px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                              <span>Subtotal</span><span>${order.subtotal.toLocaleString('es-AR')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                              <span>Envío</span><span>{order.shippingCost === 0 ? 'Gratis' : `$${order.shippingCost.toLocaleString('es-AR')}`}</span>
                            </div>
                            {order.installments && order.installments > 1 && (
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {order.installments} cuotas sin interés
                              </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                              <span>Total</span><span>${order.total.toLocaleString('es-AR')}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '4px' }}>
                            ID: {order.id}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {next && (
                          <button
                            onClick={() => updateStatus(order.id, next.status)}
                            style={{
                              padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                              color: 'var(--action-text)', backgroundColor: 'var(--action-bg)',
                              border: 'none', cursor: 'pointer',
                              boxShadow: 'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset',
                            }}
                          >
                            {next.label} →
                          </button>
                        )}
                        {order.status !== 'cancelado' && order.status !== 'enviado' && (
                          <button
                            onClick={() => updateStatus(order.id, 'cancelado')}
                            style={{
                              padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                              color: 'rgb(220,38,38)', backgroundColor: 'transparent',
                              border: '1px solid rgba(220,38,38,0.35)', cursor: 'pointer',
                            }}
                          >
                            Cancelar pedido
                          </button>
                        )}
                        <a
                          href={`mailto:${order.shipping.email}?subject=Tu pedido FiestaMágica (${order.id})&body=Hola ${order.shipping.fullName},%0D%0A`}
                          style={{
                            padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                            color: 'var(--text)', backgroundColor: 'transparent',
                            border: '1px solid var(--border)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px',
                          }}
                        >
                          ✉️ Contactar cliente
                        </a>
                      </div>

                      {order.notes && (
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Nota: {order.notes}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        </>}
      </div>
    </div>
  );
}
