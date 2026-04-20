import { create } from "zustand";
import { ICoupon } from "../types";

interface IUpdateCouponStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  coupon: ICoupon | null;
  openModal: ({ coupon }: { coupon: ICoupon }) => void;
  closeModal: () => void;
}

export const useUpdateCouponStore = create<IUpdateCouponStore>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  coupon: null,
  openModal: ({ coupon }) => set({ open: true, coupon }),
  closeModal: () => set({ open: false, coupon: null }),
}));
