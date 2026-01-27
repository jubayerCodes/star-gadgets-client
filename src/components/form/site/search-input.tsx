import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const SearchInput = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative w-full", className)}>
      <Input
        placeholder="Search for products"
        className={cn(
          "h-11 rounded-none border pl-4 text-sm",
          "focus-visible:outline-none focus-visible:ring-1",
          "transition-colors",
        )}
      />
      <Search className="absolute right-3 top-1/2 size-5 -translate-y-1/2 cursor-pointer hover:text-accent-hover transition" />
    </div>
  );
};

export default SearchInput;
