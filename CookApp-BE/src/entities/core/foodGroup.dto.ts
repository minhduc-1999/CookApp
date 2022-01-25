import { Audit } from "domains/audit.domain";
import { Expose } from "class-transformer";

export class FoodGroup extends Audit {
  @Expose()
  name: string;
}
