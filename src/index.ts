import { PostModel } from './models/post.model';
import { IPost, IAttributes } from './types/post.types';
import * as Mongoose from 'mongoose';
import * as matter from 'gray-matter';
import * as fs from 'fs';

export async function main() {
  // test load all markdown info
  const uri = `mongodb://shanghai.tencent.justforlxz.com:27017/`;
  Mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: {
      user: 'root',
      password: 'fuckgfw',
    },
    dbName: 'mashiro',
  });

  const database = Mongoose.connection;
  database.once('open', async () => {
    console.log('Connected to database');
    const postArray: IPost[] = [];
    const posts = fs.readdirSync('/home/lxz/Develop/blog/source/_posts');
    for (const post of posts) {
      console.log(post);
      fs.stat;
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
      const p = {
        attributes: <IAttributes>fm.data,
        meta: {
          year,
          month,
          day,
          title: fm.data.title.replace(' ', ''),
        },
        body: fm.content,
      } as IPost;
      p.attributes.author = 'lxz';
      postArray.push(p);
    }

    PostModel.insertMany(postArray);
  });
  database.on('error', () => {
    console.log('Error connecting to database');
  });
}
