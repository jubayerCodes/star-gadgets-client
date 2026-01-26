import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SearchInput = ({ className }: { className?: string }) => {
  return (
    <Input
      placeholder="Search for products..."
      className={cn("rounded-none text-sm focus-visible:ring-0 border-2 border-input h-10", className)}
    />
  );
};

export default SearchInput;
