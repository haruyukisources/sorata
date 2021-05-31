import * as Mongoose from 'mongoose';
import { PostModel } from '../models/post.model';
import { IPost, IPostDocument } from '../types/post.types';

function dataBaseUrl(): string {
  if (process.env.production) {
    return 'shanghai.tencent.justforlxz.com';
  }

  return '127.0.0.1';
}

export class DataBase {
  private database!: Mongoose.Connection;

  public async connect(): Promise<void> {
    const uri = `mongodb://${dataBaseUrl()}:27017/`;
    console.log(uri);
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

  public async close() {
    await this.database.close();
  }

  public async getPostBySplit(
    index: number,
    maxAge: number,
  ): Promise<IPost[] | null> {
    let post: IPost[] | null = null;
    try {
      post = await PostModel.find({}, { _id: 0, attributes: 0, body: 0 })
        .limit(maxAge)
        .skip(index);
    } catch (err) {
      console.error(err);
      return null;
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
      post = await PostModel.findOne(
        {
          meta: {
            year,
            month,
            day,
            title,
            link: `/${year}/${month}/${day}/${title}`,
          },
        },
        { _id: 0 },
      );
    } catch (e) {
      console.log(e);
      return null;
    }

    return post;
  }
}
