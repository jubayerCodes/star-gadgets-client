"use client";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
}

const PasswordField = ({ form, name, label, placeholder }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

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
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              {...field}
              className="rounded-none text-sm focus-visible:ring-0 border-2 border-input h-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default PasswordField;
