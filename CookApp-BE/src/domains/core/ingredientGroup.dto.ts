import { Audit } from "domains/audit.domain";
import { Expose } from "class-transformer";

export class IngredientGroupDTO extends Audit {
  @Expose()
  name: string;
}
