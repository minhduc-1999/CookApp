import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model } from "mongoose";
import { ErrorCode } from "enums/errorCode.enum";
import { MongoErrorCode } from "enums/mongoErrorCode.enum";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserDTO } from "dtos/social/user.dto";
import { User, UserDocument } from "domains/schemas/social/user.schema";
import { plainToClass } from "class-transformer";
import { BaseRepository } from "base/repository.base";
import { PageOptionsDto } from "base/pageOptions.base";

export interface IUserRepository {
  createUser(userData: UserDTO): Promise<UserDTO>;
  getUserByEmail(email: string): Promise<UserDTO>;
  getUserByUsername(username: string): Promise<UserDTO>;
  getUserById(id: string): Promise<UserDTO>;
  updateUserProfile(
    userId: string,
    profile: Partial<UserDTO>
  ): Promise<UserDTO>;
  setSession(session: ClientSession): IUserRepository;
  getUsers(query: PageOptionsDto): Promise<UserDTO[]>;
  countUsers(query: PageOptionsDto): Promise<number>;
}

@Injectable()
export class UserRepository extends BaseRepository implements IUserRepository {
  private _logger = new Logger(UserRepository.name)
  constructor(@InjectModel(User.name) private _userModel: Model<UserDocument>) {
    super();
  }
  async countUsers(query: PageOptionsDto): Promise<number> {
    let textSearch = {};
    if (query.q !== "") {
      const regex = new RegExp(query.q, "gi");
      textSearch = { displayName: regex };
    }
    return this._userModel.count(textSearch).exec();
  }
  async getUsers(query: PageOptionsDto): Promise<UserDTO[]> {
    let textSearch = {};
    if (query.q !== "") {
      const regex = new RegExp(query.q, "gi");
      textSearch = { displayName: regex };
    }
    const users = await this._userModel
      .find(textSearch)
      .skip(query.limit * query.offset)
      .limit(query.limit);
    if (users.length < 1) return [];
    return users.map((food) =>
      plainToClass(UserDTO, food, {
        excludeExtraneousValues: true,
      })
    );
  }

  async updateUserProfile(
    userId: string,
    profile: Partial<UserDTO>
  ): Promise<UserDTO> {
    try {
      const userDoc = await this._userModel.findByIdAndUpdate(
        userId,
        { $set: profile },
        {
          new: true,
          session: this.session,
        }
      );
      return plainToClass(UserDTO, userDoc, { excludeExtraneousValues: true });
    } catch (error) {
      this._logger.error(error);
      if (error.code === MongoErrorCode.DUPLICATE_KEY)
        throw new ConflictException(
          ResponseDTO.fail(
            "This display name is already in use",
            ErrorCode.DISPLAY_NAME_ALREADY_IN_USE
          )
        );
      throw new InternalServerErrorException();
    }
  }

  async getUserById(id: string): Promise<UserDTO> {
    const userDoc = await this._userModel.findById(id).exec();
    if (!userDoc) return null;
    return plainToClass(UserDTO, userDoc, { excludeExtraneousValues: true });
  }

  async getUserByEmail(email: string): Promise<UserDTO> {
    const userDoc = await this._userModel.findOne({ email: email }).exec();
    if (!userDoc) return null;
    return plainToClass(UserDTO, userDoc, { excludeExtraneousValues: true });
  }

  async getUserByUsername(username: string): Promise<UserDTO> {
    const userDoc = await this._userModel
      .findOne({ username: username })
      .exec();
    if (!userDoc) return null;
    return plainToClass(UserDTO, userDoc, { excludeExtraneousValues: true });
  }

  async createUser(userData: UserDTO): Promise<UserDTO> {
    const createdUser = new this._userModel(new User(userData));
    try {
      const userDoc = await createdUser.save({ session: this.session });
      if (!userDoc) return null;
      return plainToClass(UserDTO, userDoc, { excludeExtraneousValues: true });
    } catch (error) {
      this._logger.error(error);
      if (error.code === MongoErrorCode.DUPLICATE_KEY)
        throw new ConflictException(
          ResponseDTO.fail(
            "This user is already existed",
            ErrorCode.ACCOUNT_ALREADY_EXISTED
          )
        );
      throw new InternalServerErrorException();
    }
  }
}
