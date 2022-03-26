import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { IPostService } from "modules/user/services/post.service";
import { ReactRequest } from "./reactRequest";
import { BaseCommand } from "base/cqrs/command.base";
import { ReactResponse } from "./reactResponse";
import { ResponseDTO } from "base/dtos/response.dto";
import { ReactPostEvent } from "modules/notification/events/ReactNotification";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { InteractiveTargetType } from "enums/social.enum";
import { IReactionRepository } from "modules/user/interfaces/repositories/reaction.interface";
import { IPostMediaRepository } from "modules/user/interfaces/repositories/postMedia.interface";
import { IInteractable } from "domains/interfaces/IInteractable.interface";
import { Post } from "domains/social/post.domain";
export class ReactCommand extends BaseCommand {
  reactReq: ReactRequest;
  constructor(
    tx: ITransaction,
    user: User,
    reactReq: ReactRequest
  ) {
    super(tx, user);
    this.reactReq = reactReq;
  }
}

@CommandHandler(ReactCommand)
export class ReactCommandHandler
  implements ICommandHandler<ReactCommand>
{
  constructor(
    @Inject("IPostService")
    private _postService: IPostService,
    @Inject("IPostMediaRepository")
    private _postMediaRepo: IPostMediaRepository,
    private _eventBus: EventBus,
    @Inject("IReactionRepository")
    private _reactionRepo: IReactionRepository
  ) { }
  async execute(command: ReactCommand): Promise<ReactResponse> {
    const { user, reactReq, tx } = command;

    let eventCallback: () => void
    let target: IInteractable

    switch (reactReq.targetType) {
      case InteractiveTargetType.POST:
        [target] = await this._postService.getPostDetail(reactReq.targetKeyOrID);
        eventCallback = () => {
          this._eventBus.publish(new ReactPostEvent(target as Post, user));
        }
        break;
      case InteractiveTargetType.POST_MEDIA:
        target = await this._postMediaRepo.getMedia(reactReq.targetKeyOrID)
        if (!target) {
          throw new NotFoundException(
            ResponseDTO.fail("Media not found")
          );
        }
        break;
      default:
        throw new BadRequestException(ResponseDTO.fail("Target type not valid"))
    }
    const existedReaction = await this._reactionRepo.findById(user.id, target.id);

    let reacted: boolean;

    if (existedReaction && existedReaction.type === reactReq.react) {
      await this._reactionRepo.setTransaction(tx).delete(existedReaction)
      reacted = false;
    } else {
      const newReaction = user.react(target, reactReq.react)
      await this._reactionRepo.setTransaction(tx).create(newReaction)
      reacted = true;
    }

    if (reacted) {
      eventCallback && eventCallback()
    }

    return new ReactResponse(reacted);
  }
}
