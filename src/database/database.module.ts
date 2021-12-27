import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'src/config/config.module';
import { Post } from './database.schema';
import { DatabaseService } from './database.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Post])],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
