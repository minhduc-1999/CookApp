import { UserEntity } from './user.entity';
import { OneToMany, OneToOne, ManyToOne, Column, Entity, JoinColumn } from 'typeorm';
import { InteractionEntity } from './interaction.entity';
import { MediaType, PostType } from '../../enums/social.enum';
import { Image, CommentMedia, Video } from '../../domains/social/media.domain';
import { Audit } from '../../domains/audit.domain';
import { Album } from 'domains/social/album.domain';
import { AbstractEntity } from 'base/entities/base.entity';

@Entity({ name: 'posts' })
export class AlbumEntity extends AbstractEntity {

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "owner_id" })
  owner: UserEntity;

  @Column({ name: 'name' })
  name: string

  @OneToMany(() => AlbumMediaEntity, media => media.album)
  medias: AlbumMediaEntity[]

  @Column({
    type: "enum",
    enum: PostType,
    nullable: false,
    name: "kind"
  })
  kind: PostType

  constructor(post: Album ) {
    super(post)
    this.owner = new UserEntity(post?.owner)
  }

  toDomain(): Album {
    const audit = new Audit(this)
        return new Album({
          ...audit,
          name: this.name,
          medias: this.medias?.map(media => media.toDomain()),
          owner: this.owner?.toDomain(),
        })
    }

  update(data: Partial<Album>): Partial<AlbumEntity> {
    return {
      name: data.name ?? this.name,
    }
  }
}

@Entity({ name: 'album_medias' })
export class AlbumMediaEntity {

  @OneToOne(() => InteractionEntity, { primary: true })
  @JoinColumn({ name: "id", referencedColumnName: "id" })
  interaction: InteractionEntity

  @ManyToOne(() => AlbumEntity, album => album.medias)
  @JoinColumn({ name: "album_id" })
  album: AlbumEntity;

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
    switch (this.type) {
      case MediaType.IMAGE:
        return new Image({
          key: this.key,
          id: this.interaction && this.interaction.id
        })
      case MediaType.VIDEO:
        return new Video({
          key: this.key,
          id: this.interaction && this.interaction.id
        })
    }
  }
}
