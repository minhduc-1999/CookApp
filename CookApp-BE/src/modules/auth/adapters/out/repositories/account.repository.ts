import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "base/repository.base";
import { Account, Role } from "domains/social/account.domain";
import { User } from "domains/social/user.domain";
import { AccountEntity, RoleEntity } from "entities/social/account.entity";
import { TypeormException } from "exception_filter/postgresException.filter";
import { IAccountRepository } from "modules/auth/interfaces/repositories/account.interface";
import { QueryFailedError, QueryRunner, Repository } from "typeorm";

@Injectable()
export class AccountRepository
  extends BaseRepository
  implements IAccountRepository
{
  constructor(
    @InjectRepository(AccountEntity)
    private _repo: Repository<AccountEntity>
  ) {
    super();
  }
  async getAccountByUserId(id: string): Promise<Account> {
    const entity = await this._repo.findOne({
      where: {
        user: {
          id,
        },
      },
      relations: ["role"]
    });
    return entity?.toDomain();
  }

  async updateRole(account: Account, role: Role): Promise<void> {
    await this._repo.update(account.id, { role: new RoleEntity(role) });
  }

  async getAccountByReseToken(token: string): Promise<Account> {
    const entity = await this._repo.findOne({
      where: {
        resetPasswordToken: token,
      },
    });
    return entity?.toDomain();
  }

  async update(account: Account, data: Partial<Account>): Promise<Account> {
    let accountEntity = new AccountEntity(account);
    const updateData = accountEntity.update(data);
    const queryRunner = this.tx?.getRef() as QueryRunner;
    if (queryRunner && !queryRunner.isReleased) {
      await queryRunner.manager.update<AccountEntity>(
        AccountEntity,
        accountEntity.id,
        updateData
      );
    } else {
      await this._repo.update(accountEntity.id, updateData);
    }
    return accountEntity.toDomain();
  }
  async createAccount(account: Account, user: User): Promise<Account> {
    let accountEntity = new AccountEntity(account, user);
    const queryRunner = this.tx.getRef() as QueryRunner;
    if (queryRunner && !queryRunner.isReleased) {
      try {
        await queryRunner.manager.save<AccountEntity>(accountEntity);
      } catch (err) {
        if (err instanceof QueryFailedError) throw new TypeormException(err);
        throw err;
      }
    } else {
      accountEntity = null;
    }
    return accountEntity?.toDomain();
  }
}
