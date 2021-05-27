import { Document, Model } from 'mongoose';

export interface IAttributes {
  title: string;
  date: Date;
  author: string;
  subtitle?: string;
  'header-img'?: string;
  tags?: string | string[];
  category?: string | string[];
}

export interface IMeta {
  year: string;
  month: string;
  day: string;
  title: string;
}

export interface IPost {
  attributes: IAttributes;
  body: string;
}

export interface IPostDocument extends Document, IPost {}
export type IPostModel = Model<IPostDocument>;
