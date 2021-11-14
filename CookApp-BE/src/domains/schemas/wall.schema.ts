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
  user: Pick<User, "avatar" | "id">;

  @Prop()
  numberOfPost: number;

  @Prop()
  numberOfFollower: number;

  @Prop()
  numberOfFollowing: number;

  @Prop({
    type: [Object],
  })
  posts: Post[];

  constructor(wall: Partial<WallDTO>) {
    super(wall);
    this.user = wall?.user;
    this.numberOfFollower = wall?.numberOfFollower;
    this.numberOfFollowing = wall?.numberOfFollowing;
    this.numberOfPost = wall?.numberOfPost;
    this.posts = wall?.posts?.map((post) => new Post(post));
  }
}

export const WallSchema = SchemaFactory.createForClass(Wall);

export const WallModel: ModelDefinition = {
  name: Wall.name,
  schema: WallSchema,
  collection: "walls",
};
