import { Audit } from "domains/audit.domain";
import { Expose } from "class-transformer";

export class UnitDTO extends Audit {
    @Expose()
    name: string
}
