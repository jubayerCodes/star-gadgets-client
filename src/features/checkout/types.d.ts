export type PaymentMethod = "cod" | "online";

export interface ICheckoutFormValues {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  district: string;
  postcode?: string;
  phone: string;
  email: string;
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

export interface ICreateOrderPayload {
  billingDetails: {
    firstName: string;
    lastName: string;
    email: string;
    streetAddress: string;
    city: string;
    district: string;
    postcode?: string;
    phone: string;
  };
  items: {
    productId: string;
    variantId: string;
    quantity: number;
    price: number;
  }[];
  shippingMethod: string;
  paymentMethod: "cod" | "online";
  coupon?: { couponId: string; code: string } | null;
  orderNotes?: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface IOrderItem {
  productId: string;
  variantId: string;
  title: string;
  image: string;
  attributes?: { name: string; value: string }[];
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  userId?: string;
  billingDetails: ICreateOrderPayload["billingDetails"];
  items: IOrderItem[];
  subtotal: number;
  shippingMethod: string;
  shippingCost: number;
  coupon?: { couponId: string; code: string; discountAmount: number };
  discount: number;
  total: number;
  paymentMethod: "cod" | "online";
  paymentStatus: "UNPAID" | "PAID";
  orderStatus: OrderStatus;
  orderNotes?: string;
  createdAt: string;
  updatedAt: string;
}
