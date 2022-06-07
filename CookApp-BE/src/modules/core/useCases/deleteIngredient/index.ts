import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseCommand } from "base/cqrs/command.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { IIngredientRepository } from "modules/core/adapters/out/repositories/ingredient.repository";

export class DeleteIngredientCommand extends BaseCommand {
  ingredientId: string;
  constructor(user: User, tx: ITransaction, ingredientId: string) {
    super(tx, user);
    this.ingredientId = ingredientId;
  }
}

@CommandHandler(DeleteIngredientCommand)
export class DeleteIngredientCommandHandler
  implements ICommandHandler<DeleteIngredientCommand>
{
  constructor(
    @Inject("IIngredientRepository")
    private _ingredientRepo: IIngredientRepository
  ) {}
  async execute(command: DeleteIngredientCommand): Promise<any> {
    const { ingredientId, tx } = command;
    const ingredient = await this._ingredientRepo.getById(ingredientId);
    if (!ingredient) {
      throw new NotFoundException(ResponseDTO.fail("Ingredient not found"));
    }
    await this._ingredientRepo.setTransaction(tx).deleteIngredient(ingredient);
  }
}
