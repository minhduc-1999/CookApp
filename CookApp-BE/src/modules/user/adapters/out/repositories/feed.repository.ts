import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PageOptionsDto } from "base/pageOptions.base";
import { plainToClass } from "class-transformer";
import { Feed, FeedDocument } from "domains/schemas/feed.schema";
import { Post } from "domains/schemas/post.schema";
import { PostDTO } from "dtos/post.dto";
import { UserDTO } from "dtos/user.dto";
import { ClientSession, Model } from "mongoose";
import { clean } from "utils";

export interface IFeedRepository {
  pushNewPost(post: PostDTO, user: UserDTO): Promise<void>;
  updatePostInFeed(
    post: Partial<PostDTO>,
    user: UserDTO,
    session?: ClientSession
  ): Promise<void>;
  getPosts(user: UserDTO, query: PageOptionsDto): Promise<PostDTO[]>;
  getTotalPosts(userId: UserDTO): Promise<number>;
  updateNumReaction(postId: string, delta: number): Promise<void>;
}

@Injectable()
export class FeedRepository implements IFeedRepository {
  private logger: Logger = new Logger(FeedRepository.name);
  constructor(
    @InjectModel(Feed.name) private _feedModel: Model<FeedDocument>
  ) {}
  async updateNumReaction(postId: string, delta: number): Promise<void> {
    await this._feedModel.updateMany(
      {
        "posts.id": postId,
      },
      {
        $inc: { "posts.$.numOfReaction": delta },
      }
    );
  }

  async getTotalPosts(user: UserDTO): Promise<number> {
    const feedDocs = await this._feedModel
      .findOne({ user: { id: user.id } }, "numberOfPost")
      .exec();
    return feedDocs.numberOfPost;
  }

  async getPosts(user: UserDTO, query: PageOptionsDto): Promise<PostDTO[]> {
    const postDocs = await this._feedModel.aggregate([
      { $match: { user: { id: user.id } } },
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

  async pushNewPost(post: PostDTO, user: UserDTO): Promise<void> {
    delete post.author
    delete post.reactions
    await this._feedModel.updateOne(
      {
        user: { id: user.id },
      },
      {
        $push: { posts: clean(post) },
        $inc: { numberOfPost: 1 },
      }
    );
  }

  async updatePostInFeed(
    post: Partial<PostDTO>,
    user: UserDTO,
    session: ClientSession = null
  ): Promise<void> {
    await this._feedModel.updateOne(
      {
        user: { id: user.id },
        "posts.id": post.id,
      },
      {
        $set: { "posts.$": clean(new Post(post)) },
      },
      { session }
    );
  }
}
