import { getEntityManagerOrTransactionManager } from 'typeorm-transactional-cls-hooked';

export class TransactionService {
  static async rollback(connectionName?: string) {
    const entityManager = getEntityManagerOrTransactionManager(
      connectionName || 'default',
      null,
    );
    if (
      entityManager &&
      entityManager.queryRunner &&
      entityManager.queryRunner.isTransactionActive
    ) {
      entityManager.queryRunner.rollbackTransaction();
    }
  }
}
