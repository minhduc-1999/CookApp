import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Wall, WallDocument } from "domains/schemas/wall.schema";
import { PostDTO } from "dtos/post.dto";
import { UserDTO } from "dtos/user.dto";
import { Model } from "mongoose";

export interface IWallRepository {
  pushNewPost(post: PostDTO, user: UserDTO): Promise<void>;
}

@Injectable()
export class WallRepository implements IWallRepository {
  private logger: Logger = new Logger(WallRepository.name);
  constructor(
    @InjectModel(Wall.name) private _wallModel: Model<WallDocument>
  ) {}
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
