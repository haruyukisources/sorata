import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Post } from './entity/entity';

@Controller('blog')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:year/:month/:day/:title')
  async getPost(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('day') day: string,
    @Param('title') title: string,
    @Query('overview') overview: string | undefined,
  ): Promise<Post | null> {
    const overviewFLag = overview !== undefined ? overview === 'true' : false;
    return this.appService.getPost(year, month, day, title, overviewFLag);
  }

  @Get('/page/:page')
  async page(@Param('page') page: string | undefined): Promise<Post[] | null> {
    return this.appService.getPostBySplit(page ? +page : 1, 5);
  }

  @Get('ping')
  ping(): string {
    return 'pong';
  }
}
