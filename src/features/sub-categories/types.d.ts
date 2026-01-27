export interface ISubCategory {
  _id?: string;
  title: string;
  slug: string;
  categoryId: string;
  image: string;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
