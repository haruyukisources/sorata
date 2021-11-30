import { Injectable, Inject, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post, Meta, Attributes } from './entity';
import * as matter from 'gray-matter';
import * as fs from 'fs';
import { Marked } from '@ts-stack/markdown';
import { AppSetting } from 'src/app.setting';
import * as path from 'path';

@Injectable()
export class EntityService {
  private appSetting: AppSetting;
  private readonly logger = new Logger('EntityService');
  constructor(
    @Inject('POST_REPOSITORY')
    private postRepository: Repository<Post>,
    @Inject('META_REPOSITORY')
    private metaRepository: Repository<Meta>,
    @Inject('ATTRIBUTE_REPOSITORY')
    private attributesRepository: Repository<Attributes>,
  ) {
    this.appSetting = new AppSetting();
    this.initDatabase();
    // TODO: 读取数据库，获取配置的仓库，初始化git
  }

  async initDatabase() {
    const scandir = this.appSetting.settings.scandir;
    const posts = fs.readdirSync(scandir);
    for (const post of posts) {
      const file = path.join(scandir, post);
      const stat = await fs.promises.lstat(file);
      if (!stat.isFile()) {
        continue;
      }
      this.logger.debug(file);
      const fm = matter(fs.readFileSync(file).toString());
      const p = {
        body: Marked.parse(fm.content),
      } as Post;

      const attributes = <Attributes>fm.data;
      attributes.author = 'lxz';

      await this.addPost(attributes, p);
    }
  }

  public async addPost(
    attributes: Attributes,
    post: Post,
  ): Promise<Post | Error> {
    if (!this.postRepository) {
      const error = new Error('post database not connected!');
      return error;
    }

    if (!this.metaRepository) {
      const error = new Error('meta database not connected!');
      return error;
    }

    if (!this.attributesRepository) {
      const error = new Error('attributes database not connected!');
      return error;
    }

    const attr = new Attributes();
    attr.title = attributes.title;
    attr.date = attributes.date;
    attr.author = attributes.author;
    attr.subtitle = attributes.subtitle;
    attr['header-img'] = attributes['header-img'];
    attr.tags = attributes.tags;
    attr.category = attributes.category;

    const attrResult = await this.attributesRepository.save(attr);

    const p = new Post();
    p.attributes = attrResult.id;
    p.body = post.body;
    const result = await this.postRepository.save(p);

    const date = new Date(attr.date);
    const year = `${date.getFullYear()}`;
    const month = `${String(('0' + (date.getMonth() + 1)).slice(-2))}`;
    const day = `${String(('0' + date.getDate()).slice(-2))}`;
    const title = String(attr.title).replace(/\s/g, '');

    const meta = new Meta();
    meta.post = result.id;
    meta.year = year;
    meta.month = month;
    meta.day = day;
    meta.title = title;

    await this.metaRepository.save(meta);

    return p;
  }

  public async getPostBySplit(
    index: number,
    maxAge: number,
  ): Promise<Post[] | null> {
    let post: Post[] | null = null;
    try {
      post = await this.postRepository
        .createQueryBuilder('post')
        .limit(maxAge)
        .skip(index)
        .getMany();
    } catch (err) {
      console.error(err);
      return null;
    }

    return post;
  }

  public async get(
    year: string,
    month: string,
    day: string,
    title: string,
  ): Promise<Post | null | undefined> {
    let post: Post | null = null;
    try {
      const meta = await this.metaRepository.findOne({
        year,
        month,
        day,
        title,
      });
      post = await this.postRepository.findOne(meta.post);
    } catch (e) {
      console.log(e);
      return null;
    }

    return post;
  }
}
