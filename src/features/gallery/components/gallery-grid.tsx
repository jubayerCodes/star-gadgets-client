"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { galleryQueryOptions, useDeleteImageMutation } from "../hooks/useGallery";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { IconTrash } from "@tabler/icons-react";
import { useDeleteModalStore } from "@/store/deleteModalStore";
import { parseSearchQuery } from "@/lib/parseSearchQuery";
import { usePagination } from "@/hooks/use-pagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { IUploadImage } from "../types";

export const GalleryGrid = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useSuspenseQuery(galleryQueryOptions(searchParams));

  const { mutateAsync: deleteImage } = useDeleteImageMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const images = data?.data || [];
  const meta = data?.meta;

  const { page } = parseSearchQuery(searchParams);
  const pageIndex = page - 1;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 0;

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: page,
    paginationItemsToDisplay: 5,
    totalPages,
  });

  const updateSearchParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value);
    });
    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleDelete = (image: IUploadImage) => {
    const { openModal } = useDeleteModalStore.getState();
    openModal({
      title: "Delete Image",
      description: "Are you sure you want to delete this image? This action cannot be undone.",
      onConfirm: async () => {
        try {
          setDeletingId(image.publicId);
          await deleteImage(image.publicId);
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {images.length > 0 ? (
          images.map((img) => (
            <div
              key={img._id}
              className="group relative aspect-square overflow-hidden rounded-xl border bg-accent/10"
            >
              <Image
                src={img.secureUrl || img.url}
                alt="Gallery Upload"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-start justify-end p-2">
                <button
                  onClick={() => handleDelete(img)}
                  disabled={deletingId === img.publicId}
                  className="rounded-full bg-destructive p-2 text-white hover:bg-destructive/90 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Delete Image"
                >
                  <IconTrash className="size-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No images found in the gallery.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end w-full">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  aria-disabled={pageIndex === 0 ? true : undefined}
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer"
                  onClick={() => {
                    if (pageIndex === 0) return;
                    updateSearchParams({ page: (page - 1).toString() });
                  }}
                  role={pageIndex === 0 ? "link" : undefined}
                />
              </PaginationItem>

              {showLeftEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {pages.map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    className="cursor-pointer"
                    onClick={() => {
                      updateSearchParams({ page: p.toString() });
                    }}
                    isActive={p === pageIndex + 1}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {showRightEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  aria-disabled={pageIndex === totalPages - 1 ? true : undefined}
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer"
                  onClick={() => {
                    if (pageIndex === totalPages - 1) return;
                    updateSearchParams({ page: (page + 1).toString() });
                  }}
                  role={pageIndex === totalPages - 1 ? "link" : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
