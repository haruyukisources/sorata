import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import {
  postProviders,
  metaProviders,
  attributeProviders,
} from './entity.providers';
import { EntityService } from './entity.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...postProviders,
    ...metaProviders,
    ...attributeProviders,
    EntityService,
  ],
})
export class EntityModule {}
