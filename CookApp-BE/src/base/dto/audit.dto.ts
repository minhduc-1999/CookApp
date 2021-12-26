import { ApiResponseProperty } from "@nestjs/swagger";
import _ = require("lodash");

export class AuditDTO {
  @ApiResponseProperty({ type: String })
  id: string;

  @ApiResponseProperty({ type: Number })
  createdAt: number;

  @ApiResponseProperty({ type: Number })
  updatedAt: number;

  /**
   *
   */
  constructor(audit: AuditDTO) {
    this.id = audit.id;
    this.createdAt = audit.createdAt;
    this.updatedAt = audit.updatedAt;
  }
}
