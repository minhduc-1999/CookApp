import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { User } from "domains/social/user.domain";
import { UserEntity } from "entities/social/user.entity";
import { TypeormException } from "exception_filter/postgresException.filter";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";
import { QueryRunner, Repository, QueryFailedError } from "typeorm";

@Injectable()
export class UserRepository extends BaseRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private _repo: Repository<UserEntity>
  ) {
    super()
  }
  async getProfile(userId: string): Promise<User> {
    const user = await this._repo
      .createQueryBuilder("user")
      .where("user.id = :id", { id: userId })
      .select(["user"])
      .getOne()
    return user?.toDomain()
  }
  async createUser(userData: User): Promise<User> {
    let userEntity = new UserEntity(userData)
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      try {
        userEntity = await queryRunner.manager.save<UserEntity>(userEntity)
      } catch (err) {
        if (err instanceof QueryFailedError)
          throw new TypeormException(err)
        throw err
      }
    } else {
      userEntity = null
    }
    return userEntity?.toDomain()
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this._repo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.account", "account")
      .where("account.email = :email", { email })
      .select(["account", "user.id", "user.displayName", "user.avatar"])
      .getOne()
    return user?.toDomain()
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this._repo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.account", "account")
      .where("account.username = :username", { username })
      .select(["user.id", "user.displayName", "user.avatar", "account"])
      .getOne()
    return user?.toDomain()
  }

  async getUserById(id: string): Promise<User> {
    const user = await this._repo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.account", "account")
      .where("user.id = :id", { id })
      .select(["user.id", "user.displayName", "user.avatar", "account"])
      .getOne()
    return user?.toDomain()
  }
  async updateUserProfile(user: User): Promise<void> {
    const queryRunner = this.tx?.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.manager.update(
        UserEntity,
        { id: user.id },
        (new UserEntity(user)).update()
      )
    } else {
      throw new InternalServerErrorException()
    }
  }

  async getUsers(query: PageOptionsDto): Promise<[User[], number]> {
    const [entities, total] = await this._repo.createQueryBuilder("user")
      .skip(query.limit * query.offset)
      .limit(query.limit)
      .getManyAndCount()
    return [
      entities?.map(entity => entity.toDomain()),
      total
    ]
  }

  async updateStatus(user: User, statusID?: string): Promise<void> {
      await this._repo.update(
        { id: user.id },
        { status: statusID }
      )
  }
}

