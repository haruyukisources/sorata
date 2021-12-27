import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title: string;

  @Column()
  date: Date;

  @Column()
  author: string;

  @Column({ type: 'text', nullable: true })
  subtitle?: string;

  @Column({ type: 'varchar', nullable: true })
  'header-img'?: string;

  @Column({ type: 'varchar', nullable: true })
  tags?: string | string[];

  @Column({ type: 'varchar', nullable: true })
  category?: string | string[];

  @Column('text')
  body: string;

  @Column('text')
  local_path: string;
}
