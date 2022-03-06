import { Audit } from "domains/audit.domain";

export class Ingredient extends Audit {
  name: string;

  group?: string;

  images?: string[];
}
