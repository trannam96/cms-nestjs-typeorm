import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, Unique } from 'typeorm';
import { Base } from './base';
import { Expose } from 'class-transformer';
import { compare, hash } from 'bcrypt';
import { Roles } from '../common/enum';
import { PostEntity } from './post';

@Entity({ name: 'users' })
export class User extends Base {
  @Unique(['email'])
  @Column()
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ nullable: true, name: 'avatar_url' })
  avatarUrl: string;

  @Expose()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.USER })
  role: Roles;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToMany(() => PostEntity, (post) => post.createdBy, { eager: false, cascade: true })
  @JoinColumn({ name: 'posts' })
  posts: PostEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await hash(this.password, 10);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
