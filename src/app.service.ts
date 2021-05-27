import { Injectable } from '@nestjs/common';

import { DataBase } from './database/database';
import { IPost } from './types/post.types';

@Injectable()
export class AppService {
  private _database: DataBase;
  constructor() {
    this._database = new DataBase();
  }
  async getPost(
    year: string,
    month: string,
    day: string,
    title: string,
  ): Promise<IPost | null> {
    return this._database.get(year, month, day, title);
  }

  async getPostBySplit(index: number, maxAge: number): Promise<IPost[] | null> {
    return this._database.getPostBySplit(index, maxAge);
  }
}
