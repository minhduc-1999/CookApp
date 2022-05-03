import { AbstractEntity } from '../../base/entities/base.entity';
import { UserEntity } from './user.entity';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { PostEntity } from './post.entity';
import { Post } from '../../domains/social/post.domain';
import { User } from '../../domains/social/user.domain';
import { InteractionEntity } from './interaction.entity';

@Entity({ name: 'feeds' })
export class FeedEntity extends AbstractEntity {

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: UserEntity

  @ManyToOne(() => PostEntity, { nullable: false })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  constructor(user: User, post: Post) {
    super(null)
    this.user = new UserEntity(user)
    this.post = new PostEntity(post, new InteractionEntity(post))
  }

  toDomain(): Post {
    return this.post?.toDomain()
  }
}
