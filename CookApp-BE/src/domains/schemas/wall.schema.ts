import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "base/schemas/schema.base";
import { WallDTO } from "dtos/wall.dto";
import { Document } from "mongoose";
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
  posts: Omit<Post, "author">[];

  constructor(wall: Partial<WallDTO>) {
    super(wall);
    const { id, avatar, displayName } = wall?.user;
    this.user = { id, avatar, displayName };
    this.numberOfFollower = wall?.numberOfFollower;
    this.numberOfFollowing = wall?.numberOfFollowing;
    this.numberOfPost = wall?.numberOfPost;
    this.posts = wall?.posts?.map((post) => {
      delete post.author;
      return new Post(post);
    });
  }
}

export const WallSchema = SchemaFactory.createForClass(Wall);

export const WallModel: ModelDefinition = {
  name: Wall.name,
  schema: WallSchema,
  collection: "walls",
};
