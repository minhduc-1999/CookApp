import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { IFoodVoteRepository } from "modules/core/adapters/out/repositories/foodVote.repository";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
import { EditVoteRequest } from "./editVoteRequest";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { loadUpdateData } from "utils";

export class EditVoteCommand extends BaseCommand {
  req: EditVoteRequest;
  constructor(tx: ITransaction, user: User, req: EditVoteRequest) {
    super(tx, user);
    this.req = req;
  }
}

@CommandHandler(EditVoteCommand)
export class EditVoteCommandHandler
  implements ICommandHandler<EditVoteCommand>
{
  constructor(
    @Inject("IFoodVoteRepository")
    private _foodVoteRepo: IFoodVoteRepository,
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository
  ) {}
  async execute(command: EditVoteCommand): Promise<void> {
    const { user, tx, req } = command;
    const food = await this._foodRepo.getById(req.foodId);
    if (!food)
      throw new NotFoundException(
        ResponseDTO.fail("Food not found", UserErrorCode.FOOD_NOT_FOUND)
      );

    const vote = await this._foodVoteRepo.findVote(user, food);

    if (!vote)
      throw new NotFoundException(
        ResponseDTO.fail("Vote not found", UserErrorCode.VOTE_NOT_FOUND)
      );

    const partialData = loadUpdateData(req, vote)
    await this._foodVoteRepo.setTransaction(tx).updateVote(vote, partialData);
    return;
  }
}
