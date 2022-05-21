import {
  ConflictException,
  Inject,
  InternalServerErrorException,
} from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Topic, User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { Image } from "domains/social/media.domain";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { CreateTopicRequest } from "./createTopicRequest";
import { CreateTopicResponse } from "./createTopicResponse";
import { MediaType } from "enums/social.enum";
import { ITopicRepository } from "modules/user/adapters/out/repositories/topic.repository";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";

export class CreateTopicCommand extends BaseCommand {
  req: CreateTopicRequest;
  constructor(user: User, req: CreateTopicRequest, tx: ITransaction) {
    super(tx, user);
    this.req = req;
  }
}

@CommandHandler(CreateTopicCommand)
export class CreateTopicCommandHandler
  implements ICommandHandler<CreateTopicCommand>
{
  constructor(
    @Inject("ITopicRepository")
    private _topicRepo: ITopicRepository,
    @Inject("IStorageService")
    private _storageService: IStorageService
  ) {}

  async execute(command: CreateTopicCommand): Promise<CreateTopicResponse> {
    const { req, tx } = command;

    if (req.cover) {
      [req.cover] = await this._storageService.makePublic(
        [req.cover],
        MediaType.IMAGE,
        "topic"
      );
    }

    const newTopic = new Topic({
      title: req.title,
      cover: new Image({
        key: req.cover,
      }),
    });

    try {
      await this._topicRepo.setTransaction(tx).insertNewTopic(newTopic);
    } catch (err) {
      if (err.code === "23505")
        throw new ConflictException(
          ResponseDTO.fail(
            "Topic already existed",
            UserErrorCode.TOPIC_ALREADY_EXISTED
          )
        );
      throw new InternalServerErrorException();
    }
    return new CreateTopicResponse();
  }
}
