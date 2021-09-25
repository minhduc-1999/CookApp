// tslint:disable: max-classes-per-file
import {
  ObjectLiteral,
  QueryRunner,
  Repository as RepositoryTypeOrm,
  SelectQueryBuilder as SelectQueryBuilderTypeOrm,
} from 'typeorm';

export declare class SelectQueryBuilder<T> extends SelectQueryBuilderTypeOrm<
  T
> {
  fetchResults(): Promise<{
    meta: Meta;
    data: T[];
  }>;
  fetchRawResults(): Promise<{
    meta: Meta;
    data: T[];
  }>;
}

export declare class Meta {
  ok: boolean;
  limit?: number;
  offset?: number;
  total?: number;
}

export class Repository<T extends ObjectLiteral> extends RepositoryTypeOrm<T> {
  constructor() {
    super();
  }
  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<T> {
    const newCreateQueryBuilder = <SelectQueryBuilder<T>>(
      super.createQueryBuilder(alias, queryRunner)
    );
    const fetchResults = async (error, result?: [any, any]) => {
      const meta: Meta = { ok: true };
      let data = [];
      meta.ok = true;
      meta.limit = newCreateQueryBuilder.expressionMap.limit;
      meta.offset = newCreateQueryBuilder.expressionMap.offset;
      meta.total = 0;
      if (error) {
        console.error(error);
        meta.ok = false;
      } else {
        const [results, total] = result;
        meta.total = total;
        data = results;
      }
      return { meta, data };
    };

    newCreateQueryBuilder.fetchResults = async () => {
      let result;
      try {
        const data = await newCreateQueryBuilder.getManyAndCount();
        result = fetchResults(null, data);
      } catch (error) {
        result = fetchResults(error);
      }
      return result;
    };

    newCreateQueryBuilder.fetchRawResults = async () => {
      let result;
      try {
        const data: [any, any] = [
          await newCreateQueryBuilder.getRawMany(),
          await newCreateQueryBuilder.getCount(),
        ];
        result = fetchResults(null, data);
      } catch (error) {
        result = fetchResults(error);
      }
      return result;
    };
    return newCreateQueryBuilder;
  }
}
