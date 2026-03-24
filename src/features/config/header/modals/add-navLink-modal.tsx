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
import { useRef, useState } from "react";
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
  const [selection, setSelection] = useState<{ _id: string; title: string }[]>([]);

  const toggleCategory = (category: { _id: string; title: string }) => {
    setSelection((prev) => (prev.includes(category) ? prev.filter((i) => i !== category) : [...prev, category]));
  };

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCategoriesListInfinityQuery(debouncedSearchValue);

  const categories = data?.pages.flatMap((page) => page.data) || [];
  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = (node: Element | null) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (node) observer.current.observe(node);
  };

  const handleAdd = () => {
    const currentNavLinks = form.getValues("header.navLinks");
    const newNavLinks = [...currentNavLinks, ...selection];
    form.setValue("header.navLinks", newNavLinks);
    setOpen(false);
    setSelection([]);
    setSearchValue("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              {categories.map((category, idx) => (
                <DashboardButton
                  size={"sm"}
                  variant={selection.includes(category) ? "default" : "outline"}
                  key={category._id}
                  onClick={() => toggleCategory(category)}
                  ref={idx === categories.length - 1 ? lastItemRef : undefined}
                  className={"text-xs h-7 px-2"}
                >
                  {category.title}
                </DashboardButton>
              ))}
            </div>
            <DialogFooter>
              <DashboardButton type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </DashboardButton>
              <DashboardButton onClick={handleAdd} type="button">
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
