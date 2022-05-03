import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { UnitResponse } from "base/dtos/response.dto";
import { Unit } from "domains/core/ingredient.domain";

export class GetUnitsResponse {
  @ApiResponseProperty({ type: [UnitResponse] })
  units: UnitResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(units: Unit[], meta: PageMetadata) {
    this.units = units.map((unit) => new UnitResponse(unit));
    this.metadata = meta;
  }
}
