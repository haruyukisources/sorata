<p align="center">
  <a href="https://blog.justforlxz.com/" target="blank"><img src=".github/img/sorata.jpg" width="320" alt="Nest Logo" /></a>
</p>

## Description

sorata 是 mashiro 博客系统的后端服务器，提供博客所需的各种数据。

## Design

### 订阅服务

基于 webhook 的更新，通知服务器拉取最新的 git 仓库。

### 目录结构设计

目录分为两种结构，第一种是规定目录，是 `_` 开头。第二种是普通命名，普通命名的目录将被认为是子目录，可以通过地址访问。

例如 `_posts` 是用于存放发布的文章，`_draft` 是用于存放草稿。

而 `/public/` 和 `/hello/`，则会被认为是路径的一部分。

不论是规定目录还是普通目录，都只按照 markdown 中定义的信息进行描述。

### 评论

评论数据可以存放在 git 的。

### 重建数据

当配置好git仓库后，会刷新所有数据，进行自动重建数据库。

## Installation

```bash
$ npm install
```

## Running the app

```bash··
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Todo

- [ ] 刷新文章仓库
- [ ] 留言
- [ ] 访问情况分析

下一步需要拆分数据库，sorata 只提供博客的 api 访问，访问情况分析、刷新文章仓库等应该拆分到其他项目。
