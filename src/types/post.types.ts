import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export interface IAttributes {
  title: string;
  date: Date;
  author: string;
  subtitle?: string;
  'header-img'?: string;
  tags?: string | string[];
  category?: string | string[];
}

export interface IMeta {
  year: string;
  month: string;
  day: string;
  title: string;
  link: string;
}

export interface IPost {
  body: string;
}

@Entity('Attributes')
export class Attributes implements IAttributes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  date: Date;

  author: string;

  @Column()
  subtitle?: string;

  @Column({ type: 'varchar' })
  'header-img': string;

  @Column({ type: 'varchar' })
  tags?: string | string[];

  @Column({ type: 'varchar' })
  category?: string | string[];
}

@Entity('Post')
export class Post implements IPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attributes: number;

  @Column('text')
  body: string;
}

@Entity('Meta')
export class Meta implements IMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  post: number;

  @Column()
  year: string;

  @Column()
  month: string;

  @Column()
  day: string;

  @Column()
  title: string;

  @Column()
  link: string;
}
