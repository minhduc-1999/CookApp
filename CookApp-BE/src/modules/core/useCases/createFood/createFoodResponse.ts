import { ApiResponseProperty } from "@nestjs/swagger";

export class CreateFoodResponse {
  @ApiResponseProperty({type: String})
  id: string

  constructor(id: string) {
    this.id = id
  }
}
