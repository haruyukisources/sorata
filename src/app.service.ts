import { Logger, Injectable } from '@nestjs/common';

import { DataBase } from './database/database';
import { IPost } from './types/post.types';

@Injectable()
export class AppService {
  private _database: DataBase;
  private readonly logger = new Logger('AppService');
  constructor() {
    this._database = new DataBase();
    this._database.connect();
  }
  async getPost(
    year: string,
    month: string,
    day: string,
    title: string,
    overview: boolean,
  ): Promise<IPost | null> {
    this.logger.log(`/${year}/${month}/${day}/${title} overview: ${overview}`);
    const post: IPost | null = await this._database.get(
      year,
      month,
      day,
      title,
    );

    if (post && overview) {
      const p = post.body.split('\n');
      for (const line of p) {
        const result = line.trim();
        if (result.startsWith('<p>')) {
          post.body = result.substr(
            '<p>'.length,
            result.length - '<p></p>'.length,
          );
          break;
        }
      }
    }

    return post;
  }

  async getPostBySplit(index: number, maxAge: number): Promise<IPost[] | null> {
    return this._database.getPostBySplit(index, maxAge);
  }
}
