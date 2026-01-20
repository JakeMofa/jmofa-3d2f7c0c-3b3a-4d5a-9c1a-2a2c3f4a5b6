import { hasPermission, ROLE_PERMISSIONS } from './permissions';
import { Role } from './roles';

describe('Permissions', () => {
  describe('ROLE_PERMISSIONS', () => {
    it('should define Viewer with read-only task access', () => {
      const viewerPerms = ROLE_PERMISSIONS[Role.VIEWER];
      expect(viewerPerms).toContain('task:read');
      expect(viewerPerms).not.toContain('task:create');
      expect(viewerPerms).not.toContain('task:update');
      expect(viewerPerms).not.toContain('task:delete');
      expect(viewerPerms).not.toContain('audit-log:read');
    });

    it('should define Admin with full task CRUD and audit log access', () => {
      const adminPerms = ROLE_PERMISSIONS[Role.ADMIN];
      expect(adminPerms).toContain('task:create');
      expect(adminPerms).toContain('task:read');
      expect(adminPerms).toContain('task:update');
      expect(adminPerms).toContain('task:delete');
      expect(adminPerms).toContain('audit-log:read');
    });

    it('should define Owner with same permissions as Admin', () => {
      const ownerPerms = ROLE_PERMISSIONS[Role.OWNER];
      expect(ownerPerms).toContain('task:create');
      expect(ownerPerms).toContain('task:read');
      expect(ownerPerms).toContain('task:update');
      expect(ownerPerms).toContain('task:delete');
      expect(ownerPerms).toContain('audit-log:read');
    });
  });

  describe('hasPermission', () => {
    it('should return true when role has permission', () => {
      expect(hasPermission(Role.VIEWER, 'task:read')).toBe(true);
      expect(hasPermission(Role.ADMIN, 'task:create')).toBe(true);
      expect(hasPermission(Role.OWNER, 'audit-log:read')).toBe(true);
    });

    it('should return false when role does not have permission', () => {
      expect(hasPermission(Role.VIEWER, 'task:create')).toBe(false);
      expect(hasPermission(Role.VIEWER, 'audit-log:read')).toBe(false);
    });
  });
});
