import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateShippingConfigApi } from "../api";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants";
import { extractErrorMessage } from "@/lib/extract-error-message";

export const useUpdateShippingConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { shippingMethods: { name: string; cost: number }[] };
    }) => updateShippingConfigApi(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONFIG] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
