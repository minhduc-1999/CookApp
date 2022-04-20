import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { GetProfileResponse } from "./getProfileResponse";

export class GetProfileQuery extends BaseQuery {
  constructor(user: User) {
    super(user);
  }
}

@QueryHandler(GetProfileQuery)
export class GetProfileQueryHandler implements IQueryHandler<GetProfileQuery> {
  constructor(
    @Inject("IUserRepository")
    private _userRepo: IUserRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService
  ) { }
  async execute(query: GetProfileQuery): Promise<GetProfileResponse> {
    const user = await this._userRepo.getProfile(query.user.id)

    if (!user) {
      throw new NotFoundException(
        ResponseDTO.fail("User not found", UserErrorCode.USER_NOT_FOUND)
      );
    }

    if (user.avatar) {
      [user.avatar] = await this._storageService.getDownloadUrls([user.avatar])
    }

    return new GetProfileResponse(user);
  }
}
