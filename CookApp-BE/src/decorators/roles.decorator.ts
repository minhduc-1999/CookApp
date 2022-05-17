import { SetMetadata } from '@nestjs/common';
import { PermisstionType, RoleType } from 'enums/system.enum';

export const RequireRoles = (...roles: RoleType[]) => SetMetadata('roles', roles);

export const RequirePermissions = (...permissions: PermisstionType[]) => SetMetadata("permissions", permissions)
