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

// ─── Single-select props ───────────────────────────────────────────────────────
interface SingleGalleryImagePickerProps {
  multiple?: false;
  value?: string;
  onChange: (url: string) => void;
  required?: boolean;
  className?: string;
}

// ─── Multi-select props ────────────────────────────────────────────────────────
interface MultiGalleryImagePickerProps {
  multiple: true;
  value?: string[];
  onChange: (urls: string[]) => void;
  required?: boolean;
  className?: string;
}

type GalleryImagePickerProps = SingleGalleryImagePickerProps | MultiGalleryImagePickerProps;

// ─── Main component ────────────────────────────────────────────────────────────
export function GalleryImagePicker(props: GalleryImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("gallery");

  if (props.multiple) {
    // ── Multi-select mode ──
    const { value = [], onChange } = props;

    const handleConfirm = (urls: string[]) => {
      onChange(urls);
      setOpen(false);
    };

    const removeImage = (url: string) => {
      onChange(value.filter((u) => u !== url));
    };

    return (
      <div className={cn("flex flex-col gap-2", props.className)}>
        {/* Thumbnail strip */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((url, idx) => (
              <div key={idx} className="relative size-16 overflow-hidden rounded-lg border bg-accent/10 shrink-0">
                <Image src={url} alt={`Gallery image ${idx + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => removeImage(url)}
                  className="absolute right-0.5 top-0.5 z-10 flex size-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <XIcon className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Open modal trigger */}
        <div
          className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input p-3 text-sm text-muted-foreground transition-colors hover:bg-accent/10"
          onClick={() => setOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
        >
          <ImageUpIcon className="size-4" />
          <span>{value.length > 0 ? `${value.length} image(s) selected — click to edit` : "Click to select images from gallery"}</span>
          <Input type="hidden" aria-hidden="true" value={value.join(",")} required={props.required} />
        </div>

        {open && (
          <GalleryImagePickerModal
            open={open}
            onOpenChange={setOpen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            multiple
            initialSelection={value}
            onConfirm={handleConfirm}
          />
        )}
      </div>
    );
  }

  // ── Single-select mode (original behaviour) ──
  const { value, onChange } = props;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <div
          className={cn(
            "relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-input border-dashed p-4 transition-colors hover:bg-accent/10 cursor-pointer",
            props.className,
          )}
          onClick={() => setOpen(true)}
          role="button"
          tabIndex={0}
        >
          <Input type="hidden" aria-hidden="true" value={value || ""} required={props.required} />
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

// ─── Modal (handles both single and multi modes) ───────────────────────────────
type ModalProps =
  | {
      multiple?: false;
      open: boolean;
      onOpenChange: (open: boolean) => void;
      onSelect: (url: string) => void;
      activeTab: string;
      setActiveTab: (tab: string) => void;
      initialSelection?: never;
      onConfirm?: never;
    }
  | {
      multiple: true;
      open: boolean;
      onOpenChange: (open: boolean) => void;
      onSelect?: never;
      activeTab: string;
      setActiveTab: (tab: string) => void;
      initialSelection: string[];
      onConfirm: (urls: string[]) => void;
    };

function GalleryImagePickerModal({
  open,
  onOpenChange,
  onSelect,
  activeTab,
  setActiveTab,
  multiple,
  initialSelection,
  onConfirm,
}: ModalProps) {
  // For multi mode, track selection locally until confirmed
  const [selection, setSelection] = useState<string[]>(initialSelection ?? []);

  const toggleImage = (url: string) => {
    setSelection((prev) => (prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]));
  };

  const handleUploadedSingle = (url: string) => {
    if (multiple) {
      setSelection((prev) => (prev.includes(url) ? prev : [...prev, url]));
    } else {
      onSelect(url);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">{multiple ? "Select Images" : "Select Image"}</DialogTitle>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <TabsList className="mb-4 self-start">
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="upload">Upload New</TabsTrigger>
            </TabsList>
            <TabsContent value="gallery" className="flex-1 overflow-y-auto min-h-0">
              <GalleryTabContent
                onSelect={multiple ? toggleImage : onSelect!}
                multiple={multiple}
                selection={multiple ? selection : undefined}
              />
            </TabsContent>
            <TabsContent value="upload" className="flex-1 min-h-0">
              <UploadTabContent onSelect={handleUploadedSingle} />
            </TabsContent>
          </Tabs>

          {/* Multi-select footer confirm button */}
          {multiple && (
            <DialogFooter className="pt-4 border-t">
              <DashboardButton
                type="button"
                onClick={() => onConfirm(selection)}
              >
                Confirm Selection ({selection.length})
              </DashboardButton>
            </DialogFooter>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

// ─── Gallery tab ───────────────────────────────────────────────────────────────
function GalleryTabContent({
  onSelect,
  multiple,
  selection,
}: {
  onSelect: (url: string) => void;
  multiple?: boolean;
  selection?: string[];
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGalleryInfinityQuery();

  const images = data?.pages.flatMap((page) => page.data) || [];

  if (isLoading) {
    return <div className="py-12 text-center text-muted-foreground">Loading images...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pr-2">
        {images.length > 0 ? (
          images.map((img, idx) => {
            const url = img.secureUrl || img.url;
            const isSelected = multiple && selection?.includes(url);

            return (
              <div
                key={idx}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-xl border bg-accent/10 cursor-pointer transition-all",
                  isSelected && "ring-2 ring-primary ring-offset-2",
                )}
                onClick={() => onSelect(url)}
              >
                <Image
                  src={url}
                  alt="Gallery Image"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                />
                {/* Hover overlay */}
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                    isSelected ? "bg-primary/30 opacity-100" : "bg-black/40 opacity-0 group-hover:opacity-100",
                  )}
                >
                  <CheckIcon className="size-8 text-white" />
                </div>
              </div>
            );
          })
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

// ─── Upload tab ────────────────────────────────────────────────────────────────
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
