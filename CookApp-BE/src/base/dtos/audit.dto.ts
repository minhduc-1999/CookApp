import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsMongoId } from "class-validator";
import _ = require("lodash");

export class AuditDTO {
  @IsMongoId()
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @Exclude()
  createdBy: string;

  @Expose()
  @ApiResponseProperty({ type: Number })
  createdAt: number;

  @Expose()
  @ApiResponseProperty({ type: Number })
  updatedAt: number;

  @Exclude()
  updatedBy: string;

  @Exclude()
  deletedAt?: number;

  @Exclude()
  deletedBy?: string;

  create(userId: string) {
    this.updatedAt = _.now();
    this.createdAt = _.now();
    this.createdBy = userId;
    this.updatedBy = userId;
  }

  update(userId: string) {
    this.updatedBy = userId;
    this.updatedAt = _.now();
  }

  delete(userId: string) {
    this.deletedAt = _.now();
    this.deletedBy = userId;
  }
}
