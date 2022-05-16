import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { Role } from "domains/social/account.domain";
import { RoleEntity } from "entities/social/account.entity";
import { RoleType } from "enums/system.enum";
import { Repository } from "typeorm";

export interface IRoleRepository {
  setTransaction(tx: ITransaction): IRoleRepository;
  getRole(slug: RoleType): Promise<Role>;
  getRoles(opt: PageOptionsDto): Promise<[Role[], number]>;
}

@Injectable()
export class RoleRepository extends BaseRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private _repo: Repository<RoleEntity>
  ) {
    super();
  }
  async getRoles(opt: PageOptionsDto): Promise<[Role[], number]> {
    const [roles, total] = await this._repo.findAndCount({
      skip: opt.limit * opt.offset,
      take: opt.limit,
    });
    return [roles.map((role) => role.toDomain()), total];
  }

  async getRole(sign: RoleType): Promise<Role> {
    const role = await this._repo.findOne({
      where: { sign },
    });
    return role?.toDomain();
  }
}
