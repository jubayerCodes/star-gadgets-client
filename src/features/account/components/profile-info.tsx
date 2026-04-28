"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, UpdateProfileFormValues } from "@/features/account/schema";
import { useCurrentUser, useUpdateProfile } from "@/features/account/hooks/useAccount";
import { FieldGroup } from "@/components/ui/field";
import InputField from "@/components/form/site/input-field";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Mail, Calendar, ShieldCheck } from "lucide-react";

const ProfileInfo = () => {
  const { data, isLoading } = useCurrentUser();
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const user = data?.data;

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        phone: user.phone,
      });
    }
  }, [user, form]);

  const handleSubmit = async (values: UpdateProfileFormValues) => {
    await updateProfile(values);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Account meta info */}
      <div className="border border-border bg-card p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="font-semibold text-lg text-foreground">{user?.name}</p>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="size-3.5" />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide bg-primary/10 text-primary px-2 py-0.5">
              <ShieldCheck className="size-3" />
              {user?.role}
            </span>
            {user?.createdAt && (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Calendar className="size-3" />
                Joined {new Date(user.createdAt).toLocaleDateString("en-BD", { month: "long", year: "numeric" })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="border border-border bg-card p-5 sm:p-6">
        <h2 className="text-base font-semibold mb-5 pb-4 border-b border-border">Edit Profile</h2>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <FieldGroup className="gap-4">
            <InputField form={form} name="name" label="Full Name" placeholder="Enter your full name" required />
            <InputField form={form} name="phone" label="Phone Number" placeholder="e.g. 01XXXXXXXXX" required />
          </FieldGroup>

          {/* Read-only email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-normal text-muted-foreground">Email Address</label>
            <div className="h-10 px-3 border-2 border-input bg-muted/40 text-sm flex items-center text-muted-foreground">
              {user?.email}
            </div>
            <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;
