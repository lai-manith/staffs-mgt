import { Category } from "./category";

export interface Product {
  _id?: string;
  title:string;
  description:string;
  price:number | string;
  avatar?: ArrayImage[];
  status: boolean;
  category?: Category;
  quantity?: number;
  createAt?: string;
  updateAt?: string;
}

export interface ArrayImage {
  _id?: string;
  image?: string;
  file?: File;
}
