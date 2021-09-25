import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class IPageable {
  @ApiPropertyOptional()
  limit?: number;

  @ApiPropertyOptional()
  offset?: number;

  @ApiPropertyOptional()
  order?: {
    field: string;
    order: 'ASC' | 'DESC';
  };

  @ApiPropertyOptional()
  q?: string;
}

export const PageableFactory = <T>(_, ctx: ExecutionContext): T | IPageable => {
  const { query } = ctx.switchToHttp().getRequest();
  const pageable: T | IPageable = {
    limit: parseInt(process.env.LIMIT, 10),
    offset: 0,
  };
  if (!!query.limit && !Number.isNaN(query.limit)) {
    pageable.limit = query.limit;
  }
  if (!!query.page && !Number.isNaN(query.page)) {
    pageable.offset = (query.page - 1) * pageable.limit;
  }
  if (!!query.order && Array.isArray(query.order) && query.order.length === 2) {
    pageable.order = {
      field: query.order[0],
      order: query.order[1] === 'ascend' ? 'ASC' : 'DESC',
    };
  }
  if (!!query.q) {
    pageable.q = query.q;
  }
  return pageable;
};

export const Pageable = createParamDecorator(PageableFactory);
