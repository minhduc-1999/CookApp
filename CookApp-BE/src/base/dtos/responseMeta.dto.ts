import { ErrorCode } from 'enums/error_code.enum';

export type Status = "success" | "failure";

export class MetaDTO {
  constructor(status: Status, message?: string, errorCode?: ErrorCode) {
    this.message = message;
    this.status = status;
    this.errorCode = errorCode
  }

  message?: string;

  status: Status;

  errorCode?: ErrorCode
}
export class ResponseMetaDTO {
  constructor(status: Status, message: string, errorCode?: ErrorCode) {
    this.meta = new MetaDTO(status, message, errorCode);
  }

  meta: MetaDTO;
}

