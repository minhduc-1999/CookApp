import { Audit } from "domains/audit.domain";
import { Expose } from "class-transformer";

export class IngredientDTO extends Audit {
  @Expose()
  name: string;
  @Expose()
  group: string;
  @Expose()
  images: string[];
}
