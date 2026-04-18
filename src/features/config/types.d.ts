import { ICategoryWithSubCategories } from "../categories/types";

export interface IHeaderConfigResponse {
  navLinks: Pick<ICategoryWithSubCategories, "_id" | "title" | "slug" | "subCategories">[];
}

export interface IHeroFixedItem {
  id: string;
  image: string;
  link: string;
}

export interface IHeroCarouselItem {
  id: string;
  image: string;
  button: string;
  buttonLink: string;
}

export interface IHeroConfigResponse {
  heroType: "fixed" | "carousel";
  fixedContent: IHeroFixedItem[];
  carouselContent: IHeroCarouselItem[];
}

export interface IShippingMethod {
  name: string;
  cost: number;
}

export interface IConfigResponse {
  _id: string;
  header: IHeaderConfigResponse;
  hero: IHeroConfigResponse;
  shippingMethods: IShippingMethod[];
}
