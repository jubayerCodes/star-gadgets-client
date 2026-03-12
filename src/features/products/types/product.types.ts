import { IBrand } from "@/features/brands/types";
import { ICategory } from "@/features/categories/types";
import { ISubCategory } from "@/features/sub-categories/types";

export enum ProductStatus {
  PRE_ORDER = "Pre Order",
  COMING_SOON = "Coming Soon",
  IN_STOCK = "In Stock",
  OUT_OF_STOCK = "Out of Stock",
}

export interface IProductAttribute {
  name: string;
  values: string[];
}

export interface IVariant {
  _id?: string;
  attributes: {
    name: string;
    value: string;
  }[];
  price?: number;
  regularPrice: number;
  stock: number;
  status: ProductStatus;
  sku: string;
  images: string[];
  featuredImage: string;
  featured?: boolean;
  isActive?: boolean;
}

export interface ISpecification {
  heading: string;
  specifications: {
    name: string;
    value: string;
  }[];
}

export interface IProduct {
  _id?: string;
  title: string;
  slug: string;
  featuredImage: string;
  subCategoryId: ISubCategory;
  brandId: IBrand;
  categoryId: ICategory;
  isDeleted?: boolean;
  productCode: string;
  keyFeatures: string;
  specifications: ISpecification[];
  isActive?: boolean;
  attributes: IProductAttribute[];
  variants: IVariant[];
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
