import {
  Injectable,
  InternalServerErrorException,
  NotImplementedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { User } from "domains/social/user.domain";
import { UserEntity } from "entities/social/user.entity";
import { TypeormException } from "exception_filter/postgresException.filter";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";
import { QueryRunner, Repository, QueryFailedError, In } from "typeorm";

@Injectable()
export class UserRepository extends BaseRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private _repo: Repository<UserEntity>
  ) {
    super();
  }

  async getUsersByIds(ids: string[]): Promise<User[]> {
    const entities = await this._repo.findByIds(ids);
    return entities?.map((e) => e.toDomain());
  }

  async existAll(userIds: string[]): Promise<boolean> {
    if (userIds.length === 0) return false;
    const count = await this._repo.count({
      where: {
        id: In(userIds),
      },
    });
    return count === userIds.length;
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this._repo
      .createQueryBuilder("user")
      .where("user.id = :id", { id: userId })
      .getOne();
    return user?.toDomain();
  }
  async createUser(userData: User): Promise<User> {
    let userEntity = new UserEntity(userData);
    const queryRunner = this.tx?.getRef() as QueryRunner;
    try {
      if (queryRunner && !queryRunner.isReleased) {
        userEntity = await queryRunner.manager.save<UserEntity>(userEntity);
      } else {
        userEntity = await this._repo.save(userEntity);
      }
    } catch (err) {
      if (err instanceof QueryFailedError) throw new TypeormException(err);
      throw err;
    }
    return userEntity?.toDomain();
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this._repo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.account", "account")
      .leftJoinAndSelect("account.role", "role")
      .leftJoinAndSelect("role.permissions", "rolePms")
      .leftJoinAndSelect("rolePms.permission", "permission")
      .where("account.email = :email", { email })
      .select([
        "account",
        "user.id",
        "user.displayName",
        "user.avatar",
        "role",
        "rolePms",
        "permission",
      ])
      .getOne();
    return user?.toDomain();
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this._repo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.account", "account")
      .leftJoinAndSelect("account.role", "role")
      .leftJoinAndSelect("role.permissions", "rolePms")
      .leftJoinAndSelect("rolePms.permission", "permission")
      .where("account.username = :username", { username })
      .select([
        "user.id",
        "user.displayName",
        "user.avatar",
        "account",
        "role",
        "rolePms",
        "permission",
      ])
      .getOne();
    return user?.toDomain();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this._repo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.account", "account")
      .leftJoinAndSelect("account.role", "role")
      .leftJoinAndSelect("role.permissions", "rolePms")
      .leftJoinAndSelect("rolePms.permission", "permission")
      .where("user.id = :id", { id })
      .select([
        "user.id",
        "user.displayName",
        "role",
        "rolePms",
        "user.avatar",
        "account",
        "permission",
      ])
      .getOne();
    return user?.toDomain();
  }

  async updateUserProfile(user: User): Promise<void> {
    const queryRunner = this.tx?.getRef() as QueryRunner;
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.manager.update(
        UserEntity,
        { id: user.id },
        new UserEntity(user).update()
      );
    } else {
      throw new InternalServerErrorException();
    }
  }

  async getUsers(query: PageOptionsDto): Promise<[User[], number]> {
    const [entities, total] = await this._repo
      .createQueryBuilder("user")
      .skip(query.limit * query.offset)
      .take(query.limit)
      .getManyAndCount();
    return [entities?.map((entity) => entity.toDomain()), total];
  }

  async updateStatus(user: User, statusID?: string): Promise<void> {
    throw new NotImplementedException();
  }
}
