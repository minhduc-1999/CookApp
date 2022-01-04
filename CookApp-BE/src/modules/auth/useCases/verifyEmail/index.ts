import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import _ = require("lodash");
import { IUserRepository } from "modules/auth/adapters/out/repositories/user.repository";
import { ClientSession } from "mongoose";
import { VerifyEmailRequest } from "./verifyEmailRequest";
import { IWallRepository } from "modules/auth/adapters/out/repositories/wall.repository";
import { IFeedRepository } from "modules/auth/adapters/out/repositories/feed.repository";

export class VerifyEmailCommand extends BaseCommand {
  requestDto: VerifyEmailRequest;
  constructor(requestDto: VerifyEmailRequest, session: ClientSession) {
    super(session);
    this.requestDto = requestDto;
  }
}
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailCommandHandler
  implements ICommandHandler<VerifyEmailCommand>
{
  constructor(
    @Inject("IUserRepository") private _userRepo: IUserRepository,
    @Inject("IWallRepository") private _wallRepo: IWallRepository,
    @Inject("IFeedRepository") private _feedRepo: IFeedRepository
  ) {}
  async execute(command: VerifyEmailCommand): Promise<void> {
    return;
  }
}
