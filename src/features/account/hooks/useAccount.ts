import { useMutation, useQuery } from "@tanstack/react-query";
import { createUserApi, getCurrentUserApi, loginUserApi } from "../api";
import { extractErrorMessage } from "@/lib/extract-error-message";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

export const useCreateUser = () => {
  const { setUser, setIsLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: createUserApi,
    onSuccess: (data) => {
      setUser(data.data);
      setIsLoading(false);
      setError(null);
    },
    onError: (err) => {
      setError(err?.message);
      toast.error(extractErrorMessage(err));
    },
  });
};

export const useLoginUser = () => {
  const { setUser, setIsLoading, setError } = useAuthStore();
  return useMutation({
    mutationFn: loginUserApi,
    onSuccess: (data) => {
      setUser(data.data);
      setIsLoading(false);
      setError(null);
    },

    onError: (err) => {
      setError(err?.message);
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
