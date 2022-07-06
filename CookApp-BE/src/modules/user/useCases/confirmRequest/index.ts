import {
  BadRequestException,
  ConflictException,
  Inject,
  NotFoundException,
} from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { ConfirmRequestDTO } from "./confirmRequest";
import { IRequestRepository } from "modules/user/adapters/out/repositories/request.repository";

export class ConfirmRequestCommand extends BaseCommand {
  req: ConfirmRequestDTO;
  constructor(tx: ITransaction, user: User, req: ConfirmRequestDTO) {
    super(tx, user);
    this.req = req;
  }
}

@CommandHandler(ConfirmRequestCommand)
export class ConfirmRequestUseCase
  implements ICommandHandler<ConfirmRequestCommand>
{
  constructor(
    @Inject("IRequestRepository")
    private _requestRepository: IRequestRepository
  ) {}
  async execute(command: ConfirmRequestCommand): Promise<void> {
    const { req } = command;
    const { requestId, status, note } = req;

    const existedRequest = await this._requestRepository.getById(requestId);

    if (!existedRequest) {
      throw new NotFoundException(
        `Request not found`,
        UserErrorCode.REQUEST_NOT_FOUND
      );
    }

    if (existedRequest.isConfirmed()) {
      throw new ConflictException(
        ResponseDTO.fail("Request already confirmed")
      );
    }

    if (existedRequest.isRejected())
      throw new NotFoundException(
        ResponseDTO.fail("Request not found", UserErrorCode.REQUEST_NOT_FOUND)
      );

    existedRequest.takeNote(note);
    const confirmError = existedRequest.confirm(status);

    if (confirmError) {
      throw new BadRequestException(ResponseDTO.fail(confirmError.message));
    }

    await this._requestRepository.updateRequest(existedRequest);
    return;
  }
}
