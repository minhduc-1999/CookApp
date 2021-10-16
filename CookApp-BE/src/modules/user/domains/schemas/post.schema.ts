import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "base/schemas/schema.base";
import { Type } from "class-transformer";
import { PostDTO } from "modules/user/dtos/post.dto";
import { Document } from "mongoose";
import { User, UserSchema } from "./user.schema";

export type PostDocument = Post & Document;

@Schema()
export class Post extends AbstractSchema {
  @Prop()
  content: string;

  @Prop({
    type: UserSchema
  })
  @Type(() => User)
  author: User;


  @Prop({
    type: [String]
  })
  images: string[];

  @Prop({
    type: [String]
  })
  videos: string[];


  constructor(postDto: Partial<PostDTO>) {
    super(postDto);
    this.content = postDto?.content;
    this.images = postDto?.images;
    this.videos = postDto?.videos;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

export const PostModel: ModelDefinition = {
  name: Post.name,
  schema: PostSchema,
  collection: "posts",
};
