import { ExternalProviderType } from '../../enums/externalProvider.enum';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ExternalProvider } from '../../domains/social/account.domain';
import { AbstractEntity } from '../../base/entities/base.entity';
import { AccountEntity } from './account.entity';

@Entity({ name: 'providers' })
export class ProviderEntity extends AbstractEntity {
  @Column({
    type: "enum",
    enum: ExternalProviderType,
    name: "provider_type"
  })
  type: ExternalProviderType

  @Column({ name: "external_id" })
  externalID: string;

  @OneToOne(() => AccountEntity, account => account.externalProvider, { nullable: false })
  @JoinColumn({ name: "account_id" })
  account: AccountEntity

  constructor(provider: ExternalProvider) {
    super(provider)
    this.type = provider?.type
    this.externalID = provider?.externalID
  }

  toDomain(): ExternalProvider {
    return new ExternalProvider(this)
  }
}
