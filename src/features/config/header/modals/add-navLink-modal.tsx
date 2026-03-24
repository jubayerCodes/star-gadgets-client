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
import { useState } from "react";
import { UpdateHeaderConfigFormData } from "../schema";
import { UseFormReturn } from "react-hook-form";
import DashboardButton from "@/components/dashboard/dashboard-button";
import { Plus, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCategoriesListInfinityQuery } from "@/features/categories/hooks/useCategories";
import { useDebounce } from "@/hooks/use-debounce";

interface AddNavLinkModalProps {
  form: UseFormReturn<UpdateHeaderConfigFormData>;
}

function AddNavLinkModal({ form }: AddNavLinkModalProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selection, setSelection] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelection((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCategoriesListInfinityQuery(debouncedSearchValue);

  const categories = data?.pages.flatMap((page) => page.data) || [];

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={() => {
        form.reset();
      }}
    >
      <DialogTrigger
        render={
          <DashboardButton variant="outline" size="sm">
            <Plus className="h-4 w-4" /> Add
          </DashboardButton>
        }
      />
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-xl"}>Add Nav Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="flex items-center border-input border rounded-md px-3" cmdk-input-wrapper="">
              <SearchIcon className="text-muted-foreground/80" size={20} />
              <Input
                className={cn(
                  "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 border-none focus-visible:ring-0",
                )}
                placeholder="Search Category..."
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 max-h-[60vh] overflow-y-auto">
              {categories.map((category) => (
                <DashboardButton
                  size={"sm"}
                  variant={selection.includes(category._id) ? "default" : "outline"}
                  key={category._id}
                  onClick={() => toggleCategory(category._id)}
                >
                  {category.title}
                </DashboardButton>
              ))}
              {hasNextPage && (
                <DashboardButton variant="outline" size="sm" onClick={() => fetchNextPage()}>
                  {isFetchingNextPage ? "Loading..." : "Load More"}
                </DashboardButton>
              )}
            </div>
            <DialogFooter>
              <DashboardButton variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </DashboardButton>
              <DashboardButton
                onClick={() => {
                  form.setValue("header.navLinks", selection);
                  setOpen(false);
                }}
              >
                Add
              </DashboardButton>
            </DialogFooter>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default AddNavLinkModal;
