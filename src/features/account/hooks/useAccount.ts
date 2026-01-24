import { useMutation, useQuery } from "@tanstack/react-query";
import { createUserApi, getCurrentUserApi, loginUserApi } from "../api";
import { extractErrorMessage } from "@/lib/extract-error-message";
import { toast } from "sonner";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUserApi,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err));
    },
  });
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUserApi,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err));
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getCurrentUserApi,
  });
};
