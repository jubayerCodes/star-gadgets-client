import { useMutation } from "@tanstack/react-query";
import { validateCouponApi } from "../api";
import { extractErrorMessage } from "@/lib/extract-error-message";
import { toast } from "sonner";

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: validateCouponApi,
    onError: (err) => {
      toast.error(extractErrorMessage(err));
    },
  });
};
