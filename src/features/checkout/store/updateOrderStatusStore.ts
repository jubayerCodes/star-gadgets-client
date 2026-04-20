import { create } from "zustand";
import { IOrder } from "@/features/checkout/types";

interface IUpdateOrderStatusStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  order: IOrder | null;
  openModal: ({ order }: { order: IOrder }) => void;
  closeModal: () => void;
}

export const useUpdateOrderStatusStore = create<IUpdateOrderStatusStore>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  order: null,
  openModal: ({ order }) => set({ open: true, order }),
  closeModal: () => set({ open: false, order: null }),
}));
