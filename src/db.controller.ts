import { Controller } from '@nestjs/common';
import { DbService } from './db.service';

@Controller('Db')
export class DbController {
  constructor(private readonly dbService: DbService) {}
}
