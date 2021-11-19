import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { plainToClass } from "class-transformer";
import { Wall, WallDocument } from "domains/schemas/wall.schema";
import { WallDTO } from "dtos/wall.dto";
import { ClientSession, Model } from "mongoose";

export interface IWallRepository {
  createWall(wall: WallDTO, session: ClientSession): Promise<WallDTO>;
}

@Injectable()
export class WallRepository implements IWallRepository {
  private logger: Logger = new Logger(WallRepository.name);
  constructor(
    @InjectModel(Wall.name) private _wallModel: Model<WallDocument>
  ) {}
  async createWall(wall: WallDTO, session: ClientSession): Promise<WallDTO> {
    const creatingWall = new this._wallModel(new Wall(wall));
    const wallDoc = await creatingWall.save({ session: session });
    if (!wallDoc) return null;
    return plainToClass(WallDTO, wallDoc, { excludeExtraneousValues: true });
  }
}
