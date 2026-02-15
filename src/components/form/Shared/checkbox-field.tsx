import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  label: string;
  required?: boolean;
}

const CheckboxField = ({ form, name, label, required }: CheckboxFieldProps) => {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className="gap-2 flex-row! justify-start! items-center!">
          <Checkbox
            id={name}
            name={name}
            checked={field.value}
            onCheckedChange={field.onChange}
            required={required}
            className={"border-accent/40! size-4! cursor-pointer!"}
          />
          <FieldLabel htmlFor={name} className="text-sm font-normal w-fit! cursor-pointer!">
            {label} {required && <span className="text-destructive">*</span>}
          </FieldLabel>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default CheckboxField;
