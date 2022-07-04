import { Injectable } from "@nestjs/common";
import { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseCommand } from "base/cqrs/command.base";
import { User } from "domains/social/user.domain";
import { SendRequestRequestDTO } from "./sendRequest.request";

export class SendRequestCommand extends BaseCommand implements ICommand {
  requestDto: SendRequestRequestDTO;
  user: User;

  constructor(user: User, dto: SendRequestRequestDTO, tx: ITransaction) {
    super(tx, user);
    this.requestDto = dto;
  }
}

@Injectable()
export class SendRequestUseCase implements ICommandHandler<SendRequestCommand> {
  constructor() {}
  execute(command: SendRequestCommand): Promise<any> {
    console.log("herhe");
    return null;
  }
}
