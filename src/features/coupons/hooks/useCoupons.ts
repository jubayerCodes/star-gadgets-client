import { QUERY_KEYS } from "@/constants";
import { keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import { createCouponApi, deleteCouponApi, getAllCouponsApi } from "../api";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/extract-error-message";
import { ReadonlyURLSearchParams } from "next/navigation";

export const couponsAdminQueryOptions = (searchParams: ReadonlyURLSearchParams) => {
  return {
    queryKey: [QUERY_KEYS.COUPON, searchParams.toString()],
    queryFn: () => getAllCouponsApi(searchParams),
    placeholderData: keepPreviousData,
  };
};

export const useCreateCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCouponApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COUPON] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useDeleteCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCouponApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COUPON] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
