import { Logger } from '@nestjs/common';
import { Post } from './entity/entity';
import { EntityService } from './entity/entity.service';

export class AppService {
  private readonly logger = new Logger('AppService');
  constructor(private entityService: EntityService) {}

  async getPost(
    year: string,
    month: string,
    day: string,
    title: string,
    overview: boolean,
  ): Promise<Post | null> {
    this.logger.log(`/${year}/${month}/${day}/${title} overview: ${overview}`);
    const post: Post | null = await this.entityService.get(
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

  async getPostBySplit(index: number, maxAge: number): Promise<Post[] | null> {
    return this.entityService.getPostBySplit(index, maxAge);
  }
}
