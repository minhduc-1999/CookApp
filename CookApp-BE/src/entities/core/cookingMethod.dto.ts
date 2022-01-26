import { Audit } from "domains/audit.domain";
import { Expose } from "class-transformer";

export class CookingMethod extends Audit {
  @Expose()
  name: string;
}
