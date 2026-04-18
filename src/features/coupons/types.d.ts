export interface ICoupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountAmount: number;
  minOrderValue?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  hasPerUserLimit: boolean;
  perUserUsageLimit: number;
  createdAt?: string;
  updatedAt?: string;
}
