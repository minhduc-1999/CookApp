import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { plainToClass } from "class-transformer";
import { Wall, WallDocument } from "domains/schemas/social/wall.schema";
import { PostDTO } from "dtos/social/post.dto";
import { UserDTO } from "dtos/social/user.dto";
import { WallDTO } from "dtos/social/wall.dto";
import { FollowType } from "enums/follow.enum";
import { Model } from "mongoose";
import { Transaction } from "neo4j-driver";

export interface IWallRepository {
  pushNewPost(post: PostDTO, user: UserDTO): Promise<void>;
  updatePostInWall(post: Partial<PostDTO>, user: UserDTO): Promise<void>;
  getPosts(userId: string, query: PageOptionsDto): Promise<PostDTO[]>;
  getTotalPosts(userId: string): Promise<number>;
  setTransaction(tx: Transaction): IWallRepository
  updateFollowers(
    userId: string,
    targetId: string,
    type: FollowType
  ): Promise<void>;
  updateFollowing(
    userId: string,
    targetId: string,
    type: FollowType
  ): Promise<void>;
  isFollowed(sourceId: string, targetId: string): Promise<boolean>;
  getFollowers(userId: string): Promise<string[]>;
  getFollowing(userId: string): Promise<string[]>;
  getWall(userId: string): Promise<WallDTO>;
}

@Injectable()
export class WallRepository extends BaseRepository implements IWallRepository {
  constructor(@InjectModel(Wall.name) private _wallModel: Model<WallDocument>) {
    super();
  }
  async getWall(userId: string): Promise<WallDTO> {
    const wallDoc = await this._wallModel
      .findOne(
        {
          "user.id": userId,
        },
      )
      .exec();
    return plainToClass(WallDTO, wallDoc, {
      excludeExtraneousValues: true,
    });
  }
  async getTotalPosts(userId: string): Promise<number> {
    const wallDocs = await this._wallModel
      .findOne({ "user.id": userId }, "numberOfPost")
      .exec();
    return wallDocs.numberOfPost;
  }
  async getPosts(userId: string, query: PageOptionsDto): Promise<PostDTO[]> {
    const postDocs = await this._wallModel.aggregate([
      { $match: { "user.id": userId } },
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
        "user.id": user.id,
        "posts.id": post.id,
      },
      {
        $set: { "posts.$": Wall.generatePostItem(post) },
      },
    );
  }
  async pushNewPost(post: PostDTO, user: UserDTO): Promise<void> {
    await this._wallModel.updateOne(
      {
        "user.id": user.id,
      },
      {
        $push: { posts: Wall.generatePostItem(post) },
        $inc: { numberOfPost: 1 },
      },
    );
  }

  async updateFollowers(
    userId: string,
    targetId: string,
    type: FollowType
  ): Promise<void> {
    switch (type) {
      case FollowType.Follow:
        await this._wallModel.updateOne(
          {
            "user.id": userId,
          },
          {
            $push: { followers: targetId },
            $inc: { numberOfFollower: 1 },
          },
        );
        break;
      case FollowType.Unfollow:
        await this._wallModel.updateOne(
          {
            "user.id": userId,
          },
          {
            $pull: { followers: targetId },
            $inc: { numberOfFollower: -1 },
          },
        );
        break;
      default:
        break;
    }
  }
  async updateFollowing(
    userId: string,
    targetId: string,
    type: FollowType
  ): Promise<void> {
    switch (type) {
      case FollowType.Follow:
        await this._wallModel.updateOne(
          {
            "user.id": userId,
          },
          {
            $push: { following: targetId },
            $inc: { numberOfFollowing: 1 },
          },
        );
        break;
      case FollowType.Unfollow:
        await this._wallModel.updateOne(
          {
            "user.id": userId,
          },
          {
            $pull: { following: targetId },
            $inc: { numberOfFollowing: -1 },
          },
        );
        break;
      default:
        break;
    }
  }
  async isFollowed(sourceId: string, targetId: string): Promise<boolean> {
    const result = await this._wallModel.findOne({
      "user.id": sourceId,
      following: targetId,
    });
    if (result) {
      return true;
    }
    return false;
  }

  async getFollowers(userId: string): Promise<string[]> {
    const wallDocs = await this._wallModel
      .findOne({ "user.id": userId }, "followers")
      .exec();
    return wallDocs.followers;
  }

  async getFollowing(userId: string): Promise<string[]> {
    const wallDoc = await this._wallModel
      .findOne(
        {
          "user.id": userId,
        },
        "following"
      )
      .exec();
    return wallDoc.following;
  }
}
