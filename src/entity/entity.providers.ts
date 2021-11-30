import { Connection } from 'typeorm';
import { Attributes, Meta, Post } from './entity';

export const postProviders = [
  {
    provide: 'POST_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Post),
    inject: ['DATABASE_CONNECTION'],
  },
];

export const attributeProviders = [
  {
    provide: 'ATTRIBUTE_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(Attributes),
    inject: ['DATABASE_CONNECTION'],
  },
];

export const metaProviders = [
  {
    provide: 'META_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Meta),
    inject: ['DATABASE_CONNECTION'],
  },
];
