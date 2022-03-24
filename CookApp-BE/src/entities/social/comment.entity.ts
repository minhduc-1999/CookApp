import { AbstractEntity } from '../../base/entities/base.entity';
import { UserEntity } from './user.entity';
import { OneToMany, Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { InteractionEntity } from './interaction.entity';
import { MediaType } from '../../enums/social.enum';

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

  @ManyToOne(() => CommentEntity, (comment) => comment.children, { nullable: true})
  @JoinColumn({ name: "parent_id" })
  parent: CommentEntity

  @OneToMany(() => CommentEntity, (comment) => comment.parent)
  children: CommentEntity[]

  @OneToMany(() => CommentMediaEntity, media => media.comment)
  medias: CommentMediaEntity[]
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
}
