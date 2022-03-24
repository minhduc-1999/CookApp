import { AbstractEntity } from '../../base/entities/base.entity';
import { UserEntity } from './user.entity';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity({ name: 'feeds' })
export class FeedEntity extends AbstractEntity {

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "user_id" })
  user: UserEntity

  @ManyToOne(() => PostEntity)
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;
}
