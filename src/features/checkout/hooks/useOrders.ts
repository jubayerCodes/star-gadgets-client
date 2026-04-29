import { QUERY_KEYS } from "@/constants";
import { keepPreviousData, useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  cancelOrderApi,
  createOrderApi,
  getAllOrdersApi,
  getMyOrdersApi,
  getOrderByIdApi,
  getPaymentByOrderIdApi,
  getPaymentByTransactionIdApi,
  initiatePaymentApi,
  updateOrderStatusApi,
  updatePaymentStatusApi,
} from "../api";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/extract-error-message";
import { IOrder } from "../types";

export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: createOrderApi,
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

export const useOrderByIdQuery = (id: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.ORDERS, id],
    queryFn: () => getOrderByIdApi(id),
    enabled: !!id,
    retry: false,
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

export const usePaymentByTransactionIdQuery = (transactionId: string | null) =>
  useQuery({
    queryKey: [QUERY_KEYS.ORDERS, "payment", "tx", transactionId],
    queryFn: () => getPaymentByTransactionIdApi(transactionId!),
    enabled: !!transactionId,
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

export const useInitiatePaymentMutation = () =>
  useMutation({
    mutationFn: initiatePaymentApi,
    onSuccess: (data) => {
      const url = data.data?.GatewayPageURL;
      if (url) window.location.href = url;
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

/**
 * Generates an invoice PDF client-side via @react-pdf/renderer and triggers a browser download.
 * Accepts the full IOrder object — no server round-trip needed.
 */
export const useDownloadInvoiceMutation = () =>
  useMutation({
    mutationFn: async (order: IOrder) => {
      const { pdf } = await import("@react-pdf/renderer");
      const { default: InvoicePDF } = await import("../components/invoice-pdf");
      const { createElement } = await import("react");
      type DocProps = import("@react-pdf/renderer").DocumentProps;
      const element = createElement(InvoicePDF, { order }) as import("react").ReactElement<DocProps>;
      const blob = await pdf(element).toBlob();
      return { blob, orderNumber: order.orderNumber };
    },
    onSuccess: ({ blob, orderNumber }) => {
      const safeNum = orderNumber.replace(/^SG-/, "");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `StarGadgets_INV_${safeNum}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
