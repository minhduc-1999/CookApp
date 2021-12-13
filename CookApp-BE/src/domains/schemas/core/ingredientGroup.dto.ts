import { AuditDTO } from "base/dtos/audit.dto";
import { Expose } from "class-transformer";

export class IngredientGroup extends AuditDTO {
  @Expose()
  name: string;
}
