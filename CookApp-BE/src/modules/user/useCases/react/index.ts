import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { IPostService } from "modules/user/services/post.service";
import { ReactRequest } from "./reactRequest";
import { BaseCommand } from "base/cqrs/command.base";
import { ReactResponse } from "./reactResponse";
import { Reaction } from "domains/social/reaction.domain";
import { Transaction } from "neo4j-driver";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { IReactionService } from "modules/user/services/reaction.service";
import { ReactionTargetType } from "enums/reactionTarget.enum";
import { IMediaRepository } from "modules/user/interfaces/repositories/media.interface";
import { ResponseDTO } from "base/dtos/response.dto";
import { ReactPostEvent } from "modules/notification/events/ReactNotification";
export class ReactCommand extends BaseCommand {
  reactReq: ReactRequest;
  constructor(
    tx: Transaction,
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
    @Inject("IPostRepository")
    private _postRepo: IPostRepository,
    @Inject("IReactionService")
    private _reactionService: IReactionService,
    @Inject("IMediaRepository")
    private _mediaRepository: IMediaRepository,
    private _eventBus: EventBus
  ) { }
  async execute(command: ReactCommand): Promise<ReactResponse> {
    const { user, reactReq, tx } = command;

    const reaction = new Reaction({
      type: reactReq.react,
      reactor: user,
    });

    let reacted: boolean;
    let existedReaction: Reaction
    let eventCallback: () => void

    switch (reactReq.targetType) {
      case ReactionTargetType.POST:
        const [ post ] = await this._postService.getPostDetail(reactReq.targetKeyOrID);
        reaction.setTarget(post)
        existedReaction = await this._postRepo.getReactionByUserId(
          user.id,
          reactReq.targetKeyOrID
        );
        eventCallback = () => {
          this._eventBus.publish(new ReactPostEvent(post, user));
        }
        break;
      case ReactionTargetType.MEDIA:
        const media = await this._mediaRepository.getMedia(reactReq.targetKeyOrID)
        if (!media) {
          throw new NotFoundException(
            ResponseDTO.fail("Media not found")
          );
        }
        reaction.setTarget(media)
        existedReaction = await this._mediaRepository.getReacitonByUserID(user.id, reactReq.targetKeyOrID)
        break;
    }

    if (existedReaction && existedReaction.type === reactReq.react) {
      await this._reactionService.unreact(reaction, tx)
      reacted = false;
    } else {
      await this._reactionService.react(reaction, tx)
      reacted = true;
    }

    if (reacted) {
      eventCallback && eventCallback()
    }

    return new ReactResponse(reacted);
  }
}
