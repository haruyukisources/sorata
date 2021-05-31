import { PostModel } from './models/post.model';
import { IPost, IAttributes } from './types/post.types';
import * as Mongoose from 'mongoose';
import * as matter from 'gray-matter';
import * as fs from 'fs';
import { Marked } from '@ts-stack/markdown';

export async function main() {
  // test load all markdown info
  const uri = `mongodb://shanghai.tencent.justforlxz.com:27017/`;
  const database = Mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: {
      user: 'root',
      password: 'fuckgfw',
    },
    dbName: 'mashiro',
  });

  database.on('connected', async () => {
    console.log('Connected to database', database);
    const postArray: IPost[] = [];
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
      const date = new Date(fm.data.date);
      const year = `${date.getFullYear()}`;
      const month = `${String(('0' + (date.getMonth() + 1)).slice(-2))}`;
      const day = `${String(('0' + date.getDate()).slice(-2))}`;
      const title = String(fm.data.title).replace(/\s/g, '');
      const p = {
        attributes: <IAttributes>fm.data,
        meta: {
          year,
          month,
          day,
          title,
          link: `/${year}/${month}/${day}/${title}`,
        },
        body: Marked.parse(fm.content),
      } as IPost;
      p.attributes.author = 'lxz';
      postArray.push(p);
    }
    await PostModel.insertMany(postArray);
    console.log(await PostModel.find({}));
    await database.close();
  });
  database.on('error', () => {
    console.log('Error connecting to database');
  });
}
