import DashboardButton from "@/components/dashboard/dashboard-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const CreateCategoryModal = () => {
  return (
    <Dialog>
      <DialogTrigger render={<DashboardButton>Add Category</DashboardButton>} />
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Add a new category to your store. This will be visible to your customers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost">Cancel</Button>} />
            <DialogClose render={<Button>Add Category</Button>} />
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default CreateCategoryModal;
