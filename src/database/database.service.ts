import { Injectable, Logger } from '@nestjs/common';
import { Marked } from '@ts-stack/markdown';
import * as matter from 'gray-matter';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from 'src/config/config.service';
import { Repository } from 'typeorm';
import { Post } from './database.schema';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  // fake db
  private posts: Post[] = [];
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private config: ConfigService,
  ) {}
  public async initDatabase() {
    const scandir = this.config.config.scandir;

    function readFileList(dir, filesList = []): string[] {
      const files = fs.readdirSync(dir);
      files.forEach((item) => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          readFileList(path.join(dir, item), filesList);
        } else {
          filesList.push(fullPath);
        }
      });
      return filesList;
    }

    const fileList = readFileList(scandir);
    for (const file of fileList) {
      const stat = await fs.promises.lstat(file);
      if (!stat.isFile() || !file.endsWith('.md')) {
        continue;
      }
      const fm = matter(fs.readFileSync(file, 'utf8'));
      const p = {
        body: Marked.parse(fm.content),
      } as Post;

      const attributes = fm.data;
      if (!attributes.author) {
        p.author = 'lxz';
      }

      p['header-img'] = attributes['header-img'];
      p.category = attributes['category'];
      p.date = attributes['date'];
      p.tags = attributes['tags'];

      await this.addPost(p);
    }
  }

  public async updatePost(post: Post): Promise<Post> {
    const queryPost = await this.postRepository.findOne({
      where: {
        local_path: post.local_path,
      },
    });
    if (!queryPost) {
      return await this.postRepository.save(post);
    } else {
      const p = { ...post };
      p.id = queryPost.id;
      return await this.postRepository.save(p);
    }
  }

  public async addPost(post: Post): Promise<Post | Error> {
    // TODO: fake db
    this.posts.push(post);
    return post;

    if (!this.postRepository) {
      const error = new Error('post database not connected!');
      return error;
    }

    const date = new Date(post.date);
    const year = `${date.getFullYear()}`;
    const month = `${String(('0' + (date.getMonth() + 1)).slice(-2))}`;
    const day = `${String(('0' + date.getDate()).slice(-2))}`;
    const title = String(post.title).replace(/\s/g, '');

    const queryPost = await this.postRepository.findOne({
      where: {
        local_path: post.local_path,
      },
    });

    if (!queryPost) {
      await this.postRepository.save(post);
    } else {
      const p = { ...post };
      p.id = queryPost.id;
      await this.postRepository.save(p);
    }

    // 还需要更新 post 中的 attributes 指向。

    return post;
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
    return null;
  }

  async getPost(
    year: string,
    month: string,
    day: string,
    title: string,
    overview: boolean,
  ): Promise<Post | null> {
    this.logger.log(`/${year}/${month}/${day}/${title} overview: ${overview}`);
    const post: Post | null = await this.get(year, month, day, title);

    if (post && overview) {
      const p = post.body.split('\n');
      for (const line of p) {
        const result = line.trim();
        if (result.startsWith('<p>')) {
          post.body = result.substr(
            '<p>'.length,
            result.length - '<p></p>'.length,
          );
          break;
        }
      }
    }

    return post;
  }
}
