import { Audit } from "domains/audit.domain"
import { Node, Relationship } from "neo4j-driver"

export abstract class AuditEntity {
  static toDomain(nodeOrRelationship: Node | Relationship): Audit {
    const { properties } = nodeOrRelationship
    const audit = new Audit({
      id: properties["id"],
      createdAt: properties["createdAt"],
      updatedAt: properties["updatedAt"],
      updatedBy: properties["updatedBy"],
    })
    return audit
  }
}
