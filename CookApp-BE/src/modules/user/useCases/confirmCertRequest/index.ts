import {
  BadRequestException,
  ConflictException,
  Inject,
  NotFoundException,
} from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { User } from "domains/social/user.domain";
import { BaseCommand } from "base/cqrs/command.base";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { ResponseDTO } from "base/dtos/response.dto";
import { UserErrorCode } from "enums/errorCode.enum";
import { ConfirmCertRequestDTO } from "./confirmCertRequest";
import { ICertificateRepository } from "modules/user/adapters/out/repositories/certificate.repository";
import { CertificateStatus } from "constants/certificate.constant";
import {
  CertConfimredEvent,
  CertRejectedEvent,
} from "domains/social/events/cert.event";

export class ConfirmCertCommand extends BaseCommand {
  req: ConfirmCertRequestDTO;
  constructor(tx: ITransaction, user: User, req: ConfirmCertRequestDTO) {
    super(tx, user);
    this.req = req;
  }
}

@CommandHandler(ConfirmCertCommand)
export class ConfirmCertUseCase implements ICommandHandler<ConfirmCertCommand> {
  constructor(
    @Inject("ICertificateRepository")
    private _certRepo: ICertificateRepository,
    private _eventBus: EventBus
  ) {}
  async execute(command: ConfirmCertCommand): Promise<void> {
    const { req } = command;
    const { certId, status, note } = req;

    const existedCert = await this._certRepo.getById(certId);

    if (!existedCert) {
      throw new NotFoundException(
        `Certificate not found`,
        UserErrorCode.CERTIFICATE_NOT_FOUND
      );
    }

    if (existedCert.isConfirmed()) {
      throw new ConflictException(
        ResponseDTO.fail(
          "Certficate already confirmed",
          UserErrorCode.CERTIFICATE_ALREADY_CONFIRMED
        )
      );
    }

    if (existedCert.isRejected())
      throw new NotFoundException(
        ResponseDTO.fail(
          "Certificate not found",
          UserErrorCode.CERTIFICATE_NOT_FOUND
        )
      );

    existedCert.takeNote(note);

    const confirmError = existedCert.confirm(status);

    if (confirmError) {
      throw new BadRequestException(ResponseDTO.fail("Status is not valid"));
    }

    await this._certRepo.updateCert(existedCert);
    switch (existedCert.status) {
      case CertificateStatus.CONFIRMED:
        this._eventBus.publish(new CertConfimredEvent(existedCert));
        break;
      case CertificateStatus.REJECTED:
        this._eventBus.publish(new CertRejectedEvent(existedCert));
        break;
    }
    return;
  }
}
