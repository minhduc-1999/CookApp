import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
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
}

@Injectable()
export class WallRepository implements IWallRepository {
  constructor(
    @InjectModel(Wall.name) private _wallModel: Model<WallDocument>
  ) {}
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
