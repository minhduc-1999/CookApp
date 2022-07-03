import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Post } from "domains/social/post.domain";

export type PostDocument = PostItem & Document;

@Schema()
export class PostItem {
  @Prop()
  _id: string;

  @Prop({ type: [String] })
  tags: string[];

  getUpdateData(): Partial<PostItem> {
    const { _id, ...rest } = this;
    return rest;
  }

  constructor(post: Post) {
    this._id = post.id;
    this.tags = post.tags;
  }
}

export const PostSchema = SchemaFactory.createForClass(PostItem);

PostSchema.index({ tags: "text" });

export const PostModel: ModelDefinition = {
  name: PostItem.name,
  schema: PostSchema,
  collection: "posts",
};
