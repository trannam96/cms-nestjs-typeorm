import { Column, Entity } from 'typeorm';
import { Base } from './base';

@Entity({ name: 'tags' })
export class Tags extends Base {
  @Column()
  name: string;

  @Column({ nullable: true })
  color: string;

  constructor(partial: Partial<Tags>) {
    super();
    Object.assign(this, partial);
  }
}
