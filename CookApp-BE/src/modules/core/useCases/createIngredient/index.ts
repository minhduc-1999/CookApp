import {
  ConflictException,
  Inject,
  InternalServerErrorException,
} from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { CreateIngredientRequest } from "./createIngredientRequest";
import { Ingredient } from "domains/core/ingredient.domain";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { IIngredientRepository } from "modules/core/adapters/out/repositories/ingredient.repository";

export class CreateIngredientCommand extends BaseCommand {
  req: CreateIngredientRequest;
  constructor(user: User, req: CreateIngredientRequest, tx: ITransaction) {
    super(tx, user);
    this.req = req;
  }
}

@CommandHandler(CreateIngredientCommand)
export class CreateIngredientCommandHandler
  implements ICommandHandler<CreateIngredientCommand>
{
  constructor(
    @Inject("IIngredientRepository")
    private _ingredientRepo: IIngredientRepository
  ) {}
  async execute(command: CreateIngredientCommand): Promise<void> {
    const { req, tx } = command;

    const newIngredient = new Ingredient({
      name: req.name,
    });

    try {
      await this._ingredientRepo.setTransaction(tx).insertIngredient(newIngredient);
    } catch (err) {
      if (err.code === "23505")
        throw new ConflictException(
          ResponseDTO.fail(
            "Ingredient already existed",
            UserErrorCode.INGREDIENT_ALREADY_EXISTED
          )
        );
      throw new InternalServerErrorException();
    }
    return;
  }
}
