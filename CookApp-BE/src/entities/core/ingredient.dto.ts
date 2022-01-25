import { Audit } from "domains/audit.domain";
import { Expose } from "class-transformer";

export class Ingredient extends Audit {
  @Expose()
  name: string;
  @Expose()
  group: string;
  @Expose()
  images: string[];
}
