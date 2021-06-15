import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbModule } from './db.module';
import { Attributes, Meta, Post } from './types/post.types';

@Module({
  imports: [
    DbModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: `${process.cwd()}/dist/mashiro.db`,
      entities: [Post, Attributes, Meta],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
