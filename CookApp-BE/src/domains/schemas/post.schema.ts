import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "base/schemas/schema.base";
import { PostDTO } from "dtos/post.dto";
import { Document } from "mongoose";
import { User } from "./user.schema";

export type PostDocument = Post & Document;

@Schema()
export class Post extends AbstractSchema {
  @Prop()
  content: string;

  @Prop({ type: Object })
  author: Pick<User, "id" | "avatar" | "displayName">;

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
    const { id, avatar, displayName } = post?.author;
    this.author = { id, avatar, displayName };
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

export const PostModel: ModelDefinition = {
  name: Post.name,
  schema: PostSchema,
  collection: "posts",
};
