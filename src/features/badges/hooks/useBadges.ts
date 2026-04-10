import { QUERY_KEYS } from "@/constants";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/extract-error-message";
import { ReadonlyURLSearchParams } from "next/navigation";
import { createBadgeApi, deleteBadgeApi, getBadgesAdminApi, updateBadgeApi } from "../api";

export const badgesAdminQueryOptions = (searchParams: ReadonlyURLSearchParams) => {
  return {
    queryKey: [QUERY_KEYS.BADGES_ADMIN, searchParams.toString()],
    queryFn: () => getBadgesAdminApi(searchParams),
    placeholderData: keepPreviousData,
    keepPreviousData: true,
  };
};

export const useAllBadgesQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BADGES],
    queryFn: () => getBadgesAdminApi(new URLSearchParams("limit=200") as unknown as ReadonlyURLSearchParams),
    staleTime: 1000 * 60 * 5, // 5 min
  });
};

export const useCreateBadgeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBadgeApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BADGES_ADMIN] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BADGES] });
      toast.success(data.message || "Badge created successfully");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useUpdateBadgeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBadgeApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BADGES_ADMIN] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BADGES] });
      toast.success(data.message || "Badge updated successfully");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useDeleteBadgeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBadgeApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BADGES_ADMIN] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BADGES] });
      toast.success(data.message || "Badge deleted successfully");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
