"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, AddressFormValues } from "@/features/account/schema";
import { useCurrentUser, useUpdateProfile } from "@/features/account/hooks/useAccount";
import { UpdateProfilePayload } from "@/features/account/api";
import { FieldGroup } from "@/components/ui/field";
import InputField from "@/components/form/site/input-field";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { MapPin } from "lucide-react";
import { IAddress } from "@/features/account/types";

interface AddressFormProps {
  type: "billingAddress" | "shippingAddress";
  title: string;
  description: string;
}

const AddressForm = ({ type, title, description }: AddressFormProps) => {
  const { data, isLoading } = useCurrentUser();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const user = data?.data;
  const existingAddress: IAddress | undefined = user?.[type];

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      addressLine: "",
      city: "",
      district: "",
      country: "Bangladesh",
      zipCode: "",
    },
  });

  useEffect(() => {
    if (existingAddress) {
      form.reset({
        fullName: existingAddress.fullName ?? "",
        phone: existingAddress.phone ?? "",
        addressLine: existingAddress.addressLine ?? "",
        city: existingAddress.city ?? "",
        district: existingAddress.district ?? "",
        country: existingAddress.country ?? "Bangladesh",
        zipCode: existingAddress.zipCode ?? "",
      });
    }
  }, [existingAddress, form]);

  const handleSubmit = async (values: AddressFormValues) => {
    const payload: UpdateProfilePayload = { [type]: values };
    await updateProfile(payload);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="border border-border bg-card p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start gap-3 mb-5 pb-4 border-b border-border">
        <div className="size-9 rounded-none bg-primary/10 flex items-center justify-center shrink-0">
          <MapPin className="size-4 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>

      {existingAddress && (
        <div className="mb-5 p-3 bg-muted/40 border border-border text-sm text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground mb-1">Current Address</p>
          <p>
            {existingAddress.fullName} · {existingAddress.phone}
          </p>
          <p>{existingAddress.addressLine}</p>
          <p>
            {existingAddress.city}, {existingAddress.district}, {existingAddress.country}
            {existingAddress.zipCode ? ` - ${existingAddress.zipCode}` : ""}
          </p>
        </div>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FieldGroup className="gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField form={form} name="fullName" label="Full Name" placeholder="Recipient's full name" required />
            <InputField form={form} name="phone" label="Phone Number" placeholder="01XXXXXXXXX" required />
          </div>
          <InputField form={form} name="addressLine" label="Address Line" placeholder="House, road, area..." required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField form={form} name="city" label="City" placeholder="e.g. Dhaka" required />
            <InputField form={form} name="district" label="District" placeholder="e.g. Dhaka" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField form={form} name="country" label="Country" placeholder="e.g. Bangladesh" required />
            <InputField form={form} name="zipCode" label="ZIP / Postal Code" placeholder="e.g. 1340" />
          </div>
        </FieldGroup>

        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "Saving..." : existingAddress ? "Update Address" : "Save Address"}
        </Button>
      </form>
    </div>
  );
};

export default AddressForm;
