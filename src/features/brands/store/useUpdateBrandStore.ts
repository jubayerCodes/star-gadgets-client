import { create } from "zustand";
import { IBrand } from "../types";

interface IUseUpdateBrandStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  brand: IBrand | null;
  openModal: ({ brand }: { brand: IBrand }) => void;
  closeModal: () => void;
}

export const useUpdateBrandStore = create<IUseUpdateBrandStore>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  brand: null,
  openModal: ({ brand }) => set({ open: true, brand }),
  closeModal: () => set({ open: false, brand: null }),
}));
