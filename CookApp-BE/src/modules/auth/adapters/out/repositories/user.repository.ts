import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ErrorCode } from "enums/errorCode.enum";
import { MongoErrorCode } from "enums/mongoErrorCode.enum";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserDTO } from "dtos/social/user.dto";
import { User, UserDocument } from "domains/schemas/social/user.schema";
import { plainToClass } from "class-transformer";
import { BaseRepository } from "base/repository.base";
import { PageOptionsDto } from "base/pageOptions.base";
import { INeo4jService } from "modules/neo4j/services/neo4j.service";
import _ = require("lodash");
import { Transaction } from "neo4j-driver";

export interface IUserRepository {
  createUser(userData: UserDTO): Promise<UserDTO>;
  getUserByEmail(email: string): Promise<UserDTO>;
  getUserByUsername(username: string): Promise<UserDTO>;
  getUserById(id: string): Promise<UserDTO>;
  updateUserProfile(
    userId: string,
    profile: Partial<UserDTO>
  ): Promise<UserDTO>;
  setTransaction(tx: Transaction): IUserRepository
  getUsers(query: PageOptionsDto): Promise<UserDTO[]>;
  countUsers(query: PageOptionsDto): Promise<number>;
}

@Injectable()
export class UserRepository extends BaseRepository implements IUserRepository {
  private _logger = new Logger(UserRepository.name)
  private _tx: Transaction
  constructor(
    @Inject("INeo4jService")
    private neo4jService: INeo4jService,
    @InjectModel(User.name) private _userModel: Model<UserDocument>) {
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
    const res = await this.neo4jService.write(`
            CREATE (u:User)
            SET u += $properties, u.id = randomUUID()
            RETURN u
        `, {
      properties: {
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        username: userData.username,
        createdAt: _.now(),
        profile: userData.profile,
        avatar: userData.avatar,
        emailVerified: userData.emailVerified
      },
    }, this._tx)
    console.log(res.records[0].get('u'))
    return plainToClass(UserDTO, res.records[0].get('u').properties, { excludeExtraneousValues: true });
  }
}

