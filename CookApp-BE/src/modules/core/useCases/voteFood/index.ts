import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { VoteFoodRequest } from "./voteFoodRequest";
import { IFoodRepository } from "modules/core/adapters/out/repositories/food.repository";
import { Inject, NotFoundException } from "@nestjs/common";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { IFoodVoteRepository } from "modules/core/adapters/out/repositories/foodVote.repository";
import { FoodVote } from "domains/core/foodVote.domain";

export class VoteFoodCommand extends BaseCommand {
  req: VoteFoodRequest;
  constructor(
    tx: ITransaction,
    user: User,
    req: VoteFoodRequest
  ) {
    super(tx, user);
    this.req = req;
  }
}

@CommandHandler(VoteFoodCommand)
export class VoteFoodCommandHandler
  implements ICommandHandler<VoteFoodCommand>
{
  constructor(
    @Inject("IFoodRepository")
    private _foodRepo: IFoodRepository,
    @Inject("IFoodVoteRepository")
    private _foodVoteRepo: IFoodVoteRepository
  ) { }

  async execute(command: VoteFoodCommand): Promise<void> {
    const { user, req, tx } = command;

    const food = await this._foodRepo.getById(req.foodId)

    if (!food) {
      throw new NotFoundException(ResponseDTO.fail("Food not found", UserErrorCode.FOOD_NOT_FOUND))
    }

    //find existed vote
    const existedVote = await this._foodVoteRepo.findVote(user, food)
    if (!existedVote) {
      const vote = new FoodVote({
        author: user,
        food: food,
        star: req.star,
        comment: req.comment
      })
      await this._foodVoteRepo.setTransaction(tx).insertVote(vote)
    }
    //TODO: if vote existed??
    return
  }
}
