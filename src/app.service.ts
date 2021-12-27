import { Injectable, Logger } from '@nestjs/common';
import { Post } from './database/database.schema';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger('AppService');
  constructor(private db: DatabaseService) {
    this.logger.log(this.db);
    (async () => this.db.initDatabase())();
  }

  private async updatePost(post: Post): Promise<Post> {
    return this.db.updatePost(post);
  }

  public async addPost(post: Post): Promise<Post | Error> {
    return this.db.addPost(post);
  }

  public async getPostBySplit(
    index: number,
    maxAge: number,
  ): Promise<Post[] | null> {
    return await this.db.getPostBySplit(index, maxAge);
  }

  public async get(
    year: string,
    month: string,
    day: string,
    title: string,
  ): Promise<Post | null | undefined> {
    return await this.db.get(year, month, day, title);
  }

  async getPost(
    year: string,
    month: string,
    day: string,
    title: string,
    overview: boolean,
  ): Promise<Post | null> {
    this.logger.log(`/${year}/${month}/${day}/${title} overview: ${overview}`);
    return await this.db.getPost(year, month, day, title, overview);
  }
}
