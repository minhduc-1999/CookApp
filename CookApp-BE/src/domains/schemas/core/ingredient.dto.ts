import { AuditDTO } from "base/dtos/audit.dto";
import { Expose } from "class-transformer";

export class Ingredient extends AuditDTO {
  @Expose()
  name: string;
  @Expose()
  group: string;
  @Expose()
  images: string[];
}
