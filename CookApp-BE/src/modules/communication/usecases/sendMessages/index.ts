import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { User } from "domains/social/user.domain";
import { SendMessageRequest } from "./sendMessageRequest";

export class SendMessageCommand extends BaseCommand {
  commentReq: SendMessageRequest;
  constructor(
    user: User,
    request: SendMessageRequest,
    // tx: Transaction
  ) {
    super(null, user);
    this.commentReq = request;
  }
}

@CommandHandler(SendMessageCommand)
export class SendMessageCommandHandler
  implements ICommandHandler<SendMessageCommand>
{
  constructor(
  ) { }
  async execute(command: SendMessageCommand): Promise<void> {
    //Check conversation existed
    //
    //Check if user in conversation
    //
    //Send message
  }
}
