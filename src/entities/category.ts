import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Base } from './base';
import { PostEntity } from './post';

@Entity({ name: 'categories' })
export class Category extends Base {
  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.childCategories)
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  childCategories: Category[];

  @OneToMany(() => PostEntity, (post) => post.categoryId)
  @JoinColumn({ name: 'posts_id' })
  posts: PostEntity[];

  constructor(partial: Partial<Category>) {
    super();
    Object.assign(this, partial);
  }
}
