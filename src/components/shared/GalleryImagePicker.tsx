"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageUpIcon, AlertCircleIcon, XIcon, CheckIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Input } from "@/components/ui/input";
import DashboardButton from "@/components/dashboard/dashboard-button";
import { useUploadImageMutation, useGalleryInfinityQuery } from "@/features/gallery/hooks/useGallery";
import { cn } from "@/lib/utils";

interface GalleryImagePickerProps {
  value?: string;
  onChange: (url: string) => void;
  required?: boolean;
  className?: string;
}

export function GalleryImagePicker({ value, onChange, required, className }: GalleryImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("gallery");

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <div
          className={cn(
            "relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-input border-dashed p-4 transition-colors hover:bg-accent/10 cursor-pointer",
            className,
          )}
          onClick={() => setOpen(true)}
          role="button"
          tabIndex={0}
        >
          <Input type="hidden" aria-hidden="true" value={value || ""} required={required} />
          {value ? (
            <div className="absolute inset-0">
              <Image alt="Selected image" fill className="object-cover" src={value} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                aria-hidden="true"
                className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
              >
                <ImageUpIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 font-medium text-sm">Click to pick an image from Gallery or Upload</p>
            </div>
          )}
        </div>
        {value && (
          <div className="absolute top-4 right-4">
            <button
              aria-label="Remove image"
              className="z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-none transition-[color,box-shadow] hover:bg-black/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              type="button"
            >
              <XIcon aria-hidden="true" className="size-4" />
            </button>
          </div>
        )}
      </div>

      {open && (
        <GalleryImagePickerModal
          open={open}
          onOpenChange={setOpen}
          onSelect={(url) => {
            onChange(url);
            setOpen(false);
          }}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}

function GalleryImagePickerModal({
  open,
  onOpenChange,
  onSelect,
  activeTab,
  setActiveTab,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">Select Image</DialogTitle>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <TabsList className="mb-4 self-start">
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="upload">Upload New</TabsTrigger>
            </TabsList>
            <TabsContent value="gallery" className="flex-1 overflow-y-auto min-h-0">
              <GalleryTabContent onSelect={onSelect} />
            </TabsContent>
            <TabsContent value="upload" className="flex-1 min-h-0">
              <UploadTabContent onSelect={onSelect} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

function GalleryTabContent({ onSelect }: { onSelect: (url: string) => void }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGalleryInfinityQuery();

  const images = data?.pages.flatMap((page) => page.data) || [];

  if (isLoading) {
    return <div className="py-12 text-center text-muted-foreground">Loading images...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pr-2">
        {images.length > 0 ? (
          images.map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-square overflow-hidden rounded-xl border bg-accent/10 cursor-pointer"
              onClick={() => onSelect(img.secureUrl || img.url)}
            >
              <Image
                src={img.secureUrl || img.url}
                alt="Gallery Image"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                <CheckIcon className="size-8 text-white" />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground">No images found in the gallery.</div>
        )}
      </div>
      {hasNextPage && (
        <div className="flex justify-center pt-4 pb-8">
          <DashboardButton onClick={() => fetchNextPage()} isLoading={isFetchingNextPage} type="button">
            Load More
          </DashboardButton>
        </div>
      )}
    </div>
  );
}

function UploadTabContent({ onSelect }: { onSelect: (url: string) => void }) {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;
  const { mutateAsync: uploadImage, isPending } = useUploadImageMutation();

  const [
    { files, isDragging, errors },
    { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, removeFile, getInputProps },
  ] = useFileUpload({
    accept: "image/*",
    maxSize,
  });

  const file = files[0];
  const previewUrl = file?.preview || null;

  const handleSubmit = async () => {
    if (!file?.file) return;

    const formData = new FormData();
    formData.append("file", file.file as File);

    const res = await uploadImage(formData);
    if (res && res.success) {
      onSelect(res.data.secureUrl || res.data.url);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="relative">
          <div
            className="relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-input border-dashed p-4 transition-colors hover:bg-accent/10 data-[dragging=true]:bg-accent/10 cursor-pointer"
            data-dragging={isDragging || undefined}
            onClick={openFileDialog}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            role="button"
            tabIndex={-1}
          >
            <Input {...getInputProps()} aria-label="Upload file" className="sr-only" />
            {previewUrl ? (
              <div className="absolute inset-0">
                <Image alt={file?.file?.name || "Uploaded image"} fill className="object-cover" src={previewUrl} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                <div
                  aria-hidden="true"
                  className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
                >
                  <ImageUpIcon className="size-4 opacity-60" />
                </div>
                <p className="mb-1.5 font-medium text-sm">Drop your image here or click to browse</p>
                <p className="text-muted-foreground text-xs">Max size: {maxSizeMB}MB</p>
              </div>
            )}
          </div>
          {previewUrl && (
            <div className="absolute top-4 right-4">
              <button
                aria-label="Remove image"
                className="z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-none transition-[color,box-shadow] hover:bg-black/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file?.id);
                }}
                type="button"
              >
                <XIcon aria-hidden="true" className="size-4" />
              </button>
            </div>
          )}
        </div>

        {errors.length > 0 && (
          <div className="flex items-center gap-1 text-destructive text-xs" role="alert">
            <AlertCircleIcon className="size-3 shrink-0" />
            <span>{errors[0]}</span>
          </div>
        )}
      </div>

      <DialogFooter>
        <DashboardButton
          type="button"
          onClick={handleSubmit}
          className="w-full!"
          isLoading={isPending}
          disabled={!file?.file || isPending}
        >
          Upload & Select
        </DashboardButton>
      </DialogFooter>
    </div>
  );
}
