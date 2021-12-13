import { BadRequestException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserDTO } from "dtos/social/user.dto";
import { FollowResponse } from "./followResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { ClientSession } from "mongoose";
import { IWallRepository } from "modules/user/adapters/out/repositories/wall.repository";
import { FollowType } from "enums/follow.enum";
import { ResponseDTO } from "base/dtos/response.dto";

export class FollowCommand extends BaseCommand {
  targetId: string;
  constructor(user: UserDTO, targetId: string, session?: ClientSession) {
    super(session, user);
    this.targetId = targetId;
  }
}

@CommandHandler(FollowCommand)
export class FollowCommandHandler implements ICommandHandler<FollowCommand> {
  constructor(
    @Inject("IWallRepository")
    private _wallRepo: IWallRepository
  ) {}
  async execute(command: FollowCommand): Promise<FollowResponse> {
    const { targetId, user } = command;
    if (user.id === targetId) {
      throw new BadRequestException(ResponseDTO.fail("Cannot follow yourself"))
    }
    const isFollowed = await this._wallRepo.isFollowed(user.id, targetId);
    if (isFollowed)
      throw new BadRequestException(ResponseDTO.fail("Already follow"));
    const tasks = [];
    tasks.push(
      this._wallRepo.updateFollowing(user.id, targetId, FollowType.Follow),
      this._wallRepo.updateFollowers(targetId, user.id, FollowType.Follow)
    );
    return Promise.all(tasks).then(() => new FollowResponse());
  }
}
