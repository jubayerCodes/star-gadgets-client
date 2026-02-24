"use client";

import { CheckIcon, ChevronDownIcon, Loader } from "lucide-react";
import { useId, useState, useRef } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Controller, FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { ApiResponse } from "@/types";
import { useDebounce } from "@/hooks/use-debounce";

export default function InfinityComboboxField<T extends FieldValues, TPath extends FieldPath<T>>({
  form,
  name,
  placeholder,
  required,
  label,
  infinityFunction,
}: {
  form: UseFormReturn<T>;
  name: TPath;
  placeholder: string;
  required?: boolean;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  infinityFunction: (search: string) => UseInfiniteQueryResult<InfiniteData<ApiResponse<any>>, unknown>;
}) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = infinityFunction(debouncedSearchValue);

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

  const items =
    data?.pages
      .flatMap((page) => page.data)
      .map((item) => ({
        value: item._id,
        label: item.title,
      })) || [];

  return (
    <Controller
      control={form.control}
      name={name}
      rules={{
        required: required,
      }}
      render={({ field, fieldState }) => {
        return (
          <Field className="gap-1">
            <div className="flex flex-col gap-1">
              <FieldLabel htmlFor={id} className="text-sm font-normal gap-0.5">
                {label}
                {required && <span className="text-destructive">*</span>}
              </FieldLabel>
              <Popover onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                  <Button
                    aria-expanded={open}
                    className="w-full justify-between border-input bg-background px-3 font-normal outline-none outline-offset-0 hover:bg-background hover:text-foreground focus-visible:outline-[3px] rounded-md"
                    id={id}
                    role="combobox"
                    variant="outline"
                  >
                    <span className={cn("truncate", !field.value && "text-muted-foreground")}>
                      {field.value ? items.find((item) => item.value === field.value)?.label : placeholder}
                    </span>
                    <ChevronDownIcon aria-hidden="true" className="shrink-0 text-muted-foreground/80" size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
                >
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder={`Search ${label.toLowerCase()}...`}
                      value={searchValue}
                      onValueChange={(value) => setSearchValue(value)}
                    />
                    <CommandList>
                      <CommandEmpty>No items found.</CommandEmpty>
                      <CommandGroup>
                        {items.map((item, idx) => (
                          <CommandItem
                            key={idx}
                            ref={idx === items.length - 1 ? lastItemRef : undefined}
                            onSelect={(currentValue) => {
                              const item = items.find((item) => item.value === currentValue);

                              if (item?.value === field.value) {
                                field.onChange("");
                              } else {
                                field.onChange(item?.value || "");
                              }

                              setOpen(false);
                            }}
                            value={item.value}
                          >
                            {item.label}
                            {field.value === item.value && <CheckIcon className="ml-auto" size={16} />}
                          </CommandItem>
                        ))}
                        {isFetchingNextPage && (
                          <div className="py-2 text-center animate-spin w-full flex items-center justify-center">
                            <Loader size={16} />
                          </div>
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
