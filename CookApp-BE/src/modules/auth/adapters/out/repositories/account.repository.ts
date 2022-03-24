import { Injectable } from "@nestjs/common";
import { BaseRepository } from "base/repository.base";
import { Account } from "domains/social/account.domain";
import { User } from "domains/social/user.domain";
import { AccountEntity } from "entities/social/account.entity";
import { TypeormException } from "exception_filter/postgresException.filter";
import { IAccountRepository } from "modules/auth/interfaces/repositories/account.interface";
import { QueryFailedError, QueryRunner } from "typeorm";

@Injectable()
export class AccountRepository extends BaseRepository implements IAccountRepository {
  constructor(
  ) {
    super()
  }
  async createAccount(account: Account, user: User): Promise<Account> {
    let acc = new AccountEntity(account, user)
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      try {
        await queryRunner.manager.save<AccountEntity>(acc)
      } catch (err) {
        if (err instanceof QueryFailedError)
          throw new TypeormException(err)
        throw err
      }
    } else {
      //TODO
    }
    return acc.toDomain()
  }

}

