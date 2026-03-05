import { create } from "zustand";
import { ISubCategoryAdmin } from "../types";

interface IUpdateSubCategoryStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  subCategory: ISubCategoryAdmin | null;
  openModal: ({ subCategory }: { subCategory: ISubCategoryAdmin }) => void;
  closeModal: () => void;
}

export const useUpdateSubCategoryStore = create<IUpdateSubCategoryStore>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  subCategory: null,
  openModal: ({ subCategory }) => set({ open: true, subCategory }),
  closeModal: () => set({ open: false, subCategory: null }),
}));
