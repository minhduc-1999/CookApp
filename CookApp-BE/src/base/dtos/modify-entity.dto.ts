import { ApiProperty } from '@nestjs/swagger';
import { ModifyEntity } from '../entities/modify-entity.base';
import { AbstractDTO } from './entity.dto';

export class ModifyDTO extends AbstractDTO {
  @ApiProperty({
    type: 'boolean',
  })
  isArchived: boolean;
  @ApiProperty({
    type: 'number',
  })
  archivedAt: number;
  @ApiProperty({
    type: 'number',
  })
  archivedBy: number;
  @ApiProperty({
    type: 'boolean',
  })
  isDeleted: boolean;
  @ApiProperty({
    type: 'number',
  })
  deletedAt: number;
  @ApiProperty({
    type: 'number',
  })
  deletedBy: number;

  constructor(entity: ModifyEntity) {
    super(entity);
    this.isArchived = entity.isArchived;
    this.archivedAt = entity.archivedAt;
    this.archivedBy = entity.archivedBy;
    this.isDeleted = entity.isDeleted;
    this.deletedAt = entity.deletedAt;
    this.deletedBy = entity.deletedBy;
  }
}
