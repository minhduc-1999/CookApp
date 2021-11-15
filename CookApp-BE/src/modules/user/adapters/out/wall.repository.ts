import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Wall, WallDocument } from "domains/schemas/wall.schema";
import { PostDTO } from "dtos/post.dto";
import { UserDTO } from "dtos/user.dto";
import { WallDTO } from "dtos/wall.dto";
import { ClientSession, Model } from "mongoose";

export interface IWallRepository {
  createWall(wall: WallDTO, session: ClientSession): Promise<WallDTO>;
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
      }
    );
  }
  async createWall(wall: WallDTO, session: ClientSession): Promise<WallDTO> {
    const creatingWall = new this._wallModel(new Wall(wall));
    const wallDoc = await creatingWall.save({ session: session });
    if (!wallDoc) return null;
    const createdWall = new WallDTO(wallDoc);
    return createdWall;
  }
}
