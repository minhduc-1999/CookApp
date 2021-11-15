import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Feed, FeedDocument } from "domains/schemas/feed.schema";
import { PostDTO } from "dtos/post.dto";
import { UserDTO } from "dtos/user.dto";
import { ClientSession, Model } from "mongoose";

export interface IFeedRepository {
  pushNewPost(post: PostDTO, user: UserDTO): Promise<void>;
  updatePostInFeed(
    post: PostDTO,
    user: UserDTO,
    session?: ClientSession
  ): Promise<void>;
}

@Injectable()
export class FeedRepository implements IFeedRepository {
  private logger: Logger = new Logger(FeedRepository.name);
  constructor(
    @InjectModel(Feed.name) private _feedModel: Model<FeedDocument>
  ) {}
  async pushNewPost(post: PostDTO, user: UserDTO): Promise<void> {
    await this._feedModel.updateOne(
      {
        user: { id: user.id },
      },
      {
        $push: { posts: post },
      }
    );
  }

  async updatePostInFeed(
    post: PostDTO,
    user: UserDTO,
    session: ClientSession = null
  ): Promise<void> {
    await this._feedModel.updateOne(
      {
        user: { id: user.id },
        "posts.id": post.id,
      },
      {
        $set: { "posts.$": post },
      },
      { session }
    );
  }
}
