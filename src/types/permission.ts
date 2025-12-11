import { Role } from './user';
import { EntityType } from './entity';

export type PermissionAction = 'create' | 'read' | 'update' | 'delete';

export type PermissionValue = boolean;

export interface PermissionSet {
  create: PermissionValue;
  read: PermissionValue;
  update: PermissionValue;
  delete: PermissionValue;
}

// Role-based default permissions (baseline)
export interface RolePermissions {
  role: Role;
  permissions: Record<EntityType, PermissionSet>;
}

// Group override - applies to ALL entities of a type OR specific entities
export interface GroupPermissionOverride {
  id: string;
  groupId: string;
  entityType: EntityType;
  scope: 'all' | 'specific';
  specificEntityIds: string[];  // Only used when scope === 'specific'
  permissions: Partial<PermissionSet>;  // Only overridden actions
}
