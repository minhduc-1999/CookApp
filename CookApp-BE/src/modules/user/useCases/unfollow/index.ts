import { BadRequestException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserDTO } from "dtos/social/user.dto";
import { UnfollowResponse } from "./followResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { ClientSession } from "mongoose";
import { IWallRepository } from "modules/user/adapters/out/repositories/wall.repository";
import { FollowType } from "enums/follow.enum";
import { ResponseDTO } from "base/dtos/response.dto";

export class UnfolllowCommand extends BaseCommand {
  targetId: string;
  constructor(user: UserDTO, targetId: string, session?: ClientSession) {
    super(session, user);
    this.targetId = targetId;
  }
}

@CommandHandler(UnfolllowCommand)
export class UnfolllowCommandHandler
  implements ICommandHandler<UnfolllowCommand>
{
  constructor(
    @Inject("IWallRepository")
    private _wallRepo: IWallRepository
  ) {}
  async execute(command: UnfolllowCommand): Promise<UnfollowResponse> {
    const { targetId, user } = command;
    if (user.id === targetId) {
      throw new BadRequestException(
        ResponseDTO.fail("Cannot unfollow yourself")
      );
    }
    const isFollowed = await this._wallRepo.isFollowed(user.id, targetId);
    if (!isFollowed)
      throw new BadRequestException(ResponseDTO.fail("Not follow yet"));
    const tasks = [];
    tasks.push(
      this._wallRepo.updateFollowing(user.id, targetId, FollowType.Unfollow),
      this._wallRepo.updateFollowers(targetId, user.id, FollowType.Unfollow)
    );
    return Promise.all(tasks).then(() => new UnfollowResponse());
  }
}
