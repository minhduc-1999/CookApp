import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "base/schemas/schema.base";
import { PostDTO } from "dtos/post.dto";
import { ReactionDTO } from "dtos/reaction.dto";
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

  @Prop({ type: [Object] })
  reactions: ReactionDTO[];

  @Prop({ type: Number })
  numOfReaction: number;

  @Prop({ type: Number })
  numOfComment: number;

  constructor(post: Partial<PostDTO>) {
    super(post);
    this.content = post?.content;
    this.images = post?.images;
    this.videos = post?.videos;
    if (post?.author) {
      const { id, avatar, displayName } = post?.author;
      this.author = { id, avatar, displayName };
    }
    this.reactions = post?.reactions || [];
    this.numOfReaction = post?.numOfReaction || 0;
    this.numOfComment = post?.numOfComment || 0;

  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

export const PostModel: ModelDefinition = {
  name: Post.name,
  schema: PostSchema,
  collection: "posts",
};
