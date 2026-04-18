export type PaymentMethod = "cod" | "online";

export interface ICheckoutFormValues {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  district: string;
  postcode?: string;
  phone: string;
  orderNotes?: string;
  shippingMethod: string;
  paymentMethod: PaymentMethod;
  agreeToTerms: boolean;
}

export interface IValidateCouponPayload {
  code: string;
  subtotal: number;
}

export interface IValidateCouponResponse {
  couponId: string;
  code: string;
  discountAmount: number;
}

export interface IAppliedCoupon {
  couponId: string;
  code: string;
  discountAmount: number;
}
