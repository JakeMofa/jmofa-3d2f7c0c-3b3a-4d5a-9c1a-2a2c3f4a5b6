import { Injectable } from '@nestjs/common';
import { Role } from './roles';

export interface UserContext {
  id: string;
  email: string;
  role: Role;
  orgId: string;
}

@Injectable()
export class AccessControlService {
  /**
   * Get list of organization IDs that a user can access
   * - Viewer: only their own org
   * - Admin: their org + child orgs
   * - Owner: their org + child orgs
   */
  getAccessibleOrgIds(
    user: UserContext,
    childOrgIds: string[] = [],
  ): string[] {
    if (user.role === Role.VIEWER) {
      return [user.orgId];
    }

    // Admin and Owner can access their org and child orgs
    return [user.orgId, ...childOrgIds];
  }

  /**
   * Check if user can access a specific org
   */
  canAccessOrg(
    user: UserContext,
    targetOrgId: string,
    childOrgIds: string[] = [],
  ): boolean {
    const accessibleOrgs = this.getAccessibleOrgIds(user, childOrgIds);
    return accessibleOrgs.includes(targetOrgId);
  }

  /**
   * Check if user owns a resource (created by them)
   */
  isResourceOwner(user: UserContext, resourceOwnerId: string): boolean {
    return user.id === resourceOwnerId;
  }
}
