import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateHeroConfigPayload } from "../hero/types";
import { updateHeroConfigApi } from "../api";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants";
import { extractErrorMessage } from "@/lib/extract-error-message";

export const useUpdateHeroConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHeroConfigPayload }) =>
      updateHeroConfigApi(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONFIG] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
