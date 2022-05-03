import { SetMetadata } from '@nestjs/common';
import { RoleType } from 'enums/system.enum';

export const RequireRoles = (...roles: RoleType[]) => SetMetadata('roles', roles);
