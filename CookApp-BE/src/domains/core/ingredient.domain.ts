import { Audit } from "../../domains/audit.domain";

export class Ingredient extends Audit {
  name: string;

  quantity: number

  unit: string

  constructor(obj: Partial<Ingredient>) {
    super(obj)
    this.name = obj?.name
    this.quantity = obj?.quantity
    this.unit = obj?.unit
  }
}
