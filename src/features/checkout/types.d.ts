export type PaymentMethod = "cod" | "online";

export type PaymentStatus = "UNPAID" | "PAID" | "FAILED" | "CANCELLED";

export interface ICheckoutFormValues {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  district: string;
  postcode?: string;
  phone: string;
  email: string;
  shipToDifferentAddress?: boolean;
  shipping_firstName?: string;
  shipping_lastName?: string;
  shipping_streetAddress?: string;
  shipping_city?: string;
  shipping_district?: string;
  shipping_postcode?: string;
  shipping_phone?: string;
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
  /** Only included when "Ship To A Different Address" is checked */
  shippingDetails?: {
    firstName: string;
    lastName: string;
    email?: string;
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
  /** Sent at order time to initialise the linked Payment document */
  paymentMethod: PaymentMethod;
  coupon?: { couponId: string; code: string } | null;
  orderNotes?: string;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "FAILED";

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

export interface IPayment {
  _id: string;
  orderId: string;
  amount: number;
  /** Amount paid so far (supports partial / advance payments) */
  totalPaid: number;
  /** Remaining balance due (amount - totalPaid) */
  dueAmount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paymentGatewayData?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  userId?: string;
  billingDetails: ICreateOrderPayload["billingDetails"];
  /** Only present when customer ships to a different address */
  shippingDetails?: ICreateOrderPayload["shippingDetails"];
  items: IOrderItem[];
  subtotal: number;
  shippingMethod: string;
  shippingCost: number;
  coupon?: { couponId: string; code: string; discountAmount: number };
  discount: number;
  total: number;
  orderStatus: OrderStatus;
  orderNotes?: string;
  paymentId?: IPayment;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderResponse {
  paymentUrl?: string;
  orderPayload: IOrder;
}
