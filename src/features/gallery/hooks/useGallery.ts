import { QUERY_KEYS } from "@/constants";
import { deleteImageApi, getImagesApi, getImagesListApi, uploadImageApi } from "../api";
import { keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/extract-error-message";
import { ReadonlyURLSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";

export const galleryQueryOptions = (searchParams: ReadonlyURLSearchParams) => {
  return {
    queryKey: [QUERY_KEYS.GALLERY, searchParams.toString()],
    queryFn: () => getImagesApi(searchParams),
    placeholderData: keepPreviousData,
  };
};

export const useGalleryInfinityQuery = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GALLERY, "infinity"],
    queryFn: ({ pageParam = 1 }) => getImagesListApi({ page: pageParam, limit: 12 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, total, limit } = lastPage.meta;
      const totalPages = Math.ceil(total / limit);
      return page < totalPages ? page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      const { page } = firstPage.meta;
      return page > 1 ? page - 1 : undefined;
    },
  });
};

export const useUploadImageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadImageApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GALLERY] });
      toast.success(data.message || "Image uploaded successfully");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useDeleteImageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteImageApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GALLERY] });
      toast.success(data.message || "Image deleted successfully");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
