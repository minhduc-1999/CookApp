import { BadRequestException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { UnfollowResponse } from "./followResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { IUserService } from "modules/auth/services/user.service";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { IFollowRepository } from "modules/user/interfaces/repositories/follow.interface";

export class UnfolllowCommand extends BaseCommand {
  targetId: string;
  constructor(user: User, targetId: string, tx: ITransaction) {
    super(tx, user);
    this.targetId = targetId;
  }
}

@CommandHandler(UnfolllowCommand)
export class UnfolllowCommandHandler
  implements ICommandHandler<UnfolllowCommand>
{
  constructor(
    @Inject("IFollowRepository")
    private _followRepo: IFollowRepository,
    @Inject("IUserService")
    private _userService: IUserService
  ) { }
  async execute(command: UnfolllowCommand): Promise<UnfollowResponse> {
    const { targetId, user, tx } = command;
    if (user.id === targetId) {
      throw new BadRequestException(
        ResponseDTO.fail("Cannot unfollow yourself")
      );
    }

    await this._userService.getUserById(targetId);

    const follow = await this._followRepo.getFollow(user.id, targetId);
    if (!follow)
      throw new BadRequestException(ResponseDTO.fail("Not follow yet"));
    this._followRepo.setTransaction(tx).deleteFollower(follow)
    return new UnfollowResponse();
  }
}
