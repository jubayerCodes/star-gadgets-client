import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProductApi } from "../api";

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductApi,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Product created successfully");
        queryClient.invalidateQueries({ queryKey: ["products"] });
      } else {
        toast.error(data.message || "Failed to create product");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      // eslint-disable-next-line no-console
      console.error("Error creating product:", error);
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong while creating the product.",
      );
    },
  });
};
