import { createConnection } from 'typeorm';
import { AppSetting } from '../app.setting';
import { Attributes, Meta, Post } from '../entity/entity';

const settings = new AppSetting();

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () =>
      await createConnection({
        type: 'sqlite',
        name: settings.settings.database.filename,
        database: `${settings.settings.database.path}${settings.settings.database.filename}`,
        entities: [Post, Meta, Attributes],
        synchronize: true,
      }),
  },
];
