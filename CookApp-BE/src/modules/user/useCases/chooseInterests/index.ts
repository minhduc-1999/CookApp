import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { ChooseInterestsRequest } from "./chooseInterestsRequest";
import { ITopicRepository } from "modules/user/adapters/out/repositories/topic.repository";
import { ChooseInterestsResponse } from "./chooseInterestsResponse";
import _ = require("lodash");

export class ChooseInterestsCommand extends BaseCommand {
  req: ChooseInterestsRequest;
  constructor(tx: ITransaction, user: User, req: ChooseInterestsRequest) {
    super(tx, user);
    this.req = req;
  }
}

@CommandHandler(ChooseInterestsCommand)
export class ChooseInterestsCommandHandler
  implements ICommandHandler<ChooseInterestsCommand>
{
  constructor(
    @Inject("ITopicRepository")
    private _topicRepo: ITopicRepository
  ) {}
  async execute(
    command: ChooseInterestsCommand
  ): Promise<ChooseInterestsResponse> {
    const { user, req, tx } = command;

    const reqTopics = await this._topicRepo.getTopicsByIds(req.topicIds);
    const interests = await this._topicRepo.getInterestTopics(user);

    const newInterests = _.differenceBy(reqTopics, interests, "id");

    if (newInterests.length > 0)
      await this._topicRepo
        .setTransaction(tx)
        .insertUserTopic(user, newInterests);

    const unInterests = _.differenceBy(interests, reqTopics, "id");

    if (unInterests.length > 0)
      await this._topicRepo.setTransaction(tx).deleteUserTopic(user, unInterests);

    const wrongIds = req.topicIds.filter((id) => {
      const index = _.findIndex(reqTopics, (topic) => topic.id === id);
      return index === -1;
    });

    return new ChooseInterestsResponse(wrongIds);
  }
}
