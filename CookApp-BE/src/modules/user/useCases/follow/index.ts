import { BadRequestException, Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { FollowResponse } from "./followResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { IUserService } from "modules/auth/services/user.service";
import { NewFollowerEvent } from "modules/notification/events/NewFollowerNotification";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { IFollowRepository } from "modules/user/interfaces/repositories/follow.interface";

export class FollowCommand extends BaseCommand {
  targetId: string;
  constructor(user: User, targetId: string, tx: ITransaction) {
    super(tx, user);
    this.targetId = targetId;
  }
}

@CommandHandler(FollowCommand)
export class FollowCommandHandler implements ICommandHandler<FollowCommand> {
  constructor(
    @Inject("IFollowRepository")
    private _followRepo: IFollowRepository,
    private _eventBus: EventBus,
    @Inject("IUserService")
    private _userService: IUserService
  ) { }
  async execute(command: FollowCommand): Promise<FollowResponse> {
    const { targetId, user, tx } = command;
    if (user.id === targetId) {
      throw new BadRequestException(ResponseDTO.fail("Cannot follow yourself"));
    }

    const target = await this._userService.getUserById(targetId);

    const isFollowed = await this._followRepo.setTransaction(tx).getFollow(user.id, targetId);

    if (isFollowed)
      throw new BadRequestException(ResponseDTO.fail("Already follow"));
    this._followRepo.setTransaction(tx).createFollower(user.follow(target))
    this._eventBus.publish(new NewFollowerEvent(user, target));
    return new FollowResponse();
  }
}
