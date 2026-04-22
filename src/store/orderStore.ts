import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderStatus } from '../types';

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateStatus: (id: string, status: OrderStatus, notes?: string) => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),

      updateStatus: (id, status, notes) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id
              ? { ...o, status, ...(notes !== undefined ? { notes } : {}) }
              : o,
          ),
        })),
    }),
    { name: 'cotillon-orders' },
  ),
);
