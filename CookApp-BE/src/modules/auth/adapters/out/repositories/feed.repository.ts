import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "base/repository.base";
import { plainToClass } from "class-transformer";
import { Feed, FeedDocument } from "domains/schemas/social/feed.schema";
import { FeedDTO } from "dtos/social/feed.dto";
import { ClientSession, Model } from "mongoose";

export interface IFeedRepository {
  createFeed(feed: FeedDTO): Promise<FeedDTO>;
  setSession(session: ClientSession): IFeedRepository;
}

@Injectable()
export class FeedRepository extends BaseRepository implements IFeedRepository {
  private logger: Logger = new Logger(FeedRepository.name);
  constructor(@InjectModel(Feed.name) private _feedModel: Model<FeedDocument>) {
    super();
  }

  async createFeed(feed: FeedDTO): Promise<FeedDTO> {
    const creatingFeed = new this._feedModel(new Feed(feed));
    const feedDoc = await creatingFeed.save({ session: this.session });
    if (!feedDoc) return null;
    return plainToClass(FeedDTO, feedDoc, { excludeExtraneousValues: true });
  }
}
