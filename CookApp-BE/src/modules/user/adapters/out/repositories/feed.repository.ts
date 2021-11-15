import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Feed, FeedDocument } from "domains/schemas/feed.schema";
import { PostDTO } from "dtos/post.dto";
import { UserDTO } from "dtos/user.dto";
import { FeedDTO } from "dtos/feed.dto";
import { ClientSession, Model } from "mongoose";

export interface IFeedRepository {
  pushNewPost(post: PostDTO, user: UserDTO): Promise<void>;
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
}
