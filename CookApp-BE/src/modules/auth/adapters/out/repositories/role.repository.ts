import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseRepository } from "base/repository.base";
import { AccountRole } from "domains/social/account.domain";
import { AccountRoleEntity } from "entities/social/account.entity";
import { RoleType } from "enums/system.enum";
import { Repository } from "typeorm";

export interface IRoleRepository {
  setTransaction(tx: ITransaction): IRoleRepository;
  getRole(slug: RoleType): Promise<AccountRole>;
}

@Injectable()
export class RoleRepository extends BaseRepository implements IRoleRepository {
  constructor(
    @InjectRepository(AccountRoleEntity)
    private _repo: Repository<AccountRoleEntity>
  ) {
    super();
  }

  async getRole(slug: RoleType): Promise<AccountRole> {
    const role = await this._repo.findOne({
      where: { slug },
    });
    return role?.toDomain();
  }
}
