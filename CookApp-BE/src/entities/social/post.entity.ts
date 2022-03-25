import { UserEntity } from './user.entity';
import { OneToMany, OneToOne, ManyToOne, Column, Entity, JoinColumn } from 'typeorm';
import { InteractionEntity } from './interaction.entity';
import { MediaType, PostType } from '../../enums/social.enum';
import { Moment, Post } from '../../domains/social/post.domain';
import { Image, Media, Video } from '../../domains/social/media.domain';
import { Audit } from '../../domains/audit.domain';

@Entity({ name: 'posts' })
export class PostEntity {

  @OneToOne(() => InteractionEntity, { primary: true })
  @JoinColumn({ name: "id", referencedColumnName: "id" })
  interaction: InteractionEntity

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "author_id" })
  author: UserEntity;

  @Column({ name: 'location' })
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

  constructor(post: Post, interaction: InteractionEntity) {
    this.interaction = interaction
    this.author = new UserEntity(post?.author)
    this.content = post?.content
    this.kind = post?.type
    const images = post?.images.map(image => new PostMediaEntity(image))
    const videos = post?.videos.map(video => new PostMediaEntity(video))
    this.medias = images?.concat(videos)
    this.location = post?.location
  }

  toDomain(): Post {
    const audit = new Audit(this.interaction)
    switch (this.kind) {
      case PostType.MOMENT:
        return new Moment({
          ...audit,
          content: this.content,
          images: this.medias?.filter(media => media.type === MediaType.IMAGE).map(image => image.toDomain()),
          videos: this.medias?.filter(media => media.type === MediaType.VIDEO).map(video => video.toDomain()),
          author: this.author.toDomain(),
          location: this.location
        })
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

  constructor(media: Media) {
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
