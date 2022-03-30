import { UserEntity } from './user.entity';
import { OneToMany, OneToOne, ManyToOne, Column, Entity, JoinColumn } from 'typeorm';
import { InteractionEntity } from './interaction.entity';
import { MediaType, PostType } from '../../enums/social.enum';
import { Moment, Post } from '../../domains/social/post.domain';
import { Image, CommentMedia, Video } from '../../domains/social/media.domain';
import { Audit } from '../../domains/audit.domain';

@Entity({ name: 'posts' })
export class PostEntity {

  @OneToOne(() => InteractionEntity, it => it.post, { primary: true })
  @JoinColumn({ name: "id", referencedColumnName: "id" })
  interaction: InteractionEntity

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "author_id" })
  author: UserEntity;

  @Column({ name: 'location', nullable: true })
  location: string;

  @Column({ name: 'content' })
  content: string

  @OneToMany(() => PostMediaEntity, media => media.post)
  medias: PostMediaEntity[]

  @Column({
    type: "enum",
    enum: PostType,
    nullable: false,
    name: "kind"
  })
  kind: PostType

  constructor(post: Post, interaction?: InteractionEntity) {
    this.interaction = interaction ? interaction : new InteractionEntity(post)
    this.author = new UserEntity(post?.author)
    this.content = post?.content
    this.kind = post?.type
    this.location = post?.location
  }

  toDomain(): Post {
    const audit = new Audit(this.interaction)
    const { nReactions, nComments} = this.interaction
    switch (this.kind) {
      case PostType.MOMENT:
        return new Moment({
          ...audit,
          nComments,
          nReactions,
          content: this.content,
          medias: this.medias?.map(media => media.toDomain()),
          author: this.author.toDomain(),
          location: this.location
        })
    }
  }

  update(data: Partial<Post>): Partial<PostEntity> {
    return {
      content: data.content ?? this.content,
      location: data.location ?? this.location,
    }
  }
}

@Entity({ name: 'post_medias' })
export class PostMediaEntity {

  @OneToOne(() => InteractionEntity, { primary: true })
  @JoinColumn({ name: "id", referencedColumnName: "id" })
  interaction: InteractionEntity

  @ManyToOne(() => PostEntity, post => post.medias)
  @JoinColumn({ name: "post_id" })
  post: PostEntity;

  @Column({
    name: 'type',
    type: "enum",
    enum: MediaType,
    nullable: false
  })
  type: MediaType;

  @Column({ name: 'key', nullable: false })
  key: string

  constructor(media: CommentMedia, interaction?: InteractionEntity) {
    this.key = media?.key
    this.type = media?.type
    this.interaction = interaction ? interaction : new InteractionEntity(media)
  }

  toDomain(): CommentMedia {
    const { nReactions, nComments} = this.interaction
    switch (this.type) {
      case MediaType.IMAGE:
        return new Image({
          nReactions,
          nComments,
          key: this.key,
          id: this.interaction && this.interaction.id
        })
      case MediaType.VIDEO:
        return new Video({
          nReactions,
          nComments,
          key: this.key,
          id: this.interaction && this.interaction.id
        })
    }
  }
}
