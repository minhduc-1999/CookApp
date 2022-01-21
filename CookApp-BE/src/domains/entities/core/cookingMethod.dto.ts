import { AuditDTO } from "base/dtos/audit.dto";
import { Expose } from "class-transformer";

export class CookingMethod extends AuditDTO {
  @Expose()
  name: string;
}
