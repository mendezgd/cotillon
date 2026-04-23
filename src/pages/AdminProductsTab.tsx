import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Upload, Link } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { isFirebaseConfigured } from '../lib/firebase';
import type { Product, Category } from '../types';

/* ── Helpers ─────────────────────────────────────────────────── */
const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'globos',     label: 'Globos' },
  { id: 'decoracion', label: 'Decoración' },
  { id: 'disfraces',  label: 'Disfraces' },
  { id: 'cotillon',   label: 'Cotillón' },
  { id: 'piñatas',    label: 'Piñatas' },
];

const BADGE_OPTIONS = [
  { value: '',        label: 'Sin badge' },
  { value: 'nuevo',   label: '🆕 Nuevo' },
  { value: 'oferta',  label: '🏷️ Oferta' },
  { value: 'popular', label: '🔥 Popular' },
];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '13px',
  border: '1px solid var(--border)', backgroundColor: 'var(--bg)',
  color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px', display: 'block',
};

/* ── Form state ──────────────────────────────────────────────── */
type FormState = {
  name: string;
  description: string;
  price: string;
  category: Category;
  stock: string;
  badge: '' | 'nuevo' | 'oferta' | 'popular';
  discountPercent: string;
  image: string;
  imageMode: 'url' | 'upload';
};

const EMPTY: FormState = {
  name: '', description: '', price: '', category: 'cotillon',
  stock: '0', badge: '', discountPercent: '', image: '', imageMode: 'url',
};

function productToForm(p: Product): FormState {
  return {
    name: p.name, description: p.description,
    price: String(p.price), category: p.category,
    stock: String(p.stock), badge: p.badge ?? '',
    discountPercent: p.discountPercent ? String(p.discountPercent) : '',
    image: p.image, imageMode: 'url',
  };
}

/* ── Modal ───────────────────────────────────────────────────── */
function ProductModal({
  editing,
  onClose,
}: {
  editing: Product | null;
  onClose: () => void;
}) {
  const { addProduct, updateProduct, uploadImage } = useProductStore();
  const [form, setForm] = useState<FormState>(editing ? productToForm(editing) : EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      set({ image: url });
    } catch {
      setError('Error al subir la imagen. Intentá de nuevo.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('El nombre es obligatorio.'); return; }
    if (!form.price || isNaN(Number(form.price))) { setError('Precio inválido.'); return; }
    if (!form.image.trim()) { setError('La imagen es obligatoria (subí un archivo o pegá una URL).'); return; }

    setSaving(true);
    setError('');
    try {
      const data = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        image: form.image.trim(),
        badge: form.badge as Product['badge'],
        discountPercent: form.badge === 'oferta' && form.discountPercent
          ? Number(form.discountPercent)
          : undefined,
      };
      if (editing) {
        await updateProduct(editing.id, data);
      } else {
        await addProduct(data as Omit<Product, 'id'>);
      }
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Error al guardar: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'var(--overlay)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, padding: '16px',
      }}
    >
      <div style={{
        backgroundColor: 'var(--bg)', borderRadius: '14px',
        width: '100%', maxWidth: '560px', maxHeight: '90dvh',
        overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      }}>
        {/* Modal header */}
        <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>
            {editing ? 'Editar producto' : 'Agregar producto'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Image section */}
          <div>
            <label style={labelStyle}>Imagen</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              {(['url', 'upload'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => set({ imageMode: mode })}
                  style={{
                    padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                    cursor: 'pointer', border: form.imageMode === mode ? '1px solid transparent' : '1px solid var(--border)',
                    backgroundColor: form.imageMode === mode ? 'var(--action-bg)' : 'var(--bg)',
                    color: form.imageMode === mode ? 'var(--action-text)' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', gap: '5px',
                  }}
                >
                  {mode === 'url' ? <><Link size={11} /> URL</> : <><Upload size={11} /> Subir archivo</>}
                </button>
              ))}
            </div>

            {form.imageMode === 'url' ? (
              <input
                style={inputStyle}
                placeholder="https://ejemplo.com/imagen.jpg"
                value={form.image}
                onChange={(e) => set({ image: e.target.value })}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  style={{
                    padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                    cursor: uploading ? 'not-allowed' : 'pointer', border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg)', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px',
                    opacity: uploading ? 0.6 : 1,
                  }}
                >
                  <Upload size={13} />
                  {uploading ? 'Subiendo...' : 'Elegir imagen'}
                </button>
                {form.image && !uploading && (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Imagen cargada ✓</span>
                )}
              </div>
            )}

            {form.image && (
              <img
                src={form.image}
                alt=""
                style={{ marginTop: '10px', width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
              />
            )}
          </div>

          {/* Name */}
          <div>
            <label style={labelStyle}>Nombre</label>
            <input style={inputStyle} value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Ej: Globos Metalizados x10" />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Descripción</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }}
              value={form.description}
              onChange={(e) => set({ description: e.target.value })}
              placeholder="Descripción breve del producto"
            />
          </div>

          {/* Price + Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Precio ($)</label>
              <input style={inputStyle} type="number" min="0" value={form.price} onChange={(e) => set({ price: e.target.value })} placeholder="0" />
            </div>
            <div>
              <label style={labelStyle}>Stock</label>
              <input style={inputStyle} type="number" min="0" value={form.stock} onChange={(e) => set({ stock: e.target.value })} placeholder="0" />
            </div>
          </div>

          {/* Category + Badge */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Categoría</label>
              <select style={inputStyle} value={form.category} onChange={(e) => set({ category: e.target.value as Category })}>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Badge</label>
              <select style={inputStyle} value={form.badge} onChange={(e) => set({ badge: e.target.value as FormState['badge'] })}>
                {BADGE_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
          </div>

          {/* Discount (only when badge = oferta) */}
          {form.badge === 'oferta' && (
            <div>
              <label style={labelStyle}>Descuento (%)</label>
              <input style={inputStyle} type="number" min="1" max="99" value={form.discountPercent} onChange={(e) => set({ discountPercent: e.target.value })} placeholder="Ej: 20" />
            </div>
          )}

          {error && (
            <p style={{ fontSize: '12px', color: 'rgb(220,38,38)', margin: 0 }}>{error}</p>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '4px' }}>
            <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || uploading}
              style={{
                padding: '9px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                cursor: saving || uploading ? 'not-allowed' : 'pointer',
                border: 'none', backgroundColor: 'var(--action-bg)', color: 'var(--action-text)',
                opacity: saving || uploading ? 0.7 : 1,
                boxShadow: 'var(--btn-shadow)',
              }}
            >
              {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Agregar producto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main tab ────────────────────────────────────────────────── */
export function AdminProductsTab() {
  const { products, loading, firestoreError, updateProduct, deleteProduct } = useProductStore();
  const [modal, setModal] = useState<{ open: boolean; product?: Product }>({ open: false });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [stockEditing, setStockEditing] = useState<Record<string, string>>({});

  if (!isFirebaseConfigured) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
        <p style={{ marginBottom: '8px', fontSize: '24px' }}>🔧</p>
        <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>Firebase no configurado</p>
        <p>Completá las variables en <code style={{ fontSize: '12px', backgroundColor: 'var(--tint-md)', padding: '2px 6px', borderRadius: '4px' }}>.env.local</code> para habilitar la gestión de productos.</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    setDeletingId(id);
    try { await deleteProduct(id); } finally { setDeletingId(null); }
  };

  const commitStock = async (product: Product) => {
    const raw = stockEditing[product.id];
    if (raw === undefined) return;
    const val = parseInt(raw, 10);
    if (!isNaN(val) && val >= 0 && val !== product.stock) {
      await updateProduct(product.id, { stock: val });
    }
    setStockEditing((s) => { const n = { ...s }; delete n[product.id]; return n; });
  };

  return (
    <>
      {/* Banner de error Firestore */}
      {firestoreError && (
        <div style={{
          marginBottom: '20px', padding: '12px 16px', borderRadius: '10px',
          backgroundColor: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)',
          fontSize: '12px', color: 'rgb(185,28,28)',
        }}>
          <strong>Error de conexión con Firestore:</strong> {firestoreError}
          <br />
          <span style={{ opacity: 0.8 }}>
            Revisá las reglas en Firebase Console → Firestore → Rules. Deben permitir read/write.
          </span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            {products.length} producto{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setModal({ open: true })}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', border: 'none',
            backgroundColor: 'var(--action-bg)', color: 'var(--action-text)',
            boxShadow: 'var(--btn-shadow)',
          }}
        >
          <Plus size={14} /> Agregar producto
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
          Cargando productos...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {products.map((product) => {
            const stockVal = stockEditing[product.id] ?? String(product.stock);
            return (
              <div
                key={product.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '52px 1fr auto auto auto',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg)',
                }}
              >
                {/* Thumbnail */}
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/fallback/48/48'; }}
                />

                {/* Info */}
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.name}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    {product.category} · ${product.price.toLocaleString('es-AR')}
                    {product.badge && <span style={{ marginLeft: '6px', padding: '1px 6px', borderRadius: '9999px', backgroundColor: 'var(--tint-md)', fontSize: '10px' }}>{product.badge}</span>}
                  </p>
                </div>

                {/* Stock inline edit */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => {
                      const cur = parseInt(stockEditing[product.id] ?? String(product.stock), 10);
                      if (cur > 0) {
                        const next = String(cur - 1);
                        setStockEditing((s) => ({ ...s, [product.id]: next }));
                        updateProduct(product.id, { stock: cur - 1 });
                      }
                    }}
                    style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)', cursor: 'pointer', fontSize: '14px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >−</button>
                  <input
                    type="number"
                    min="0"
                    value={stockVal}
                    onChange={(e) => setStockEditing((s) => ({ ...s, [product.id]: e.target.value }))}
                    onBlur={() => commitStock(product)}
                    onKeyDown={(e) => e.key === 'Enter' && commitStock(product)}
                    style={{ width: '48px', textAlign: 'center', padding: '4px 6px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
                  />
                  <button
                    onClick={() => {
                      const cur = parseInt(stockEditing[product.id] ?? String(product.stock), 10);
                      const next = String(cur + 1);
                      setStockEditing((s) => ({ ...s, [product.id]: next }));
                      updateProduct(product.id, { stock: cur + 1 });
                    }}
                    style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)', cursor: 'pointer', fontSize: '14px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >+</button>
                </div>

                {/* Edit */}
                <button
                  onClick={() => setModal({ open: true, product })}
                  style={{ width: '32px', height: '32px', borderRadius: '7px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Editar"
                >
                  <Pencil size={13} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingId === product.id}
                  style={{ width: '32px', height: '32px', borderRadius: '7px', border: '1px solid rgba(220,38,38,0.25)', backgroundColor: 'var(--bg)', color: 'rgb(220,38,38)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: deletingId === product.id ? 0.5 : 1 }}
                  title="Eliminar"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {modal.open && (
        <ProductModal
          editing={modal.product ?? null}
          onClose={() => setModal({ open: false })}
        />
      )}
    </>
  );
}
