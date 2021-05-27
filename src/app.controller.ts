import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { IPost } from './types/post.types';

@Controller('blog')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:year/:month/:day/:title')
  async getPost(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('day') day: string,
    @Param('title') title: string,
  ): Promise<IPost | null> {
    return this.appService.getPost(year, month, day, title);
  }

  @Get('/page/:page')
  async page(@Param('page') page: string): Promise<IPost[] | null> {
    return this.appService.getPostBySplit(+page, 5);
  }
}
