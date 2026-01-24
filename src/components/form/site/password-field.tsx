import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, UseFormReturn } from "react-hook-form";

interface PasswordFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
}

const PasswordField = ({ form, name, label, placeholder }: PasswordFieldProps) => {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className="gap-2">
          <FieldLabel className="text-sm font-normal">
            {label} <span className="text-destructive">*</span>
          </FieldLabel>
          <div className="relative">
            <Input
              type="password"
              placeholder={placeholder}
              {...field}
              className="rounded-none text-sm focus-visible:ring-0 border-2 border-input h-10"
            />
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default PasswordField;
