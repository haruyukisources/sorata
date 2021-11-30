import * as shell from 'shelljs';
import * as fs from 'fs';
import * as YAML from 'js-yaml';
import { Logger } from '@nestjs/common';
import * as path from 'path';
import yargs from 'yargs';

export interface Settings {
  database: {
    filename: string;
    path: string;
  };
  scandir: string;
}

export class AppSetting {
  public readonly settings: Settings;
  private logger = new Logger('Main');
  constructor() {
    // nest start 不会传递自定义的参数，需要进行判断
    const argv = yargs(process.argv.slice(2))
      .options({
        config: { type: 'string', require: true },
      })
      .parseSync();

    if (argv.config.length == 0) {
      this.logger.error('Please specify config');
      shell.exit(2);
    }

    const configPath = path.join(process.cwd(), argv.config);

    if (!fs.existsSync(configPath)) {
      this.logger.error('Could not find config.yaml');
      shell.exit(3);
    }

    // check cosmiconfig
    const config = fs.readFileSync(configPath, 'utf8');
    const settings: Settings = YAML.load(config) as Settings;
    this.settings = settings;
  }
}
