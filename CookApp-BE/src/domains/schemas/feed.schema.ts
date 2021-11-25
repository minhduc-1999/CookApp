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
  user: Pick<User, "id">;

  @Prop({
    type: [Object],
  })
  posts: Omit<Post, "author" | "reactions">[];

  @Prop({ default: 0 })
  numberOfPost: number;

  constructor(feed: Partial<FeedDTO>) {
    super(feed);
    const { id } = feed?.user;
    this.user = { id };
    this.posts = feed?.posts?.map((post) => {
      delete post.author;
      delete post.reactions;
      return new Post(post);
    });
    this.numberOfPost = feed?.numberOfPost || 0;
  }
}

export const FeedSchema = SchemaFactory.createForClass(Feed);

export const FeedModel: ModelDefinition = {
  name: Feed.name,
  schema: FeedSchema,
  collection: "feeds",
};
