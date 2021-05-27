import { Schema } from 'mongoose';
import { IAttributes, IMeta } from '../types/post.types';

const PostSchema: Schema = new Schema(
  {
    attributes: {
      type: {} as IAttributes,
      required: true,
    },
    meta: {
      type: {} as IMeta,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export default PostSchema;
