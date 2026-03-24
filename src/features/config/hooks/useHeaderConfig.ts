import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateHeaderConfigPayload } from "../header/schema";
import { updateConfigApi } from "../api";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants";
import { extractErrorMessage } from "@/lib/extract-error-message";

export const useUpdateHeaderConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHeaderConfigPayload }) => updateConfigApi(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONFIG] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
