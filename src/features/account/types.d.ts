export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  isDeleted: boolean;
  phone: string;
  role: Role;
  addresses?: IUserAddress[];
  auths?: IAuthProvider[];
  createdAt?: string;
  updatedAt?: string;
}
