<p align="center">
  <a href="https://blog.justforlxz.com/" target="blank"><img src=".github/img/sorata.jpg" width="320" alt="Nest Logo" /></a>
</p>

## Description

sorata 是 mashiro 博客系统的后端服务器，提供博客所需的各种数据。

## Installation

```bash
$ npm install
```

## Running the app

```bash
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
