import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ICartItem {
  productId: string;
  slug: string;
  title: string;
  image: string;
  variantId: string;
  sku: string;
  price: number;
  regularPrice: number;
  quantity: number;
  attributes?: { name: string; value: string }[];
}

interface ICartStore {
  items: ICartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<ICartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<ICartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (incoming) => {
        const qty = incoming.quantity ?? 1;
        const existing = get().items.find((i) => i.variantId === incoming.variantId);
        if (existing) {
          set({
            isOpen: true,
          });
        } else {
          set({ items: [...get().items, { ...incoming, quantity: qty }] });
        }
      },
      removeItem: (variantId) => set((s) => ({ items: s.items.filter((i) => i.variantId !== variantId) })),
      updateQuantity: (variantId, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.variantId !== variantId)
              : s.items.map((i) => (i.variantId === variantId ? { ...i, quantity: qty } : i)),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "star-gadgets-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const selectCartCount = (s: ICartStore) => s.items.reduce((acc, i) => acc + i.quantity, 0);

export const selectCartSubtotal = (s: ICartStore) => s.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
