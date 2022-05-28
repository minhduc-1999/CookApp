import { AbstractEntity } from '../../base/entities/base.entity';
import { UserEntity } from './user.entity';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { PostEntity } from './post.entity';
import { PostSave } from '../../domains/social/post.domain';
import { Audit } from '../../domains/audit.domain';
import { InteractionEntity } from './interaction.entity';

@Entity({ name: 'saved_posts' })
export class PostSaveEntity extends AbstractEntity {

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: UserEntity

  @ManyToOne(() => PostEntity, { nullable: false })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  constructor(item: PostSave) {
    super(item)
    this.user = item?.saver && new UserEntity(item?.saver)
    this.post = item?.post && new PostEntity(item?.post, new InteractionEntity(item?.post))
  }

  toDomain(): PostSave {
    const audit = new Audit(this)
    return new PostSave({
      ...audit,
      saver: this.user?.toDomain(),
      post: this.post?.toDomain()
    })
  }
}

