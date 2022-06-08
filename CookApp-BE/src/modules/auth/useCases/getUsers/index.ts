import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/social/user.domain";
import { GetUsersResponse } from "./getUsersResponse";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";

export class GetUsersQuery extends BaseQuery {
  queryOptions: PageOptionsDto;
  constructor(user: User, queryOptions?: PageOptionsDto) {
    super(user);
    this.queryOptions = queryOptions;
  }
}

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @Inject("IUserRepository")
    private _userRepo: IUserRepository,
    @Inject("IStorageService") private _storageService: IStorageService
  ) {}
  async execute(query: GetUsersQuery): Promise<GetUsersResponse> {
    const { queryOptions } = query;
    let users: User[];
    let totalCount = 0;

    if (queryOptions.q) {
      //TODO
      // const [ids, total] = await this._foodSeService.findManyByNameAndCount(
      //   queryOptions.q,
      //   queryOptions
      // );
      // totalCount = total;
      // foods = await this._unitRepo.getByIds(ids);
    } else {
      [users, totalCount] = await this._userRepo.getUserWithAccount(
        queryOptions
      );
    }

    for (let user of users) {
      user.avatar = (
        await this._storageService.getDownloadUrls([user.avatar])
      )[0];
    }

    let meta: PageMetadata;
    if (users.length > 0) {
      meta = new PageMetadata(
        queryOptions.offset,
        queryOptions.limit,
        totalCount
      );
    }
    return new GetUsersResponse(users, meta);
  }
}
