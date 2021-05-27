import express from 'express';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { DataBase } from './database/database';
import { PostModel } from './models/post.model';
import { IPost, IAttributes } from './types/post.types';
import * as Mongoose from 'mongoose';
import { ObjectId } from 'mongoose';
import frontMatter from 'front-matter';
import * as fs from 'fs';

const database = new DataBase();

export function app(): express.Express {
  const server = express();
  server.get('/api/', async (req, res) => {
    const index = req.query['page'];
    const num = +(index ?? 1);
    res.json(await database.getPostBySplit(num, 10));
  });

  // server for blog api
  server.get('/api/:year/:month/:day/:title', async (req, res) => {
    const year: string = req.params['year'];
    const month: string = req.params['month'];
    const day: string = req.params['day'];
    const title: string = req.params['title'];

    res.json(await database.get(year, month, day, title));
  });

  server.get('/api/*', (req, res) => {
    res.redirect('/');
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4001;
  const server = app();
  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

async function main() {
  // test load all markdown info
  const uri = `mongodb://127.0.0.1:27017/`;
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
      const fm = frontMatter<IAttributes>(
        fs
          .readFileSync(`/home/lxz/Develop/blog/source/_posts/${post}`)
          .toString(),
      );
      const date = new Date(fm.attributes.date);
      const year = `${date.getFullYear()}`;
      const month = `${String(('0' + (date.getMonth() + 1)).slice(-2))}`;
      const day = `${String(('0' + date.getDate()).slice(-2))}`;
      const p = {
        attributes: fm.attributes,
        meta: {
          year,
          month,
          day,
          title: fm.attributes.title.replace(' ', ''),
        },
        body: fm.body,
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

//main().catch(console.error);

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}
