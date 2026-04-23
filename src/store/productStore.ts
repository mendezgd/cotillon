import { create } from 'zustand';
import {
  collection,
  onSnapshot,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  setDoc,
  deleteField,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { PRODUCTS } from '../services/products';
import type { Product } from '../types';

const COL = 'products';

interface ProductStore {
  products: Product[];
  loading: boolean;
  firestoreError: string | null;
  subscribe: () => () => void;
  addProduct: (data: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id'>>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: PRODUCTS,
  loading: true,
  firestoreError: null,

  subscribe: () => {
    if (!isFirebaseConfigured) {
      set({ loading: false });
      return () => {};
    }

    // Seed una sola vez si la colección está vacía
    getDocs(collection(db, COL))
      .then(async (snap) => {
        if (snap.empty) {
          await Promise.all(PRODUCTS.map((p) => setDoc(doc(db, COL, p.id), p)));
        }
      })
      .catch((err: Error) => {
        set({ loading: false, firestoreError: err.message });
      });

    // Listener en tiempo real — solo actualiza, no seedea
    const unsub = onSnapshot(
      collection(db, COL),
      (snap) => {
        if (snap.empty) return;
        const products = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
        products.sort((a, b) => {
          const na = Number(a.id);
          const nb = Number(b.id);
          if (!isNaN(na) && !isNaN(nb)) return na - nb;
          return a.name.localeCompare(b.name);
        });
        set({ products, loading: false, firestoreError: null });
      },
      (err) => set({ loading: false, firestoreError: err.message }),
    );

    return unsub;
  },

  addProduct: async (data) => {
    const payload: Record<string, unknown> = { ...data };
    if (!payload.badge) delete payload.badge;
    if (payload.badge !== 'oferta') delete payload.discountPercent;
    await addDoc(collection(db, COL), payload);
  },

  updateProduct: async (id, updates) => {
    const payload: Record<string, unknown> = { ...updates };
    if ('badge' in payload && !payload.badge) payload.badge = deleteField();
    if (payload.badge !== 'oferta') payload.discountPercent = deleteField();
    await setDoc(doc(db, COL, id), payload, { merge: true });
  },

  deleteProduct: async (id) => {
    await deleteDoc(doc(db, COL, id));
  },

  uploadImage: async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'cotillon-products');
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData },
    );
    if (!res.ok) throw new Error('Error al subir imagen a Cloudinary');
    const data = await res.json();
    return data.secure_url as string;
  },
}));
