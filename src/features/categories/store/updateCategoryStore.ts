import { create } from "zustand";
import { ICategory } from "../types";

interface IUpdateCategoryStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: ICategory | null;
  openModal: ({ category }: { category: ICategory }) => void;
  closeModal: () => void;
}

export const useUpdateCategoryStore = create<IUpdateCategoryStore>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  category: null,
  openModal: ({ category }) => set({ open: true, category }),
  closeModal: () => set({ open: false, category: null }),
}));
