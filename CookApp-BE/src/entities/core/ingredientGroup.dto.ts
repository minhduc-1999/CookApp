import { Audit } from "domains/audit.domain";
import { Expose } from "class-transformer";

export class IngredientGroup extends Audit {
  @Expose()
  name: string;
}
