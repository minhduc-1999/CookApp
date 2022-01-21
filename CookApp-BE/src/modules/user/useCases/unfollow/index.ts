import { BadRequestException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserDTO } from "dtos/social/user.dto";
import { UnfollowResponse } from "./followResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { IWallRepository } from "modules/user/adapters/out/repositories/wall.repository";
import { FollowType } from "enums/follow.enum";
import { ResponseDTO } from "base/dtos/response.dto";
import { IUserService } from "modules/auth/services/user.service";
import { Transaction } from "neo4j-driver";

export class UnfolllowCommand extends BaseCommand {
  targetId: string;
  constructor(user: UserDTO, targetId: string, tx: Transaction) {
    super(tx, user);
    this.targetId = targetId;
  }
}

@CommandHandler(UnfolllowCommand)
export class UnfolllowCommandHandler
  implements ICommandHandler<UnfolllowCommand>
{
  constructor(
    @Inject("IWallRepository")
    private _wallRepo: IWallRepository,
    @Inject("IUserService")
    private _userService: IUserService
  ) { }
  async execute(command: UnfolllowCommand): Promise<UnfollowResponse> {
    const { targetId, user } = command;
    if (user.id === targetId) {
      throw new BadRequestException(
        ResponseDTO.fail("Cannot unfollow yourself")
      );
    }

    await this._userService.getUserById(targetId);

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
