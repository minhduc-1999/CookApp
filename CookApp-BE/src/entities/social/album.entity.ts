import { UserEntity } from "./user.entity";
import {
  OneToMany,
  OneToOne,
  ManyToOne,
  Column,
  Entity,
  JoinColumn,
} from "typeorm";
import { InteractionEntity } from "./interaction.entity";
import { MediaType } from "../../enums/social.enum";
import { Image, CommentMedia, Video } from "../../domains/social/media.domain";
import { Audit } from "../../domains/audit.domain";
import { Album } from "../../domains/social/album.domain";
import { isNil } from "lodash";

@Entity({ name: "albums" })
export class AlbumEntity {
  @OneToOne(() => InteractionEntity, (it) => it.album, {
    primary: true,
    cascade: ["insert"],
  })
  @JoinColumn({ name: "id", referencedColumnName: "id" })
  interaction: InteractionEntity;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "owner_id" })
  owner: UserEntity;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "description", nullable: true })
  description: string;

  @OneToMany(() => AlbumMediaEntity, (media) => media.album)
  medias: AlbumMediaEntity[];

  constructor(album: Album) {
    this.interaction = new InteractionEntity(album);
    this.owner = new UserEntity(album?.owner);
    this.name = album?.name;
    this.description = album?.description;
  }

  toDomain(): Album {
    const audit = this.interaction && new Audit(this.interaction);
    return new Album({
      ...audit,
      name: this.name,
      medias: this.medias
        ?.filter((media) => !isNil(media.interaction))
        .map((media) => media.toDomain()),
      owner: this.owner?.toDomain(),
      description: this.description,
      nReactions: this.interaction?.nReactions,
      nComments: this.interaction?.nComments,
    });
  }

  update(data: Partial<Album>): Partial<AlbumEntity> {
    return {
      name: data?.name ?? this.name,
      description: data?.description ?? this.description,
    };
  }
}

@Entity({ name: "album_medias" })
export class AlbumMediaEntity {
  @OneToOne(() => InteractionEntity, { primary: true })
  @JoinColumn({ name: "id", referencedColumnName: "id" })
  interaction: InteractionEntity;

  @ManyToOne(() => AlbumEntity, (album) => album.medias, { nullable: false })
  @JoinColumn({ name: "album_id" })
  album: AlbumEntity;

  @Column({
    name: "type",
    type: "enum",
    enum: MediaType,
    nullable: false,
  })
  type: MediaType;

  @Column({ name: "key", nullable: false })
  key: string;

  constructor(media: CommentMedia, interaction?: InteractionEntity) {
    this.key = media?.key;
    this.type = media?.type;
    this.interaction = interaction ? interaction : new InteractionEntity(media);
  }

  toDomain(): CommentMedia {
    const { nReactions, nComments } = this.interaction;
    switch (this.type) {
      case MediaType.IMAGE:
        return new Image({
          nReactions,
          nComments,
          key: this.key,
          id: this.interaction && this.interaction.id,
        });
      case MediaType.VIDEO:
        return new Video({
          nReactions,
          nComments,
          key: this.key,
          id: this.interaction && this.interaction.id,
        });
    }
  }
}
