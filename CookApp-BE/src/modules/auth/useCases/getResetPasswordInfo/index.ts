import { BadRequestException, Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { GetResetPasswordInfoRequest } from "./getResetPasswordInfo.request";
import { GetResetPasswordResponse } from "./getResetPasswordInfo.response";
import { IAccountRepository } from "modules/auth/interfaces/repositories/account.interface";
import { ConfigService } from "nestjs-config";

export class GetResetPasswordQuery extends BaseQuery {
  req: GetResetPasswordInfoRequest;
  constructor(req: GetResetPasswordInfoRequest) {
    super(null);
    this.req = req;
  }
}

@QueryHandler(GetResetPasswordQuery)
export class GetResetPasswordInfoQueryHandler
  implements IQueryHandler<GetResetPasswordQuery>
{
  constructor(
    @Inject("IAccountRepository")
    private _accountRepo: IAccountRepository,
    private _configService: ConfigService
  ) {}
  async execute(
    query: GetResetPasswordQuery
  ): Promise<GetResetPasswordResponse> {
    const { req } = query;
    const callback = this._configService.get("system.resetPasswordCallback");
    const account = await this._accountRepo.getAccountByReseToken(req.token);
    if (!account) throw new BadRequestException("Bad request");
    return {
      token: account.resetPasswordToken,
      username: account.username,
      callback,
    };
  }
}
