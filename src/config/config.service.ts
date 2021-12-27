import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import commander from 'src/commander';

export interface Config {
  database: Database;
  scandir: string;
}

export interface Database {
  path: string;
}

@Injectable()
export class ConfigService {
  private logger: Logger = new Logger(ConfigService.name);
  public readonly config: Config;
  constructor() {
    this.config = yaml.load(
      String(fs.readFileSync(commander.config, 'utf-8')),
    ) as Config;
  }
}
