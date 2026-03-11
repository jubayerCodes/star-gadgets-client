export interface IUploadImage {
  _id: string;
  url: string;
  secureUrl: string;
  publicId: string;
  format?: string;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
}
