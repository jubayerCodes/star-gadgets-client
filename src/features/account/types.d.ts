export interface IAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  district: string;
  country: string;
  zipCode?: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  isDeleted: boolean;
  phone: string;
  role: string;
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
