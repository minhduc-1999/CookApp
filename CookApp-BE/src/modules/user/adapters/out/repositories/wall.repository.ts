import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/schemas/user.schema";
import { Wall, WallDocument } from "domains/schemas/wall.schema";
import { PostDTO } from "dtos/post.dto";
import { UserDTO } from "dtos/user.dto";
import { ClientSession, Model } from "mongoose";

export interface IWallRepository {
  pushNewPost(post: PostDTO, user: UserDTO): Promise<void>;
  updatePostInWall(
    post: PostDTO,
    user: UserDTO,
    session?: ClientSession
  ): Promise<void>;
  getPosts(user: UserDTO, query: PageOptionsDto): Promise<PostDTO[]>;
  getTotalPosts(userId: UserDTO): Promise<number>;
}

@Injectable()
export class WallRepository implements IWallRepository {
  constructor(
    @InjectModel(Wall.name) private _wallModel: Model<WallDocument>
  ) {}
  async getTotalPosts(user: UserDTO): Promise<number> {
    const wallDocs = await this._wallModel
      .findOne({ user: { id: user.id } }, "numberOfPost")
      .exec();
    return wallDocs.numberOfPost;
  }
  async getPosts(user: UserDTO, query: PageOptionsDto): Promise<PostDTO[]> {
    const postDocs = await this._wallModel.aggregate([
      { $match: { user: { id: user.id } } },
      { $unwind: "$posts" },
      { $sort: { "posts.createdAt": -1 } },
      { $skip: query.offset * query.limit },
      { $limit: query.limit },
      { $group: { _id: "$_id", posts: { $push: "$posts" } } },
    ]);
    if (postDocs.length < 1) return [];
    return postDocs[0].posts;
  }
  async updatePostInWall(
    post: PostDTO,
    user: UserDTO,
    session: ClientSession = null
  ): Promise<void> {
    await this._wallModel.updateOne(
      {
        user: { id: user.id },
        "posts.id": post.id,
      },
      {
        $set: { "posts.$": post },
      },
      {
        session: session,
      }
    );
  }
  async pushNewPost(post: PostDTO, user: UserDTO): Promise<void> {
    await this._wallModel.updateOne(
      {
        user: { id: user.id },
      },
      {
        $push: { posts: post },
        $inc: { numberOfPost: 1 },
      }
    );
  }
}
