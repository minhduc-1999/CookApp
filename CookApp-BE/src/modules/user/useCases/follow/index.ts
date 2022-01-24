import { BadRequestException, Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UserDTO } from "dtos/social/user.dto";
import { FollowResponse } from "./followResponse";
import { BaseCommand } from "base/cqrs/command.base";
import { IWallRepository } from "modules/user/adapters/out/repositories/wall.repository";
import { ResponseDTO } from "base/dtos/response.dto";
import { NewFollowerEvent } from "modules/notification/usecases/NewFollowerNotification";
import { IUserService } from "modules/auth/services/user.service";
import { Transaction } from "neo4j-driver";

export class FollowCommand extends BaseCommand {
  targetId: string;
  constructor(user: UserDTO, targetId: string, tx: Transaction) {
    super(tx, user);
    this.targetId = targetId;
  }
}

@CommandHandler(FollowCommand)
export class FollowCommandHandler implements ICommandHandler<FollowCommand> {
  constructor(
    @Inject("IWallRepository")
    private _wallRepo: IWallRepository,
    private _eventBus: EventBus,
    @Inject("IUserService")
    private _userService: IUserService
  ) { }
  async execute(command: FollowCommand): Promise<FollowResponse> {
    const { targetId, user, tx } = command;
    if (user.id === targetId) {
      throw new BadRequestException(ResponseDTO.fail("Cannot follow yourself"));
    }

    await this._userService.getUserById(targetId);

    const isFollowed = await this._wallRepo.setTransaction(tx).isFollowed(user.id, targetId);

    if (isFollowed)
      throw new BadRequestException(ResponseDTO.fail("Already follow"));
    this._wallRepo.setTransaction(tx).createFollower(user.id, targetId)
    // this._eventBus.publish(new NewFollowerEvent(user, targetId));
    return new FollowResponse();
  }
}
