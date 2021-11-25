import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { Wall, WallDocument } from "domains/schemas/wall.schema";
import { PostDTO } from "dtos/post.dto";
import { UserDTO } from "dtos/user.dto";
import { ClientSession, Model } from "mongoose";

export interface IWallRepository {
  pushNewPost(post: PostDTO, user: UserDTO): Promise<void>;
  updatePostInWall(
    post: Partial<PostDTO>,
    user: UserDTO
  ): Promise<void>;
  getPosts(user: UserDTO, query: PageOptionsDto): Promise<PostDTO[]>;
  getTotalPosts(userId: UserDTO): Promise<number>;
  setSession(session: ClientSession): IWallRepository;
}

@Injectable()
export class WallRepository extends BaseRepository implements IWallRepository {
  constructor(@InjectModel(Wall.name) private _wallModel: Model<WallDocument>) {
    super();
  }
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
  async updatePostInWall(post: PostDTO, user: UserDTO): Promise<void> {
    await this._wallModel.updateOne(
      {
        user: { id: user.id },
        "posts.id": post.id,
      },
      {
        $set: { "posts.$": Wall.generatePostItem(post) },
      },
      {
        session: this.session,
      }
    );
  }
  async pushNewPost(post: PostDTO, user: UserDTO): Promise<void> {
    const { author, ...updatingPost } = post;
    await this._wallModel.updateOne(
      {
        user: { id: user.id },
      },
      {
        $push: { posts: Wall.generatePostItem(post) },
        $inc: { numberOfPost: 1 },
      },
      {
        session: this.session,
      }
    );
  }
}
