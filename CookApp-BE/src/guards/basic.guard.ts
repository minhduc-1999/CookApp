import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

export const BasicAuthGuard = NestAuthGuard('basic');
