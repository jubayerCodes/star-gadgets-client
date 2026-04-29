export interface IAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  district: string;
  country: string;
  zipCode?: string;
}

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  isDeleted: boolean;
  phone: string;
  role: Role;
  billingAddress?: IAddress;
  shippingAddress?: IAddress;
  auths?: IAuthProvider[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IAuthProvider {
  provider: string;
  providerId: string;
}
