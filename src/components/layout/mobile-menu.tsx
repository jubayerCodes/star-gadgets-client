"use client";

import { useConfigStore } from "@/store/configStore";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "../ui/sheet";
import { Menu, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Button } from "../ui/button";
import { useState } from "react";

const MobileMenu = () => {
  const { config } = useConfigStore();
  const [open, setOpen] = useState(false);

  const categories = config?.header?.navLinks || [];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden shrink-0 hover:bg-accent/50">
          <Menu className="size-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 flex flex-col gap-0 border-r-0">
        <SheetTitle className="sr-only">Mobile Menu</SheetTitle>

        {/* Header label */}
        <div className="flex items-center h-12 px-4 border-b bg-muted/30">
          <span className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">Categories</span>
        </div>

        {/* Scrollable categories list */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col">
            {categories.map((category) => (
              <div key={category._id} className="border-b">
                {category.subCategories && category.subCategories.length > 0 ? (
                  <Collapsible className="group/collapsible">
                    <div className="flex items-stretch justify-between">
                      <Link
                        href={`/categories/${category.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex-1 px-4 py-3 text-sm font-normal hover:text-primary transition uppercase flex items-center"
                      >
                        {category.title}
                      </Link>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto py-3 px-4 rounded-none hover:bg-accent border-l group-data-[state=open]/collapsible:bg-accent group-data-[state=open]/collapsible:text-accent-foreground"
                        >
                          <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="bg-muted/10 border-t">
                      <div className="flex flex-col pl-4 divide-y">
                        {category.subCategories.map((sub) => (
                          <Link
                            key={sub._id}
                            href={`/sub-categories/${sub.slug}`}
                            onClick={() => setOpen(false)}
                            className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition font-normal"
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Link
                    href={`/categories/${category.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex px-4 py-3 text-sm font-normal hover:text-primary transition uppercase items-center"
                  >
                    {category.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
