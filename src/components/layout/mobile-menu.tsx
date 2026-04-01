"use client";

import { useConfigStore } from "@/store/configStore";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "../ui/sheet";
import { Menu, ChevronDown, User, Heart, ShoppingCart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SearchInput from "../form/site/search-input";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Button } from "../ui/button";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

const MobileMenu = () => {
  const { config } = useConfigStore();
  const { user } = useAuthStore();
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
        <div className="p-4 border-b">
          <SearchInput className="w-full" />
        </div>
        
        <Tabs defaultValue="categories" className="flex-1 flex flex-col overflow-hidden">
          <div className="flex w-full border-b">
            <TabsList className="bg-transparent h-12 w-full p-0 flex">
              <TabsTrigger 
                value="menu" 
                className="flex-1 rounded-none h-full data-[state=active]:border-b data-[state=active]:border-primary data-[state=active]:shadow-none bg-muted/30 data-[state=active]:bg-muted"
              >
                MENU
              </TabsTrigger>
              <TabsTrigger 
                value="categories" 
                className="flex-1 rounded-none h-full data-[state=active]:border-b data-[state=active]:border-primary data-[state=active]:shadow-none bg-muted/30 data-[state=active]:bg-muted"
              >
                CATEGORIES
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="menu" className="flex-1 overflow-y-auto p-0 m-0 animate-none">
            <div className="flex flex-col">
              <Link href="/" onClick={() => setOpen(false)} className="px-4 py-3 border-b text-sm font-normal hover:bg-muted/50 transition">
                Home
              </Link>
              {user ? (
                <>
                  <Link href="/account" onClick={() => setOpen(false)} className="px-4 py-3 border-b text-sm font-normal hover:bg-muted/50 transition flex items-center gap-2">
                    <User className="size-4" /> My Account
                  </Link>
                  <Link href="/account/orders" onClick={() => setOpen(false)} className="px-4 py-3 border-b text-sm font-normal hover:bg-muted/50 transition">
                    Order History
                  </Link>
                </>
              ) : (
                <Link href="/account/login" onClick={() => setOpen(false)} className="px-4 py-3 border-b text-sm font-normal hover:bg-muted/50 transition flex items-center gap-2">
                  <User className="size-4" /> Login / Register
                </Link>
              )}
              <Link href="/wishlist" onClick={() => setOpen(false)} className="px-4 py-3 border-b text-sm font-normal hover:bg-muted/50 transition flex items-center gap-2">
                <Heart className="size-4" /> Wishlist
              </Link>
              <Link href="/cart" onClick={() => setOpen(false)} className="px-4 py-3 border-b text-sm font-normal hover:bg-muted/50 transition flex items-center gap-2">
                <ShoppingCart className="size-4" /> Cart
              </Link>
              <Link href="/pc-builder" onClick={() => setOpen(false)} className="px-4 py-3 border-b text-sm font-normal hover:bg-muted/50 transition">
                PC Builder
              </Link>
              <Link href="/contact-us" onClick={() => setOpen(false)} className="px-4 py-3 border-b text-sm font-normal hover:bg-muted/50 transition">
                Contact Us
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="categories" className="flex-1 overflow-y-auto p-0 m-0 animate-none">
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
                          <Button variant="ghost" size="sm" className="h-auto py-3 px-4 rounded-none hover:bg-accent border-l group-data-[state=open]/collapsible:bg-accent group-data-[state=open]/collapsible:text-accent-foreground">
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
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
