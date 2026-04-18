import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IWishlistItem {
  productId: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  regularPrice: number;
  /** Category title for display */
  category?: string;
  /** Brand title for display */
  brand?: string;
  addedAt: number; // timestamp
}

interface IWishlistStore {
  items: IWishlistItem[];
  addItem: (item: Omit<IWishlistItem, "addedAt">) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: Omit<IWishlistItem, "addedAt">) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<IWishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (incoming) => {
        const already = get().items.some((i) => i.productId === incoming.productId);
        if (!already) {
          set({ items: [...get().items, { ...incoming, addedAt: Date.now() }] });
        }
      },

      removeItem: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),

      toggleItem: (incoming) => {
        const already = get().items.some((i) => i.productId === incoming.productId);
        if (already) {
          set((s) => ({ items: s.items.filter((i) => i.productId !== incoming.productId) }));
        } else {
          set({ items: [...get().items, { ...incoming, addedAt: Date.now() }] });
        }
      },

      isWishlisted: (productId) => get().items.some((i) => i.productId === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "star-gadgets-wishlist",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const selectWishlistCount = (s: IWishlistStore) => s.items.length;
