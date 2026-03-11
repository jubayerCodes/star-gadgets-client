"use client";

import DashboardButton from "@/components/dashboard/dashboard-button";
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import SingleImageUploader from "@/components/SingleImageUploader";
import { IFile } from "@/types/file";
import { useUploadImageMutation } from "../hooks/useGallery";

const UploadImageModal = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<IFile>({
    file: null,
    error: null,
  });

  const { mutateAsync: uploadImage, isPending } = useUploadImageMutation();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!file.file) {
      setFile((prev) => ({ ...prev, error: "Please select an image to upload" }));
      return;
    }

    const formData = new FormData();
    formData.append("file", file.file);

    const res = await uploadImage(formData);
    if (res && res.success) {
      setOpen(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (isPending) return;
        setOpen((prev) => !prev);
      }}
      onOpenChangeComplete={() => {
        setFile({
          file: null,
          error: null,
        });
      }}
    >
      <DialogTrigger render={<DashboardButton>Upload Image</DashboardButton>} />
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Upload Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <SingleImageUploader file={file} onChange={setFile} required />
            <DialogFooter>
              <DashboardButton type="button" onClick={handleSubmit} className="w-full!" isLoading={isPending}>
                Upload
              </DashboardButton>
            </DialogFooter>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default UploadImageModal;
