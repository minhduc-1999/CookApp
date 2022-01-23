import { AuditDTO } from "base/dtos/audit.dto"
import { Node } from "neo4j-driver"

export abstract class AuditEntity {
  static toDomain(node: Node): AuditDTO {
    const { properties } = node
    const audit = new AuditDTO({
      id: properties["id"],
      createdAt: properties["createdAt"],
      updatedAt: properties["updatedAt"],
      updatedBy: properties["updatedBy"],
    })
    return audit
  }
}
