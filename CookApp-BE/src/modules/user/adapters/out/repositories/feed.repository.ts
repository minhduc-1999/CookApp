import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { plainToClass } from "class-transformer";
import { Feed, FeedDocument } from "domains/schemas/social/feed.schema";
import { PostDTO } from "dtos/social/post.dto";
import { UserDTO } from "dtos/social/user.dto";
import { ClientSession, Model } from "mongoose";

export interface IFeedRepository {
  pushNewPost(post: PostDTO, userId: string): Promise<void>;
  updatePostInFeed(post: Partial<PostDTO>, user: UserDTO): Promise<void>;
  getPosts(user: UserDTO, query: PageOptionsDto): Promise<PostDTO[]>;
  getTotalPosts(userId: UserDTO): Promise<number>;
  updateNumReaction(postId: string, delta: number): Promise<void>;
  updateNumComment(postId: string, delta: number): Promise<void>;
  setSession(session: ClientSession): IFeedRepository;
}

@Injectable()
export class FeedRepository extends BaseRepository implements IFeedRepository {
  private logger: Logger = new Logger(FeedRepository.name);
  constructor(@InjectModel(Feed.name) private _feedModel: Model<FeedDocument>) {
    super();
  }
  async updateNumComment(postId: string, delta: number): Promise<void> {
    await this._feedModel.updateMany(
      {
        "posts.id": postId,
      },
      {
        $inc: { "posts.$.numOfComment": delta },
      },
      {
        session: this.session,
      }
    );
  }
  async updateNumReaction(postId: string, delta: number): Promise<void> {
    await this._feedModel.updateMany(
      {
        "posts.id": postId,
      },
      {
        $inc: { "posts.$.numOfReaction": delta },
      },
      {
        session: this.session,
      }
    );
  }

  async getTotalPosts(user: UserDTO): Promise<number> {
    const feedDocs = await this._feedModel
      .findOne({ "user.id": user.id }, "numberOfPost")
      .exec();
    return feedDocs.numberOfPost;
  }

  async getPosts(user: UserDTO, query: PageOptionsDto): Promise<PostDTO[]> {
    const postDocs = await this._feedModel.aggregate([
      { $match: { "user.id": user.id } },
      { $unwind: "$posts" },
      { $sort: { "posts.createdAt": -1 } },
      { $skip: query.offset * query.limit },
      { $limit: query.limit },
      { $group: { _id: "$_id", posts: { $push: "$posts" } } },
    ]);
    if (postDocs.length < 1) return [];
    return postDocs[0].posts.map((post) =>
      plainToClass(PostDTO, post, {
        excludeExtraneousValues: true,
      })
    );
  }

  async pushNewPost(post: PostDTO, userId: string): Promise<void> {
    await this._feedModel.updateOne(
      {
        "user.id": userId,
      },
      {
        $push: { posts: Feed.generatePostItem(post) },
        $inc: { numberOfPost: 1 },
      },
      {
        session: this.session,
      }
    );
  }

  async updatePostInFeed(post: PostDTO, user: UserDTO): Promise<void> {
    await this._feedModel.updateOne(
      {
        "user.id": user.id,
        "posts.id": post.id,
      },
      {
        $set: { "posts.$": Feed.generatePostItem(post) },
      },
      { session: this.session }
    );
  }
}
