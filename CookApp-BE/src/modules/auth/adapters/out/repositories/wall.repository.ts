import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "base/repository.base";
import { plainToClass } from "class-transformer";
import { Wall, WallDocument } from "domains/schemas/wall.schema";
import { WallDTO } from "dtos/wall.dto";
import { ClientSession, Model } from "mongoose";

export interface IWallRepository {
  createWall(wall: WallDTO): Promise<WallDTO>;
  setSession(session: ClientSession): IWallRepository;
}

@Injectable()
export class WallRepository extends BaseRepository implements IWallRepository {
  private logger: Logger = new Logger(WallRepository.name);
  constructor(@InjectModel(Wall.name) private _wallModel: Model<WallDocument>) {
    super();
  }
  async createWall(wall: WallDTO): Promise<WallDTO> {
    const creatingWall = new this._wallModel(new Wall(wall));
    const wallDoc = await creatingWall.save({ session: this.session });
    if (!wallDoc) return null;
    return plainToClass(WallDTO, wallDoc, { excludeExtraneousValues: true });
  }
}
