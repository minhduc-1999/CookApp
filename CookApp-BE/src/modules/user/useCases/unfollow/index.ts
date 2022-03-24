import { BadRequestException, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { UnfollowResponse } from "./followResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { IUserService } from "modules/auth/services/user.service";
import { IWallRepository } from "modules/user/interfaces/repositories/wall.interface";
import { ITransaction } from "adapters/typeormTransaction.adapter";

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
    @Inject("IWallRepository")
    private _wallRepo: IWallRepository,
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

    const isFollowed = await this._wallRepo.isFollowed(user.id, targetId);
    if (!isFollowed)
      throw new BadRequestException(ResponseDTO.fail("Not follow yet"));
    this._wallRepo.setTransaction(tx).deleteFollower(user.id, targetId)
    return new UnfollowResponse();
  }
}
