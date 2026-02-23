"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Controller,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export default function InfinityComboboxField<
  T extends FieldValues,
  TPath extends FieldPath<T>,
>({
  form,
  name,
  items,
  placeholder,
  required,
  label,
}: {
  form: UseFormReturn<T>;
  name: TPath;
  items: {
    label: string;
    value: string;
  }[];
  placeholder: string;
  required?: boolean;
  label: string;
}) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Controller
      control={form.control}
      name={name}
      rules={{
        required: required ? "This field is required" : false,
        validate: required
          ? (value) => (value && value !== "" ? true : "This field is required")
          : undefined,
      }}
      render={({ field, fieldState }) => {
        return (
          <Field>
            <div className="*:not-first:mt-2">
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
                    <span
                      className={cn(
                        "truncate",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? items.find((item) => item.value === field.value)
                            ?.label
                        : placeholder}
                    </span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="shrink-0 text-muted-foreground/80"
                      size={16}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
                >
                  <Command>
                    <CommandInput
                      placeholder={`Search ${label.toLowerCase()}...`}
                      className="text-sm focus-visible:ring-0 border border-input h-10"
                    />
                    <CommandList>
                      <CommandEmpty>No items found.</CommandEmpty>
                      <CommandGroup>
                        {items.map((item) => (
                          <CommandItem
                            key={item.value}
                            onSelect={(currentValue) => {
                              const item = items.find(
                                (item) => item.label === currentValue,
                              );

                              if (item?.value === field.value) {
                                field.onChange("");
                              } else {
                                field.onChange(item?.value || "");
                              }

                              setOpen(false);
                            }}
                            value={item.label}
                          >
                            {item.label}
                            {field.value === item.value && (
                              <CheckIcon className="ml-auto" size={16} />
                            )}
                          </CommandItem>
                        ))}
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
