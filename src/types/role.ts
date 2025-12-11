import { EntityType } from './entity';
import { PermissionSet } from './permission';

export interface CustomRole {
  id: string;                    // e.g., 'role-admin', 'role-pm'
  name: string;                  // e.g., 'Admin', 'Project Manager'
  description: string;           // Human-readable description
  isSystem: boolean;             // true for admin/user/viewer (prevents deletion)
  permissions: Record<EntityType, PermissionSet>;  // All entity permissions
  createdAt: string;
  updatedAt: string;
}
