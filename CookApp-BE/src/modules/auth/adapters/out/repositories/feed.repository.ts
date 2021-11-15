import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Feed, FeedDocument } from "domains/schemas/feed.schema";
import { FeedDTO } from "dtos/feed.dto";
import { ClientSession, Model } from "mongoose";

export interface IFeedRepository {
  createFeed(feed: FeedDTO, session: ClientSession): Promise<FeedDTO>;
}

@Injectable()
export class FeedRepository implements IFeedRepository {
  private logger: Logger = new Logger(FeedRepository.name);
  constructor(
    @InjectModel(Feed.name) private _feedModel: Model<FeedDocument>
  ) {}

  async createFeed(feed: FeedDTO, session: ClientSession): Promise<FeedDTO> {
    const creatingFeed = new this._feedModel(new Feed(feed));
    const feedDoc = await creatingFeed.save({ session: session });
    if (!feedDoc) return null;
    const createdFeed = new FeedDTO(feedDoc);
    return createdFeed;
  }
}
