import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

interface ImageFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  label: string;
  required?: boolean;
}

const DashboardImageField = ({ form, name, label, required }: ImageFieldProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, onBlur, ref }, fieldState }) => (
        <Field className="gap-2">
          <FieldLabel className="text-sm font-normal">
            {label} {required && <span className="text-destructive">*</span>}
          </FieldLabel>

          {/* Image preview */}
          {preview ? (
            <div className="relative w-40 h-40 rounded-md overflow-hidden border border-input p-4">
              <Image src={preview} width={400} height={400} alt="Preview" className="w-full h-full object-contain" />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  form.setValue(name, null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-destructive transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          ) : (
            <Input
              ref={(e) => {
                ref(e);
                (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = e;
              }}
              required={required}
              type="file"
              accept="image/*"
              onBlur={onBlur}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                onChange(file); // pass the File object to RHF
                if (file) {
                  setPreview(URL.createObjectURL(file));
                } else {
                  setPreview(null);
                }
              }}
              className="text-sm focus-visible:ring-0 border-2 border-input h-10 cursor-pointer"
            />
          )}

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default DashboardImageField;
