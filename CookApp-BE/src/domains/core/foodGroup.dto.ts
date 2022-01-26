import { Audit } from "domains/audit.domain";
import { Expose } from "class-transformer";

export class FoodGroupDTO extends Audit {
  @Expose()
  name: string;
}
