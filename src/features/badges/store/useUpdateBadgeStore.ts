import { create } from "zustand";
import { IBadge } from "../types";

interface IUseUpdateBadgeStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  badge: IBadge | null;
  openModal: ({ badge }: { badge: IBadge }) => void;
  closeModal: () => void;
}

export const useUpdateBadgeStore = create<IUseUpdateBadgeStore>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  badge: null,
  openModal: ({ badge }) => set({ open: true, badge }),
  closeModal: () => set({ open: false, badge: null }),
}));
