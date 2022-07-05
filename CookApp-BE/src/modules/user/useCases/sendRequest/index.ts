import { BadRequestException, ConflictException, Inject } from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseCommand } from "base/cqrs/command.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { CertificateStatus } from "constants/certificate.constant";
import { RequestStatus } from "constants/request.constant";
import { Request } from "domains/social/request.domain";
import { User } from "domains/social/user.domain";
import { UserErrorCode } from "enums/errorCode.enum";
import { ICertificateRepository } from "modules/user/adapters/out/repositories/certificate.repository";
import { IRequestResitory } from "modules/user/adapters/out/repositories/request.repository";
import { SendRequestRequestDTO } from "./sendRequest.request";
import { SendRequestResponseDTO } from "./sendRequest.response";

export class SendRequestCommand extends BaseCommand implements ICommand {
  requestDto: SendRequestRequestDTO;
  user: User;

  constructor(user: User, dto: SendRequestRequestDTO, tx: ITransaction) {
    super(tx, user);
    this.requestDto = dto;
  }
}

@CommandHandler(SendRequestCommand)
export class SendRequestUseCase implements ICommandHandler<SendRequestCommand> {
  constructor(
    @Inject("IRequestRepository")
    private _requestRepo: IRequestResitory,
    @Inject("ICertificateRepository")
    private _certRepo: ICertificateRepository
  ) {}
  async execute(command: SendRequestCommand): Promise<SendRequestResponseDTO> {
    const { requestDto, user } = command;
    const { certs } = requestDto;

    const existedWaitingRequests = await this._requestRepo.getRequests(user, [
      RequestStatus.WAITING,
    ]);

    if (existedWaitingRequests.length > 0) {
      throw new ConflictException(
        ResponseDTO.fail(
          "Your request already existed",
          UserErrorCode.REQUEST_ALREADY_EXISTED
        )
      );
    }

    const newCertNumbers = certs.map((cert) => cert.number);
    const existedCerts = await this._certRepo.getByNumbers(newCertNumbers, [
      CertificateStatus.CONFIRMED,
      CertificateStatus.WAITING,
    ]);

    const existedWaitingCerts = existedCerts.filter((c) => c.isWaiting());
    const existedWaitingCertNumbers = existedWaitingCerts.map((c) => c.id);
    const existedConfirmedCertNumbers = existedCerts
      .filter((cert) => cert.isConfirmed())
      .map((c) => c.id);

    const relatedCerts = certs
      .filter(
        (cert) =>
          !existedConfirmedCertNumbers.includes(cert.number) &&
          !existedWaitingCertNumbers.includes(cert.number)
      )
      .map((c) => c.toDomain())
      .concat(existedWaitingCerts);

    if (relatedCerts.length === 0) {
      throw new BadRequestException(
        ResponseDTO.fail("Your certificates is not valid")
      );
    }

    const newRequest = Request.createRequest(user, relatedCerts);

    const savedRequest = await this._requestRepo.createRequest(newRequest);

    return new SendRequestResponseDTO(savedRequest.id);
  }
}
