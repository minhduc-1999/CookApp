import { AuditDTO } from "base/dtos/audit.dto";
import { Expose } from "class-transformer";

export class FoodGroup extends AuditDTO {
  @Expose()
  name: string;
}
