import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/social/user.domain";
import { IUserSeService } from "modules/auth/adapters/out/services/userSe.service";
import { IUserService } from "modules/auth/services/user.service";
import { GetUsersResponse } from "./getUsersResponse";

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
    @Inject("IUserService")
    private _userService: IUserService,
    @Inject("IUserSeService")
    private _userSeService: IUserSeService
  ) {}
  async execute(query: GetUsersQuery): Promise<GetUsersResponse> {
    const { queryOptions } = query;
    let users: User[];
    let total: number = 0;
    if (queryOptions.q) {
      const [userIds, totalCount] = await this._userSeService.findManyAndCount(
        queryOptions.q,
        queryOptions
      );
      total = totalCount;
      const queryResult = await this._userService.getUsersByIds(userIds);
      users = userIds.map((id) => queryResult.find((item) => item.id === id));
    } else {
      [users, total] = await this._userService.getUsers(queryOptions);
    }

    let meta: PageMetadata;
    if (users.length > 0) {
      meta = new PageMetadata(queryOptions.offset, queryOptions.limit, total);
    }
    return new GetUsersResponse(users, meta);
  }
}
