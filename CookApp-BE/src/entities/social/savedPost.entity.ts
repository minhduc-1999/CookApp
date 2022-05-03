import { AbstractEntity } from '../../base/entities/base.entity';
import { UserEntity } from './user.entity';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { PostEntity } from './post.entity';
import { SavedPost } from '../../domains/social/post.domain';
import { Audit } from '../../domains/audit.domain';
import { InteractionEntity } from './interaction.entity';

@Entity({ name: 'saved_posts' })
export class SavedPostEntity extends AbstractEntity {

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: UserEntity

  @ManyToOne(() => PostEntity, { nullable: false })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  constructor(item: SavedPost) {
    super(item)
    this.user = item?.saver && new UserEntity(item?.saver)
    this.post = item?.post && new PostEntity(item?.post, new InteractionEntity(item?.post))
  }

  toDomain(): SavedPost {
    const audit = new Audit(this)
    return new SavedPost({
      ...audit,
      saver: this.user?.toDomain(),
      post: this.post?.toDomain()
    })
  }
}

