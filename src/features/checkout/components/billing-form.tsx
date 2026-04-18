"use client";

import { UseFormReturn } from "react-hook-form";
import { CheckoutFormValues } from "../schema";
import { IShippingMethod } from "@/features/config/types";
import InputField from "@/components/form/site/input-field";
import TextareaField from "@/components/form/site/textarea-field";
import CheckboxField from "@/components/form/site/checkbox-field";
import Link from "next/link";

interface BillingFormProps {
  form: UseFormReturn<CheckoutFormValues>;
  shippingMethods: IShippingMethod[];
  isLoggedIn: boolean;
}

export default function BillingForm({
  form,
  shippingMethods,
  isLoggedIn,
}: BillingFormProps) {
  const {
    formState: { errors },
    watch,
    setValue,
  } = form;

  const selectedShipping = watch("shippingMethod");
  const selectedPayment = watch("paymentMethod");

  return (
    <div className="bg-card border border-border p-6 lg:p-8 flex flex-col gap-6 shadow-sm">
      {/* ── Billing Details ─────────────────── */}
      <h2 className="text-xl font-bold text-foreground tracking-tight">Billing Details</h2>

      <div className="grid gap-4 grid-cols-2 max-sm:grid-cols-1">
        {/* First / Last name */}
        <InputField form={form} name="firstName" label="First name" required />
        <InputField form={form} name="lastName" label="Last name" required />

        {/* Street address — full row */}
        <div className="col-span-2 max-sm:col-span-1">
          <InputField
            form={form}
            name="streetAddress"
            label="Street address"
            placeholder="House number and street name"
            required
          />
        </div>

        {/* City */}
        <InputField form={form} name="city" label="Town / City" required />

        {/* District */}
        <InputField form={form} name="district" label="District" required />

        {/* Postcode */}
        <InputField form={form} name="postcode" label="Postcode / ZIP" />

        {/* Phone */}
        <InputField form={form} name="phone" label="Phone" required />

        {/* Create account — only for guests */}
        {!isLoggedIn && (
          <div className="col-span-2 max-sm:col-span-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-sm text-foreground">
              <input
                type="checkbox"
                className="mt-0.5 size-4 shrink-0 accent-primary cursor-pointer"
              />
              Create an account?
            </label>
          </div>
        )}

        {/* Order notes — full row */}
        <div className="col-span-2 max-sm:col-span-1">
          <TextareaField
            form={form}
            name="orderNotes"
            label="Order notes"
            hint="(optional)"
            placeholder="Notes about your order, e.g. special notes for delivery."
            rows={4}
          />
        </div>
      </div>

      {/* ── Shipping Method ──────────────────── */}
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold text-foreground mb-1">Shipping Method</h3>
        {shippingMethods.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No shipping methods available.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {shippingMethods.map((method) => (
              <label
                key={method.name}
                className={`flex items-center gap-3 px-4 py-3 border cursor-pointer transition-colors duration-200 hover:bg-muted/40 select-none ${
                  selectedShipping === method.name
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <input
                  type="radio"
                  value={method.name}
                  className="sr-only"
                  checked={selectedShipping === method.name}
                  onChange={() =>
                    setValue("shippingMethod", method.name, {
                      shouldValidate: true,
                    })
                  }
                />
                {/* Custom radio dot */}
                <span
                  className={`size-4 rounded-full border-2 shrink-0 transition ${
                    selectedShipping === method.name
                      ? "border-primary [background:radial-gradient(circle,hsl(var(--primary-hsl,0_0%_14%))_40%,transparent_40%)] [box-shadow:inset_0_0_0_4px_hsl(0_0%_14%),inset_0_0_0_6px_white]"
                      : "border-muted-foreground bg-transparent"
                  }`}
                />
                <span className="text-sm font-medium flex-1">{method.name}</span>
                <span className="text-sm font-semibold text-primary">
                  ৳{method.cost.toLocaleString()}
                </span>
              </label>
            ))}
          </div>
        )}
        {errors.shippingMethod && (
          <p className="text-xs text-destructive font-medium mt-1">{errors.shippingMethod.message}</p>
        )}
      </div>

      {/* ── Payment Method ───────────────────── */}
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold text-foreground mb-1">Payment Method</h3>
        <div className="flex flex-col gap-2">
          {/* Cash on delivery */}
          <label
            className={`flex items-start gap-3 px-4 py-3.5 border cursor-pointer transition-colors duration-200 hover:bg-muted/40 select-none ${
              selectedPayment === "cod" ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <input
              type="radio"
              value="cod"
              className="sr-only"
              checked={selectedPayment === "cod"}
              onChange={() =>
                setValue("paymentMethod", "cod", { shouldValidate: true })
              }
            />
            <span
              className={`size-4 rounded-full border-2 shrink-0 mt-0.5 transition ${
                selectedPayment === "cod"
                  ? "border-primary [box-shadow:inset_0_0_0_3px_oklch(1_0_0),inset_0_0_0_6px_oklch(0.24_0.02_271.82)]"
                  : "border-muted-foreground"
              }`}
            />
            <div>
              <p className="font-medium text-sm">Cash on delivery</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pay with cash upon delivery.
              </p>
            </div>
          </label>

          {/* Online payment */}
          <label
            className={`flex items-start gap-3 px-4 py-3.5 border cursor-pointer transition-colors duration-200 hover:bg-muted/40 select-none ${
              selectedPayment === "online" ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <input
              type="radio"
              value="online"
              className="sr-only"
              checked={selectedPayment === "online"}
              onChange={() =>
                setValue("paymentMethod", "online", { shouldValidate: true })
              }
            />
            <span
              className={`size-4 rounded-full border-2 shrink-0 mt-0.5 transition ${
                selectedPayment === "online"
                  ? "border-primary [box-shadow:inset_0_0_0_3px_oklch(1_0_0),inset_0_0_0_6px_oklch(0.24_0.02_271.82)]"
                  : "border-muted-foreground"
              }`}
            />
            <div>
              <p className="font-medium text-sm">Pay Online</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Credit / Debit Card, Mobile Banking, Netbanking, bKash &amp;
                more.
              </p>
            </div>
          </label>
        </div>
        {errors.paymentMethod && (
          <p className="text-xs text-destructive font-medium mt-1">{errors.paymentMethod.message}</p>
        )}
      </div>

      {/* ── Terms ───────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <CheckboxField
          form={form}
          name="agreeToTerms"
          label={
            <>
              I have read and agree to the website{" "}
              <Link href="/terms" className="text-tartiary font-medium hover:underline transition">
                Terms and Conditions
              </Link>
              ,{" "}
              <Link href="/privacy-policy" className="text-tartiary font-medium hover:underline transition">
                Privacy Policy
              </Link>
              , and{" "}
              <Link href="/refund-policy" className="text-tartiary font-medium hover:underline transition">
                Refund Policy
              </Link>{" "}
              <span className="text-destructive">*</span>
            </>
          }
        />
      </div>
    </div>
  );
}
