import { AbstractEntity } from '../../base/entities/base.entity';
import { UserEntity } from './user.entity';
import { OneToMany, Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { InteractionEntity } from './interaction.entity';
import { MediaType } from '../../enums/social.enum';
import { Comment } from '../../domains/social/comment.domain';
import { Audit } from '../../domains/audit.domain';
import { Image, Media, Video } from '../../domains/social/media.domain';

@Entity({ name: 'comments' })
export class CommentEntity extends AbstractEntity {

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "user_id" })
  user: UserEntity

  @ManyToOne(() => InteractionEntity)
  @JoinColumn({ name: 'target_id' })
  target: InteractionEntity;

  @Column({ name: 'content' })
  content: string;

  @ManyToOne(() => CommentEntity, (comment) => comment.children, { nullable: true })
  @JoinColumn({ name: "parent_id" })
  parent: CommentEntity

  @OneToMany(() => CommentEntity, (comment) => comment.parent)
  children: CommentEntity[]

  @OneToMany(() => CommentMediaEntity, media => media.comment)
  medias: CommentMediaEntity[]

  constructor(comment: Comment) {
    super(comment)
    this.user = new UserEntity(comment?.user)
    this.target = new InteractionEntity(comment?.target)
    this.content = comment?.content
    this.medias = comment?.medias?.map(media => new CommentMediaEntity(media))
  }

  toDomain(): Comment {
    const audit = new Audit(this)
    return new Comment({
      ...audit,
      user: this.user?.toDomain(),
      content: this.content,
      medias: this.medias?.map(media => media.toDomain()),
      parent: this.parent?.toDomain(),
      replies: this.children?.map(reply => reply.toDomain())
    })
  }
}

@Entity({ name: 'comment_medias' })
export class CommentMediaEntity extends AbstractEntity {

  @ManyToOne(() => CommentEntity)
  @JoinColumn({ name: "comment_id" })
  comment: CommentEntity;

  @Column({
    name: 'type',
    type: "enum",
    enum: MediaType
  })
  type: MediaType;

  @Column({ name: 'key' })
  key: string

  constructor(media: Media) {
    super(media)
    this.key = media?.key
    this.type = media?.type
  }

  toDomain(): Media {
    switch (this.type) {
      case MediaType.IMAGE:
        return new Image({
          key: this.key
        })
      case MediaType.VIDEO:
        return new Video({
          key: this.key
        })
    }
  }
}
