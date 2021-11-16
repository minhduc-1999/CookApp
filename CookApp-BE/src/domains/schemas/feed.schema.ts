import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "base/schemas/schema.base";
import { FeedDTO } from "dtos/feed.dto";
import { Document } from "mongoose";
import { Post } from "./post.schema";
import { User } from "./user.schema";

export type FeedDocument = Feed & Document;

@Schema()
export class Feed extends AbstractSchema {
  @Prop({ type: Object })
  user: Pick<User, "avatar" | "id">;

  @Prop({
    type: [Object],
  })
  posts: Omit<Post, "author">[];

  @Prop({ default: 0 })
  numberOfPost: number;

  constructor(feed: Partial<FeedDTO>) {
    super(feed);
    this.user = feed?.user;
    this.posts = feed?.posts?.map((post) => new Post(post));
    this.numberOfPost = feed?.numberOfPost
  }
}

export const FeedSchema = SchemaFactory.createForClass(Feed);

export const FeedModel: ModelDefinition = {
  name: Feed.name,
  schema: FeedSchema,
  collection: "feeds",
};
