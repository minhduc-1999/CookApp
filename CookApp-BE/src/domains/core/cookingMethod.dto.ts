import { Audit } from "domains/audit.domain";
import { Expose } from "class-transformer";

export class CookingMethodDTO extends Audit {
  @Expose()
  name: string;
}
