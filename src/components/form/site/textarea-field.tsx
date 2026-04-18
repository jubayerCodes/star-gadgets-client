import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Controller, UseFormReturn } from "react-hook-form";

interface TextareaFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  hint?: string;
}

const TextareaField = ({
  form,
  name,
  label,
  placeholder,
  required,
  rows,
  hint,
}: TextareaFieldProps) => {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className="gap-2">
          <FieldLabel className="text-sm font-normal">
            {label}{" "}
            {required ? (
              <span className="text-destructive">*</span>
            ) : hint ? (
              <span className="text-muted-foreground text-xs">{hint}</span>
            ) : null}
          </FieldLabel>
          <Textarea
            placeholder={placeholder}
            rows={rows}
            {...field}
            className="rounded-none text-sm focus-visible:ring-0 border-2 border-input"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default TextareaField;
