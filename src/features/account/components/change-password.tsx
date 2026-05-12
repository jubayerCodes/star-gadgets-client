"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, ChangePasswordFormValues } from "@/features/account/schema";
import { useChangePassword } from "@/features/account/hooks/useAccount";
import { FieldGroup } from "@/components/ui/field";
import PasswordField from "@/components/form/site/password-field";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

const ChangePassword = () => {
  const { mutateAsync: changePassword, isPending } = useChangePassword();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: ChangePasswordFormValues) => {
    await changePassword(values);
    form.reset();
  };

  return (
    <div className="border border-border bg-card p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start gap-3 mb-5 pb-4 border-b border-border">
        <div className="size-9 bg-primary/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="size-4 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Change Password</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Update your password to keep your account secure.</p>
        </div>
      </div>

      {/* Password requirements hint */}
      <div className="mb-5 p-3 bg-muted/40 border border-border text-xs text-muted-foreground leading-relaxed">
        <p className="font-medium text-foreground mb-1">Password requirements</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>At least 8 characters long</li>
          <li>At least 1 uppercase letter</li>
          <li>At least 1 special character (!@#$%^&*)</li>
          <li>At least 1 number</li>
        </ul>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FieldGroup className="gap-4">
          <PasswordField
            form={form}
            name="oldPassword"
            label="Current Password"
            placeholder="Enter your current password"
          />
          <PasswordField form={form} name="newPassword" label="New Password" placeholder="Enter your new password" />
          <PasswordField
            form={form}
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="Confirm your new password"
          />
        </FieldGroup>

        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "Changing..." : "Change Password"}
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;
