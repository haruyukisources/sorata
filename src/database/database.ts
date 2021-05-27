import * as Mongoose from 'mongoose';
import { PostModel } from '../models/post.model';
import { IPost, IPostDocument } from '../types/post.types';

export class DataBase {
  private database!: Mongoose.Connection;

  public async connect(): Promise<void> {
    const uri = `mongodb://127.0.0.1:27017/`;
    await Mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      auth: {
        user: 'root',
        password: 'fuckgfw',
      },
      dbName: 'mashiro',
    });

    if (!this.database) {
      this.database = Mongoose.connection;
    }
  }

  public close() {
    this.database.close();
  }

  public async getPostBySplit(
    index: number,
    maxAge: number,
  ): Promise<IPost[] | null> {
    let post: IPost[] | null = null;
    try {
      await this.connect();
      post = await PostModel.find({}).limit(maxAge).skip(index);
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      this.close();
    }

    return post;
  }

  public async get(
    year: string,
    month: string,
    day: string,
    title: string,
  ): Promise<IPostDocument | null | undefined> {
    let post: IPostDocument | null = null;
    try {
      await this.connect();
      post = await PostModel.findOne(
        { meta: { year, month, day, title } },
        { attributes: 1, body: 1, _id: 0 },
      );
    } catch (e) {
      return e;
    } finally {
      this.close();
    }

    return post;
  }
}
