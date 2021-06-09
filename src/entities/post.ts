import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Base } from './base';
import { Category } from './category';
import { Tags } from './tag';
import { User } from './user';

@Entity({ name: 'posts' })
export class PostEntity extends Base {
  @Column({ name: 'title', length: 100, type: 'varchar' })
  title: string;

  @Column({ name: 'content', type: 'longtext' })
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => Category, (category) => category.posts)
  @JoinColumn({ name: 'category_id' })
  categoryId: Category;

  @ManyToMany(() => Tags)
  @JoinTable()
  tags: Tags[];

  @Column({ default: true })
  isPublished: boolean;

  constructor(partial: Partial<PostEntity>) {
    super();
    Object.assign(this, partial);
  }
}
