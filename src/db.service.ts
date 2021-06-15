import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, Meta, Attributes } from './types/post.types';
import { IAttributes, IPost } from './types/post.types';
import * as matter from 'gray-matter';
import * as fs from 'fs';
import { Marked } from '@ts-stack/markdown';

@Injectable()
export class DbService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Meta)
    private metaRepository: Repository<Meta>,
    @InjectRepository(Attributes)
    private attributesRepository: Repository<Attributes>,
  ) {
    this.initDatabase();
  }

  async initDatabase() {
    const posts = fs.readdirSync('/home/lxz/Develop/blog/source/_posts');
    for (const post of posts) {
      const stat = await fs.promises.lstat(
        `/home/lxz/Develop/blog/source/_posts/${post}`,
      );
      if (!stat.isFile()) {
        continue;
      }
      const fm = matter(
        fs
          .readFileSync(`/home/lxz/Develop/blog/source/_posts/${post}`)
          .toString(),
      );

      const p = {
        body: Marked.parse(fm.content),
      } as IPost;

      const attributes = <IAttributes>fm.data;
      attributes.author = 'lxz';

      await this.addPost(attributes, p);
    }
  }

  public async addPost(
    attributes: IAttributes,
    post: IPost,
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
  ): Promise<IPost[] | null> {
    let post: IPost[] | null = null;
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
  ): Promise<IPost | null | undefined> {
    let post: IPost | null = null;
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
