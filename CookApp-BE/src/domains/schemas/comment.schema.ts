import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "base/schemas/schema.base";
import { CommentDTO } from "dtos/comment.dto";
import { Document } from "mongoose";
import { User } from "./user.schema";

export type CommentDocument = Comment & Document;

@Schema()
export class Comment extends AbstractSchema {
  @Prop()
  content: string;

  @Prop()
  path: string;

  @Prop({ type: Object })
  user: Pick<User, "id" | "avatar" | "displayName">;

  @Prop()
  postId: string;

  constructor(commentDto: Partial<CommentDTO>) {
    super(commentDto);
    this.content = commentDto?.content;
    this.path = commentDto?.path;
    this.user = {
      id: commentDto?.user.id,
      avatar: commentDto?.user.avatar,
      displayName: commentDto?.user.displayName
    }
    this.postId = commentDto?.postId;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export const CommentModel: ModelDefinition = {
  name: Comment.name,
  schema: CommentSchema,
  collection: "comments",
};
