import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { UserDTO } from "dtos/social/user.dto";
import { IUserService } from "modules/auth/services/user.service";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { GetUsersResponse } from "./getUsersResponse";

export class GetUsersQuery extends BaseQuery {
  queryOptions: PageOptionsDto;
  constructor(user: UserDTO, queryOptions?: PageOptionsDto) {
    super(user);
    this.queryOptions = queryOptions;
  }
}

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @Inject("IStorageService") private _storageService: IStorageService,
    @Inject("IUserService")
    private _userService: IUserService
  ) {}
  async execute(query: GetUsersQuery): Promise<GetUsersResponse> {
    const { queryOptions } = query;
    const users = await this._userService.getUsersPublicInfo(queryOptions);

    for (let user of users) {
      if (user.avatar) {
        user.avatar = (
          await this._storageService.getDownloadUrls([user.avatar])
        )[0];
      }
    }
    const totalCount = await this._userService.getTotalUsers(queryOptions);
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
