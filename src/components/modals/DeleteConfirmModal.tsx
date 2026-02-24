"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useDeleteModalStore } from "@/store/deleteModalStore";
import { Loader2Icon, Trash2Icon } from "lucide-react";

function DeleteConfirmModal() {
  const {
    isOpen,
    icon: Icon,
    title,
    description,
    onConfirm,
    closeModal,
    isLoading,
    setIsLoading,
    setOpen,
    confirmText,
  } = useDeleteModalStore();

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setOpen}>
        <AlertDialogContent size="sm" className="max-w-sm!">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              {Icon ? <Icon /> : <Trash2Icon />}
            </AlertDialogMedia>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              variant="outline"
              className="text-destructive border-destructive hover:bg-destructive/5 hover:text-destructive rounded-sm"
              onClick={() => closeModal()}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="hover:bg-destructive/60 rounded-sm"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {!isLoading && confirmText ? confirmText : "Delete"}
              {isLoading && <Loader2Icon className="animate-spin" />}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DeleteConfirmModal;
