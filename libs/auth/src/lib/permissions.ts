import { Role } from './roles';

export type Action = 'create' | 'read' | 'update' | 'delete';
export type Resource = 'task' | 'audit-log';
export type Permission = `${Resource}:${Action}`;

// Define what each role can do
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.VIEWER]: [
    'task:read',
  ],
  [Role.ADMIN]: [
    'task:create',
    'task:read',
    'task:update',
    'task:delete',
    'audit-log:read',
  ],
  [Role.OWNER]: [
    'task:create',
    'task:read',
    'task:update',
    'task:delete',
    'audit-log:read',
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}
