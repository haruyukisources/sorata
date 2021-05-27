import { model } from 'mongoose';
import { IPostDocument } from '../types/post.types';
import PostSchema from '../schema/post.schema';

export const PostModel = model<IPostDocument>('Post', PostSchema);
