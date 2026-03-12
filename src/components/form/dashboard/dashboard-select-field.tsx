import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

const DashboardSelectField = ({ form, name, label, options, placeholder = "Select an option", required }: SelectFieldProps) => {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className="gap-1 flex-col flex w-full">
          <FieldLabel className="text-sm font-normal gap-0.5">
            {label} {required && <span className="text-destructive">*</span>}
          </FieldLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
            <SelectTrigger className="w-full text-sm focus-visible:ring-0 border border-input h-10 shadow-sm transition-colors data-[state=open]:border-ring">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default DashboardSelectField;
