import { Logger } from '@nestjs/common';

import { DbService } from './db.service';
import { IPost } from './types/post.types';

export class AppService {
  private readonly logger = new Logger('AppService');
  constructor(private db: DbService) {}

  async getPost(
    year: string,
    month: string,
    day: string,
    title: string,
    overview: boolean,
  ): Promise<IPost | null> {
    this.logger.log(`/${year}/${month}/${day}/${title} overview: ${overview}`);
    const post: IPost | null = await this.db.get(year, month, day, title);

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
    return this.db.getPostBySplit(index, maxAge);
  }
}
