import { Audit } from "../../domains/audit.domain";
import { Image } from "../../domains/social/media.domain";
import { Unit } from "./unit.domain";

export class Ingredient extends Audit {
  name: string;

  cover?: Image;

  quantity: number

  unit: Unit

  constructor(obj: Partial<Ingredient>) {
    super(obj)
    this.name = obj?.name
    this.cover = obj?.cover
    this.quantity = obj?.quantity
    this.unit = obj?.unit
  }
}
