import { EntityType } from './entity';

export type PermissionAction = 'create' | 'read' | 'update' | 'delete';

export type PermissionValue = boolean;

export interface PermissionSet {
  create: PermissionValue;
  read: PermissionValue;
  update: PermissionValue;
  delete: PermissionValue;
}

// Role-based default permissions (baseline) - DEPRECATED: Use CustomRole instead
export interface RolePermissions {
  role: string;  // Changed from Role type (no longer exists)
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
