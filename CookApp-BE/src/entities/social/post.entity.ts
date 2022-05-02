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
import { MediaType, PostType } from "../../enums/social.enum";
import {
  FoodShare,
  Moment,
  Post,
} from "../../domains/social/post.domain";
import { Image, Video, PostMedia } from "../../domains/social/media.domain";
import { Audit } from "../../domains/audit.domain";
import { isNil } from "lodash";
import { FoodEntity } from "../../entities/core/food.entity";

@Entity({ name: "posts" })
export class PostEntity {
  @OneToOne(() => InteractionEntity, (it) => it.post, {
    primary: true,
    cascade: ["insert"],
  })
  @JoinColumn({ name: "id", referencedColumnName: "id" })
  interaction: InteractionEntity;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "author_id" })
  author: UserEntity;

  @Column({ name: "location", nullable: true })
  location: string;

  @Column({ name: "content" })
  content: string;

  @OneToMany(() => PostMediaEntity, (media) => media.post)
  medias: PostMediaEntity[];

  @Column({
    type: "enum",
    enum: PostType,
    nullable: false,
    name: "kind",
  })
  kind: PostType;

  @ManyToOne(() => FoodEntity, (food) => food.referredPosts)
  @JoinColumn({ name: "food_ref_id" })
  foodRef: FoodEntity;

  @Column({ type: "jsonb", nullable: true })
  tags: string[];

  constructor(post: Post, interaction?: InteractionEntity) {
    this.interaction = interaction ? interaction : new InteractionEntity(post);
    this.author = new UserEntity(post?.author);
    this.content = post?.content;
    this.kind = post?.type;
    this.tags = post?.tags;
    switch (post?.type) {
      case PostType.FOOD_SHARE:
        this.foodRef = (<FoodShare>post)?.ref && new FoodEntity((<FoodShare>post).ref)
        break;
      case PostType.MOMENT:
        this.location = (<Moment>post)?.location;
        break;
      default:
        break;
    }
  }

  toDomain(): Post {
    const audit = this.interaction && new Audit(this.interaction);
    const { nReactions, nComments } = this.interaction;
    const common = {
      ...audit,
      nComments,
      nReactions,
      content: this.content,
      medias:
        this.medias &&
        this.medias
          .filter((media) => !isNil(media.interaction))
          .map((media) => media.toDomain()),
      author: this.author && this.author.toDomain(),
      tags: this.tags,
    };
    switch (this.kind) {
      case PostType.MOMENT:
        return new Moment({
          ...common,
          location: this.location,
        });
      case PostType.FOOD_SHARE:
        return new FoodShare({
          ...common,
          ref: this.foodRef && this.foodRef.toDomain(),
        });
    }
  }

  update(data: Partial<Post>): Partial<PostEntity> {
    switch (this.kind) {
      case PostType.MOMENT:
        const temp = data as Partial<Moment>;
        return {
          content: temp?.content ?? this.content,
          location: temp?.location ?? this.location,
          tags: temp?.tags ?? this.tags,
        };
      case PostType.FOOD_SHARE:
        const temp1 = data as Partial<FoodShare>;
        return {
          content: temp1?.content ?? this.content,
          foodRef: temp1?.ref && new FoodEntity(temp1.ref),
        };
    }
  }
}

@Entity({ name: "post_medias" })
export class PostMediaEntity {
  @OneToOne(() => InteractionEntity, { primary: true })
  @JoinColumn({ name: "id", referencedColumnName: "id" })
  interaction: InteractionEntity;

  @ManyToOne(() => PostEntity, (post) => post.medias, { nullable: false })
  @JoinColumn({ name: "post_id" })
  post: PostEntity;

  @Column({
    name: "type",
    type: "enum",
    enum: MediaType,
    nullable: false,
  })
  type: MediaType;

  @Column({ name: "key", nullable: false })
  key: string;

  constructor(media: PostMedia, interaction?: InteractionEntity) {
    this.key = media?.key;
    this.type = media?.type;
    this.interaction = interaction ? interaction : new InteractionEntity(media);
  }

  toDomain(): PostMedia {
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
