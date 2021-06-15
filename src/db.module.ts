import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbController } from './db.controller';
import { DbService } from './db.service';
import { Attributes, Meta, Post } from './types/post.types';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Meta, Attributes])],
  controllers: [DbController],
  providers: [DbService],
})
export class DbModule {}
