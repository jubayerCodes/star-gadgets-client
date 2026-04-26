import { QUERY_KEYS } from "@/constants";
import { keepPreviousData, useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  cancelOrderApi,
  createOrderApi,
  getAllOrdersApi,
  getMyOrdersApi,
  getOrderByIdApi,
  getPaymentByOrderIdApi,
  updateOrderStatusApi,
  updatePaymentStatusApi,
} from "../api";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/extract-error-message";

export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: createOrderApi,
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

export const useOrderByIdQuery = (id: string) =>
  useSuspenseQuery({
    queryKey: [QUERY_KEYS.ORDERS, id],
    queryFn: () => getOrderByIdApi(id),
  });

export const useMyOrdersQuery = (page = 1) =>
  useQuery({
    queryKey: [QUERY_KEYS.ORDERS, "my", page],
    queryFn: () => getMyOrdersApi(page),
    placeholderData: keepPreviousData,
  });

export const useAllOrdersQuery = (query: Record<string, string>) =>
  useSuspenseQuery({
    queryKey: [QUERY_KEYS.ORDERS, "admin", query],
    queryFn: () => getAllOrdersApi(query),
  });

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrderStatusApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelOrderApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const usePaymentByOrderIdQuery = (orderId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.ORDERS, "payment", orderId],
    queryFn: () => getPaymentByOrderIdApi(orderId),
    enabled: !!orderId,
  });

export const useUpdatePaymentStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePaymentStatusApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
