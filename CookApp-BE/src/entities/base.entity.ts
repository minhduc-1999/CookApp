import { Audit } from "domains/audit.domain"
import { Node } from "neo4j-driver"

export abstract class AuditEntity {
  static toDomain(node: Node): Audit {
    const { properties } = node
    const audit = new Audit({
      id: properties["id"],
      createdAt: properties["createdAt"],
      updatedAt: properties["updatedAt"],
      updatedBy: properties["updatedBy"],
    })
    return audit
  }
}
