"use client";

import { useState } from "react";
import { Tag, X, Loader2, CheckCircle2, ChevronDown } from "lucide-react";
import { useValidateCoupon } from "../hooks";
import { IAppliedCoupon } from "../types";
import { Button } from "@/components/ui/button";

interface CouponSectionProps {
  subtotal: number;
  appliedCoupon: IAppliedCoupon | null;
  onCouponApplied: (coupon: IAppliedCoupon) => void;
  onCouponRemoved: () => void;
}

export default function CouponSection({
  subtotal,
  appliedCoupon,
  onCouponApplied,
  onCouponRemoved,
}: CouponSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [code, setCode] = useState("");

  const { mutateAsync: validateCoupon, isPending } = useValidateCoupon();

  const handleApply = async () => {
    if (!code.trim()) return;
    const res = await validateCoupon({ code: code.trim().toUpperCase(), subtotal });
    if (res.data) {
      onCouponApplied(res.data);
      setIsExpanded(false);
    }
  };

  const handleRemove = () => {
    setCode("");
    onCouponRemoved();
  };

  return (
    <div className="border border-border overflow-hidden">
      {appliedCoupon ? (
        <div className="flex items-center gap-2 px-5 py-4 bg-green-50 border-green-200">
          <CheckCircle2 className="size-4 text-green-600 shrink-0" />
          <span className="text-sm font-medium text-green-700">
            Coupon <span className="font-bold">{appliedCoupon.code}</span> applied — you save ৳
            {appliedCoupon.discountAmount.toLocaleString()}
          </span>
          <Button
            onClick={handleRemove}
            aria-label="Remove coupon"
            size="icon-sm"
            variant="ghost"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <>
          <button
            onClick={() => setIsExpanded((p) => !p)}
            className="flex items-center gap-2 w-full px-5 py-4 text-sm bg-card text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            aria-expanded={isExpanded}
          >
            <Tag className="size-4 text-tartiary" />
            <span>
              Have a coupon?{" "}
              <span className="text-tartiary font-semibold hover:underline">
                Click here to enter your code
              </span>
            </span>
            <ChevronDown
              className={`size-4 text-muted-foreground ml-auto transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-32" : "max-h-0"}`}
          >
            <div className="flex items-center gap-3 px-5 pb-4 pt-1">
              <input
                id="coupon-code-input"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                placeholder="Coupon code"
                className="flex-1 h-11 border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                disabled={isPending}
                autoComplete="off"
              />
              <Button
                id="apply-coupon-btn"
                onClick={handleApply}
                disabled={isPending || !code.trim()}
                size="default"
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Apply Coupon"
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
