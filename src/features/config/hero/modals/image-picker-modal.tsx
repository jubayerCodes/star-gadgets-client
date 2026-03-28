"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, ReactNode } from "react";
import DashboardButton from "@/components/dashboard/dashboard-button";
import SingleImageUploader from "@/components/SingleImageUploader";
import { IFile } from "@/types/file";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImagePickerModalProps {
  value?: string; // current image URL
  onChange: (url: string) => void;
  trigger?: ReactNode;
  label?: string;
}

function ImagePickerModal({ value, onChange, trigger, label = "Pick Image" }: ImagePickerModalProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<IFile>({ file: null, error: null });
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (f: IFile) => {
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file.file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file.file as File);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/single`,
        { method: "POST", body: formData },
      );
      const json = await res.json();
      const url: string = json?.data?.url ?? json?.data ?? "";
      if (url) {
        onChange(url);
        setOpen(false);
        setFile({ file: null, error: null });
      }
    } catch {
      setFile((prev) => ({ ...prev, error: "Upload failed. Please try again." }));
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFile({ file: null, error: null });
  };

  const defaultTrigger = (
    <button type="button" className="group relative flex items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-input bg-muted/30 transition-colors hover:bg-muted/60 hover:border-primary/50 overflow-hidden">
      {value ? (
        <>
          <Image src={value} alt="Hero image" fill className="object-cover rounded-lg" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <ImageIcon className="size-6 text-white" />
            <span className="ml-2 text-sm text-white font-medium">Change</span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageIcon className="size-7 opacity-60" />
          <span className="text-xs font-medium">{label}</span>
        </div>
      )}
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger ?? defaultTrigger} />
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <SingleImageUploader file={file} onChange={handleFileChange} />
          </div>
          <DialogFooter>
            <DashboardButton type="button" variant="outline" onClick={handleClose}>
              Cancel
            </DashboardButton>
            <DashboardButton
              type="button"
              onClick={handleUpload}
              disabled={!file.file || uploading}
            >
              {uploading ? "Uploading..." : "Upload & Select"}
            </DashboardButton>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default ImagePickerModal;
