import { Audit } from "../../domains/audit.domain";

export class Unit extends Audit {
  name: string

  constructor(unit: Partial<Unit>) {
    super(unit)
    this.name = unit?.name
  }
}
