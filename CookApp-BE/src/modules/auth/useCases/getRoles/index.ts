import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/social/user.domain";
import { GetRolesResponse } from "./getRolesResponse";
import { Role } from "domains/social/account.domain";
import { IRoleRepository } from "modules/auth/adapters/out/repositories/role.repository";

export class GetRolesQuery extends BaseQuery {
  queryOptions: PageOptionsDto;
  constructor(user: User, queryOptions?: PageOptionsDto) {
    super(user);
    this.queryOptions = queryOptions;
  }
}

@QueryHandler(GetRolesQuery)
export class GetRolesQueryHandler implements IQueryHandler<GetRolesQuery> {
  constructor(
    @Inject("IRoleRepository")
    private _roleRepo: IRoleRepository
  ) {}
  async execute(query: GetRolesQuery): Promise<GetRolesResponse> {
    const { queryOptions } = query;
    let roles: Role[];
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
      [roles, totalCount] = await this._roleRepo.getRoles(queryOptions);
    }

    let meta: PageMetadata;
    if (roles.length > 0) {
      meta = new PageMetadata(
        queryOptions.offset,
        queryOptions.limit,
        totalCount
      );
    }
    return new GetRolesResponse(roles, meta);
  }
}
