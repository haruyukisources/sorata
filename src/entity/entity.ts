import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Post')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attributes: number;

  @Column('text')
  body: string;
}

@Entity('Meta')
export class Meta {
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

@Entity('Attributes')
export class Attributes {
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
