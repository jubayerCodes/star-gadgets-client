import { IConfigResponse } from "@/features/config/types";
import { create } from "zustand";

interface IConfigStore {
  config: IConfigResponse | null;
  isLoading: boolean;
  error: string | null;
  setConfig: (config: IConfigResponse | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useConfigStore = create<IConfigStore>()((set) => ({
  config: null,
  isLoading: false,
  error: null,
  setConfig: (config) => set({ config, error: null, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
}));
