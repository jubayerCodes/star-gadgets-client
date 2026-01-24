import { IUser } from "@/features/account/types";
import { create } from "zustand";

interface IAuthStore {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: IUser | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const authStore = create<IAuthStore>()((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user, error: null, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
}));
