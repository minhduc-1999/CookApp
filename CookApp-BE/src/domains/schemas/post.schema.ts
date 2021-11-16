import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "base/schemas/schema.base";
import { Type } from "class-transformer";
import { PostDTO } from "dtos/post.dto";
import * as mongoose from "mongoose";
import { Document } from "mongoose";
import { User } from "./user.schema";

export type PostDocument = Post & Document;

@Schema()
export class Post extends AbstractSchema {
  @Prop()
  content: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  @Type(() => User)
  author: User;

  @Prop({
    type: [String],
  })
  images: string[];

  @Prop({
    type: [String],
  })
  videos: string[];

  constructor(post: Partial<PostDTO>) {
    super(post);
    this.content = post?.content;
    this.images = post?.images;
    this.videos = post?.videos;
    this.author = new User(post.author);
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

export const PostModel: ModelDefinition = {
  name: Post.name,
  schema: PostSchema,
  collection: "posts",
};
