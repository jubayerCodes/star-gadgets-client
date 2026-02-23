import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";

interface InputFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

const DashboardInputField = ({ form, name, label, placeholder, required }: InputFieldProps) => {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className="gap-2">
          <FieldLabel className="text-sm font-normal gap-0.5">
            {label} {required && <span className="text-destructive">*</span>}
          </FieldLabel>
          <Input
            placeholder={placeholder}
            {...field}
            required={required}
            className="text-sm focus-visible:ring-0 border border-input h-10"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default DashboardInputField;
