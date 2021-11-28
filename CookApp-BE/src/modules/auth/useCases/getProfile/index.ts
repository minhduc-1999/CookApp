import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { UserDTO } from "dtos/user.dto";
import { IUserService } from "modules/auth/services/user.service";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { GetProfileResponse } from "./getProfileResponse";

export class GetProfileQuery extends BaseQuery {
  constructor(user: UserDTO) {
    super(user);
  }
}

@QueryHandler(GetProfileQuery)
export class GetProfileQueryHandler implements IQueryHandler<GetProfileQuery> {
  constructor(
    @Inject("IUserService")
    private _userService: IUserService,
    @Inject("IStorageService")
    private _storageService: IStorageService
  ) {}
  async execute(query: GetProfileQuery): Promise<GetProfileResponse> {
    const user = await this._userService.getUserById(query.user.id);
    if (user.avatar.length > 0) {
      user.avatar = (
        await this._storageService.getDownloadUrls([user.avatar])
      )[0];
    }
    return user;
  }
}
