import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ICartItem } from "./cartStore";

interface IBuyNowStore {
  item: ICartItem | null;
  setBuyNow: (item: ICartItem) => void;
  clearBuyNow: () => void;
}

export const useBuyNowStore = create<IBuyNowStore>()(
  persist(
    (set) => ({
      item: null,
      setBuyNow: (item) => set({ item }),
      clearBuyNow: () => set({ item: null }),
    }),
    {
      name: "sg-buy-now",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
