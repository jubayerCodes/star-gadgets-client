"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useConfigStore } from "@/store/configStore";
import { checkoutSchema, CheckoutFormValues } from "../schema";
import { IAppliedCoupon } from "../types";
import CouponSection from "./coupon-section";
import BillingForm from "./billing-form";
import OrderSummary from "./order-summary";
import SiteBreadcrumb from "@/components/shared/site-breadcrumb";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function CheckoutContent() {
  const { user } = useAuthStore();
  const { config } = useConfigStore();
  const items = useCartStore((s) => s.items);

  const shippingMethods = config?.shippingMethods ?? [];

  const [appliedCoupon, setAppliedCoupon] = useState<IAppliedCoupon | null>(
    null
  );

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: user?.name?.split(" ")[0] ?? "",
      lastName: user?.name?.split(" ").slice(1).join(" ") ?? "",
      streetAddress: "",
      city: "",
      district: "",
      postcode: "",
      phone: user?.phone ?? "",
      orderNotes: "",
      shippingMethod: shippingMethods[0]?.name ?? "",
      paymentMethod: "cod",
      agreeToTerms: undefined,
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = form;

  // Once config loads, set the default shipping method if none is selected.
  useEffect(() => {
    const methods = config?.shippingMethods ?? [];
    if (methods.length > 0 && !form.getValues("shippingMethod")) {
      setValue("shippingMethod", methods[0].name, { shouldValidate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const selectedShipping = watch("shippingMethod");

  const onSubmit = (values: CheckoutFormValues) => {
    const shippingCost =
      shippingMethods.find((m) => m.name === values.shippingMethod)?.cost ?? 0;
    const discount = appliedCoupon?.discountAmount ?? 0;

    const orderPayload = {
      billingDetails: {
        firstName: values.firstName,
        lastName: values.lastName,
        streetAddress: values.streetAddress,
        city: values.city,
        district: values.district,
        postcode: values.postcode,
        phone: values.phone,
      },
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
        price: i.price,
      })),
      shippingMethod: values.shippingMethod,
      shippingCost,
      paymentMethod: values.paymentMethod,
      coupon: appliedCoupon
        ? { couponId: appliedCoupon.couponId, code: appliedCoupon.code }
        : null,
      subtotal,
      discount,
      total: subtotal + shippingCost - discount,
      orderNotes: values.orderNotes,
    };

    // eslint-disable-next-line no-console
    console.log("Order payload:", orderPayload);
  };

  return (
    <div className="pb-16">
      {/* ── Breadcrumb Banner ─────────── */}
      <div className="bg-primary text-primary-foreground py-10 mb-8">
        <div className="container">
          <SiteBreadcrumb
            items={[{ label: "Checkout" }]}
            className="[&_ol]:text-primary-foreground/70 [&_a]:text-primary-foreground/70 [&_a]:hover:text-primary-foreground [&_li]:text-primary-foreground/70 [&_li]:hover:text-primary-foreground [&_li[aria-current=page]]:text-primary-foreground [&_li[aria-current=page]]:font-semibold"
          />
        </div>
      </div>

      <div className="container flex flex-col gap-6">
        {/* ── Coupon ───────────────────── */}
        <CouponSection
          subtotal={subtotal}
          appliedCoupon={appliedCoupon}
          onCouponApplied={setAppliedCoupon}
          onCouponRemoved={() => setAppliedCoupon(null)}
        />

        {/* ── Guest login prompt ────────── */}
        {!user && (
          <p className="text-sm text-muted-foreground">
            Returning customer?{" "}
            <Link href="/account/login" className="text-tartiary font-medium hover:underline transition">
              Click here to login
            </Link>
          </p>
        )}

        {/* ── Empty cart guard ─────────── */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingBag className="size-12 text-muted-foreground" />
            <p className="text-lg font-semibold mt-3">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add some items before checking out.
            </p>
            <Link href="/" className="text-tartiary font-medium hover:underline transition mt-4 inline-block">
              Continue Shopping
            </Link>
          </div>
        )}

        {/* ── Main form grid ───────────── */}
        {items.length > 0 && (
          <form
            id="checkout-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="grid gap-8 grid-cols-1 lg:grid-cols-[58fr_42fr] lg:items-start"
          >
            {/* Left: billing */}
            <BillingForm
              form={form}
              shippingMethods={shippingMethods}
              isLoggedIn={!!user}
            />

            {/* Right: order summary */}
            <OrderSummary
              items={items}
              shippingMethods={shippingMethods}
              selectedShipping={selectedShipping}
              appliedCoupon={appliedCoupon}
              isSubmitting={isSubmitting}
            />
          </form>
        )}
      </div>
    </div>
  );
}
