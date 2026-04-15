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

export interface IProductBadge {
  title: string;
  value?: string;
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
  isFeatured?: boolean;
  productCode: string;
  keyFeatures: string;
  specifications: ISpecification[];
  isActive?: boolean;
  attributes: IProductAttribute[];
  badges?: IProductBadge[];
  variants: IVariant[];
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFeaturedProduct {
  _id: string;
  title: string;
  slug: string;
  badges?: IProductBadge[];
  category: { _id: string; title: string; slug: string };
  subCategory: { _id: string; title: string; slug: string };
  brand: { _id: string; title: string; slug: string };
  featuredVariant: {
    _id?: string;
    price?: number;
    regularPrice: number;
    stock: number;
    status: ProductStatus;
    sku: string;
    images: string[];
    featuredImage: string;
    featured?: boolean;
    isActive?: boolean;
    attributes?: { name: string; value: string }[];
  };
}

export interface IProductAdmin {
  _id: string;
  title: string;
  slug: string;
  featuredImage: string;
  productCode: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  priceRange: number | { min: number; max: number };
  stock: number;
  variants: IVariant[];
  subCategoryId: ISubCategory;
  categoryId: ICategory;
  brandId: IBrand;
}

export interface ISearchProduct {
  _id: string;
  title: string;
  slug: string;
  featuredImage: string;
  priceRange: number | { min: number; max: number };
  stock: number;
  badges?: IProductBadge[];
  subCategoryId: { _id: string; title: string; slug: string };
  brandId: { _id: string; title: string; slug: string };
  featuredVariant: {
    _id?: string;
    price?: number;
    regularPrice: number;
    stock: number;
    status: ProductStatus;
    sku: string;
    featuredImage: string;
    images: string[];
    featured?: boolean;
    isActive?: boolean;
    attributes?: { name: string; value: string }[];
  };
}

export interface ISearchBrand {
  _id: string;
  title: string;
  slug: string;
}

export interface ISearchResultData {
  products: ISearchProduct[];
  brands: ISearchBrand[];
}

export interface IPublicProductCategory {
  _id: string;
  title: string;
  slug: string;
}

export interface PublicProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: "inStock" | "outOfStock";
  brand?: string;
  category?: string;
  subCategory?: string;
  sortBy?: "newest" | "priceAsc" | "priceDesc" | "popularity";
}

export interface IPublicProductsData {
  products: ISearchProduct[];
  brands: ISearchBrand[];
  categories: IPublicProductCategory[];
}
