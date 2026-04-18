"use client";

import { Field, FieldError } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller, UseFormReturn } from "react-hook-form";

interface CheckboxFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  label: React.ReactNode;
}

const CheckboxField = ({ form, name, label }: CheckboxFieldProps) => {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          <label className="flex items-start gap-2 cursor-pointer">
            <Checkbox
              id={name}
              checked={!!field.value}
              onCheckedChange={field.onChange}
            />
            <span className="text-sm leading-snug">{label}</span>
          </label>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default CheckboxField;
