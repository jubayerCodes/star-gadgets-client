import { LucideIcon, Trash2Icon } from "lucide-react";
import { create } from "zustand";

export interface DeleteModalStore {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  openModal: ({
    icon,
    title,
    description,
    onConfirm,
    confirmText,
  }: {
    icon?: LucideIcon;
    title: string;
    description?: string;
    onConfirm: () => Promise<void>;
    confirmText?: string;
  }) => void;
  icon: LucideIcon;
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
  closeModal: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  confirmText: string;
}

export const useDeleteModalStore = create<DeleteModalStore>()((set) => ({
  isOpen: false,
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  setOpen: (open) => set({ isOpen: open }),
  openModal: ({ icon, title, description, onConfirm, confirmText }) =>
    set({ isOpen: true, icon, title, description, onConfirm, confirmText }),
  icon: Trash2Icon,
  title: "",
  description: "",
  onConfirm: () => Promise.resolve(),
  closeModal: () =>
    set({
      isOpen: false,
      icon: Trash2Icon,
      title: "",
      description: "",
      isLoading: false,
      onConfirm: () => Promise.resolve(),
      confirmText: "Delete",
    }),
  confirmText: "Delete",
}));
