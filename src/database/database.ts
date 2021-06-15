import 'reflect-metadata';

import {
  Attributes,
  IAttributes,
  IPost,
  Meta,
  Post,
} from '../types/post.types';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class DataBase {
  constructor(
    private postRepository: Repository<Post>,
    private metaRepository: Repository<Meta>,
    private attributesRepository: Repository<Attributes>,
  ) {}
}
