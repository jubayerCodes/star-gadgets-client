"use client";

import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react";

import { useFileUpload } from "@/hooks/use-file-upload";
import Image from "next/image";
import { useEffect } from "react";
import { Input } from "./ui/input";
import { IFile } from "@/types/file";

export default function SingleImageUploader({
  onChange,
  required,
  file,
}: {
  file: IFile;
  onChange: (value: IFile) => void;
  required?: boolean;
}) {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB default

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/*",
    maxSize,
  });

  useEffect(() => {
    if (files.length > 0) {
      const img = files[0]?.file;
      onChange({
        file: img,
        error: null,
      });
    } else {
      onChange({
        file: null,
        error: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);
  const previewUrl = files[0]?.preview || file.preview || null;
  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <div
          className="relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-input border-dashed p-4 transition-colors hover:bg-accent/10 has-disabled:pointer-events-none has-[img]:border-none has-disabled:opacity-50 data-[dragging=true]:bg-accent/10"
          data-dragging={isDragging || undefined}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          role="button"
          tabIndex={-1}
        >
          <Input
            required={required}
            {...getInputProps()}
            aria-label="Upload file"
            className="sr-only"
          />
          {previewUrl ? (
            <div className="absolute inset-0">
              <Image
                alt={files[0]?.file?.name || "Uploaded image"}
                fill
                className="object-cover"
                src={previewUrl}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                aria-hidden="true"
                className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
              >
                <ImageUpIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 font-medium text-sm">
                Drop your image here or click to browse
              </p>
              <p className="text-muted-foreground text-xs">
                Max size: {maxSizeMB}MB
              </p>
            </div>
          )}
        </div>
        {previewUrl && (
          <div className="absolute top-4 right-4">
            <button
              aria-label="Remove image"
              className="z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-none transition-[color,box-shadow] hover:bg-black/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              onClick={() => removeFile(files[0]?.id)}
              type="button"
            >
              <XIcon aria-hidden="true" className="size-4" />
            </button>
          </div>
        )}
      </div>

      {(errors.length > 0 || file.error) && (
        <div
          className="flex items-center gap-1 text-destructive text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0] || file.error}</span>
        </div>
      )}
    </div>
  );
}
