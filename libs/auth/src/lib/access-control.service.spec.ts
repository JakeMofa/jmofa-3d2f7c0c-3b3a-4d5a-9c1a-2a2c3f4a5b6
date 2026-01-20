import { AccessControlService, UserContext } from './access-control.service';
import { Role } from './roles';

describe('AccessControlService', () => {
  let service: AccessControlService;

  beforeEach(() => {
    service = new AccessControlService();
  });

  describe('getAccessibleOrgIds', () => {
    it('should return only user org for Viewer', () => {
      const user: UserContext = {
        id: '1',
        email: 'viewer@test.com',
        role: Role.VIEWER,
        orgId: 'org1',
      };

      const result = service.getAccessibleOrgIds(user, ['org2', 'org3']);
      expect(result).toEqual(['org1']);
    });

    it('should return user org and child orgs for Admin', () => {
      const user: UserContext = {
        id: '1',
        email: 'admin@test.com',
        role: Role.ADMIN,
        orgId: 'org1',
      };

      const result = service.getAccessibleOrgIds(user, ['org2', 'org3']);
      expect(result).toEqual(['org1', 'org2', 'org3']);
    });

    it('should return user org and child orgs for Owner', () => {
      const user: UserContext = {
        id: '1',
        email: 'owner@test.com',
        role: Role.OWNER,
        orgId: 'org1',
      };

      const result = service.getAccessibleOrgIds(user, ['org2', 'org3']);
      expect(result).toEqual(['org1', 'org2', 'org3']);
    });
  });

  describe('canAccessOrg', () => {
    it('should allow Viewer to access only their org', () => {
      const user: UserContext = {
        id: '1',
        email: 'viewer@test.com',
        role: Role.VIEWER,
        orgId: 'org1',
      };

      expect(service.canAccessOrg(user, 'org1', [])).toBe(true);
      expect(service.canAccessOrg(user, 'org2', [])).toBe(false);
    });

    it('should allow Admin to access their org and child orgs', () => {
      const user: UserContext = {
        id: '1',
        email: 'admin@test.com',
        role: Role.ADMIN,
        orgId: 'org1',
      };

      expect(service.canAccessOrg(user, 'org1', ['org2'])).toBe(true);
      expect(service.canAccessOrg(user, 'org2', ['org2'])).toBe(true);
      expect(service.canAccessOrg(user, 'org3', ['org2'])).toBe(false);
    });
  });

  describe('isResourceOwner', () => {
    it('should return true when user owns the resource', () => {
      const user: UserContext = {
        id: 'user1',
        email: 'test@test.com',
        role: Role.VIEWER,
        orgId: 'org1',
      };

      expect(service.isResourceOwner(user, 'user1')).toBe(true);
    });

    it('should return false when user does not own the resource', () => {
      const user: UserContext = {
        id: 'user1',
        email: 'test@test.com',
        role: Role.VIEWER,
        orgId: 'org1',
      };

      expect(service.isResourceOwner(user, 'user2')).toBe(false);
    });
  });
});
