import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "base/schemas/schema.base";
import { PostDTO } from "dtos/post.dto";
import { UserDTO } from "dtos/user.dto";
import { WallDTO } from "dtos/wall.dto";
import { Document } from "mongoose";
import { clean } from "utils";
import { Post } from "./post.schema";
import { User } from "./user.schema";

export type WallDocument = Wall & Document;

@Schema()
export class Wall extends AbstractSchema {
  @Prop({ type: Object })
  user: Pick<User, "avatar" | "id" | "displayName">;

  @Prop({ default: 0 })
  numberOfPost: number;

  @Prop({ default: 0 })
  numberOfFollower: number;

  @Prop({ default: 0 })
  numberOfFollowing: number;

  @Prop({
    type: [Object],
  })
  posts: Pick<Post, "id" | "videos" | "images" | "createdAt" | "updatedAt">[];

  @Prop({ type: [String] })
  followers: string[];

  @Prop({ type: [String] })
  following: string[];

  constructor(wall: Partial<WallDTO>) {
    super(wall);
    const { id, avatar, displayName } = wall?.user;
    this.user = { id, avatar, displayName };
  }

  static generatePostItem(
    post: PostDTO
  ): Pick<Post, "id" | "videos" | "images"> {
    return clean({
      id: post?.id,
      videos: post?.videos,
      images: post?.images,
      createdAt: post?.createdAt,
      updatedAt: post?.updatedAt,
    });
  }

  static generateUserItem(
    user: UserDTO
  ): Pick<User, "avatar" | "id" | "displayName"> {
    return clean({
      avatar: user?.avatar,
      id: user?.id,
      displayName: user?.displayName,
    });
  }
}

export const WallSchema = SchemaFactory.createForClass(Wall);

export const WallModel: ModelDefinition = {
  name: Wall.name,
  schema: WallSchema,
  collection: "walls",
};
