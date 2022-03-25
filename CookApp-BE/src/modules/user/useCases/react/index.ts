import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { IPostService } from "modules/user/services/post.service";
import { ReactRequest } from "./reactRequest";
import { BaseCommand } from "base/cqrs/command.base";
import { ReactResponse } from "./reactResponse";
import { Reaction } from "domains/social/reaction.domain";
import { IMediaRepository } from "modules/user/interfaces/repositories/media.interface";
import { ResponseDTO } from "base/dtos/response.dto";
import { ReactPostEvent } from "modules/notification/events/ReactNotification";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { InteractiveTargetType, ReactionType } from "enums/social.enum";
import { IReactionRepository } from "modules/user/interfaces/repositories/reaction.interface";
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
    @Inject("IMediaRepository")
    private _mediaRepository: IMediaRepository,
    private _eventBus: EventBus,
    @Inject("IReactionRepository")
    private _reactionRepo: IReactionRepository
  ) { }
  async execute(command: ReactCommand): Promise<ReactResponse> {
    const { user, reactReq, tx } = command;

    let newReaction: Reaction
    let reacted: boolean;
    let existedReaction: Reaction
    let eventCallback: () => void

    switch (reactReq.targetType) {
      case InteractiveTargetType.POST:
        const [ post ] = await this._postService.getPostDetail(reactReq.targetKeyOrID);
        existedReaction = await this._reactionRepo.findById(
          user.id,
          post.id
        );
        newReaction = user.react(post, reactReq.react)
        eventCallback = () => {
          this._eventBus.publish(new ReactPostEvent(post, user));
        }
        break;
      case InteractiveTargetType.MEDIA:
        const media = await this._mediaRepository.getMedia(reactReq.targetKeyOrID)
        if (!media) {
          throw new NotFoundException(
            ResponseDTO.fail("Media not found")
          );
        }
        existedReaction = await this._reactionRepo.findById(user.id, media.id)
        newReaction = user.react(media, reactReq.react)
        break;
    }

    if (existedReaction && existedReaction.type === reactReq.react) {
      await this._reactionRepo.setTransaction(tx).delete(existedReaction)
      reacted = false;
    } else {
      await this._reactionRepo.setTransaction(tx).create(newReaction)
      reacted = true;
    }

    if (reacted) {
      eventCallback && eventCallback()
    }

    return new ReactResponse(reacted);
  }
}
