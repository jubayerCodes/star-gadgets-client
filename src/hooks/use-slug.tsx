import { useEffect, useState } from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

interface UseSlugProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  sourceName: Path<TFieldValues>;
  targetName: Path<TFieldValues>;
}

export const useSlug = <TFieldValues extends FieldValues>({
  form,
  sourceName,
  targetName,
}: UseSlugProps<TFieldValues>) => {
  const [isManualOverride, setIsManualOverride] = useState(false);

  // Watch the fields to trigger re-evaluations when they change
  const sourceValue = form.watch(sourceName) as string | undefined;
  const targetValue = form.watch(targetName) as string | undefined;

  // Helper to standardise slugs: lowercases, replaces spaces with dashes, removes invalid chars
  const generateSlug = (text: string | undefined): string => {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/[^a-z0-9-]/g, "") // Remove all non-alphanumeric chars (keeping dashes)
      .replace(/-+/g, "-") // Replace multiple dashes with a single dash
      .replace(/^-+/, ""); // Remove leading dashes
  };

  // Effect 1: Auto-update the target (slug) based on the source value if no manual override occurred
  useEffect(() => {
    if (!isManualOverride && sourceValue !== undefined) {
      const newSlug = generateSlug(sourceValue);
      // Only set if different to avoid infinite loops and unnecessary renders
      if (form.getValues(targetName) !== newSlug) {
        form.setValue(targetName, newSlug as PathValue<TFieldValues, Path<TFieldValues>>, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [sourceValue, isManualOverride, form, targetName]);

  // Effect 2: Watch for manual changes to the target field by the user
  useEffect(() => {
    if (targetValue !== undefined) {
      const sourceCurrentValue = form.getValues(sourceName) as string | undefined;
      const generatedFromSource = generateSlug(sourceCurrentValue || "");
      const generatedFromTarget = generateSlug(targetValue);

      // If the target value is not empty, and doesn't match the auto-generated
      // slug, we assume the user has manually changed the slug field.
      if (targetValue !== generatedFromSource && targetValue !== "" && generatedFromSource !== "") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsManualOverride(true);
      } else if (targetValue === "" && (!sourceCurrentValue || sourceCurrentValue === "")) {
        // Optionally reset manual override if both fields are blank, resetting state
        setIsManualOverride(false);
      } else if (targetValue === "" && sourceCurrentValue) {
        // If they clear the slug field completely while source exists, they might
        // be wanting to type their own, so we lock the manual override.
        setIsManualOverride(true);
      }

      // If the user's manual input has issues (e.g spaces, caps), reformat it
      // but keeping their manually typed intended slug.
      if (targetValue !== generatedFromTarget) {
        form.setValue(targetName, generatedFromTarget as PathValue<TFieldValues, Path<TFieldValues>>, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [targetValue, form, sourceName, targetName]);

  return { isManualOverride, setIsManualOverride };
};
