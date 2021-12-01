import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "base/schemas/schema.base";
import { FeedDTO } from "dtos/feed.dto";
import { PostDTO } from "dtos/post.dto";
import { Document } from "mongoose";
import { clean } from "utils";
import { Post } from "./post.schema";
import { User } from "./user.schema";

export type FeedDocument = Feed & Document;

@Schema()
export class Feed extends AbstractSchema {
  @Prop({ type: Object })
  user: Pick<User, "id">;

  @Prop({
    type: [Object],
  })
  posts: Omit<Post, "reactions">[];

  @Prop({ default: 0 })
  numberOfPost: number;

  constructor(feed: Partial<FeedDTO>) {
    super(feed);
    const { id } = feed?.user;
    this.user = { id };
  }

  static generatePostItem(post: PostDTO): Omit<Post, "reactions"> {
    delete post.reactions;
    return clean({
      ...post,
    });
  }
}

export const FeedSchema = SchemaFactory.createForClass(Feed);

export const FeedModel: ModelDefinition = {
  name: Feed.name,
  schema: FeedSchema,
  collection: "feeds",
};
