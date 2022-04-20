export class Audit {
  id: string;

  createdAt: Date;

  updatedAt?: Date;

  deletedAt?: Date;

  constructor(audit: Partial<Audit>) {
    this.createdAt = audit?.createdAt 
    this.id = audit?.id
    this.updatedAt = audit?.updatedAt
    this.deletedAt = audit?.deletedAt
  }
}
