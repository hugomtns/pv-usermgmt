import { User, EntityType, PermissionSet, GroupPermissionOverride } from '@/types';
import { CustomRole } from '@/types/role';

/**
 * Resolves the effective permissions for a user on a specific entity type
 *
 * Permission Resolution Logic:
 * 1. Start with ROLE DEFAULTS for the user's role
 * 2. Get all GROUPS the user belongs to
 * 3. For each group, check for OVERRIDES matching the entity type
 * 4. Apply overrides using UNION with HIGHEST PERMISSION WINS:
 *    - If any override grants 'create', user can create
 *    - If any override grants 'read', user can read
 *    - etc.
 * 5. Specific entity overrides take precedence over "all" overrides
 *
 * @param user - The user to resolve permissions for
 * @param entityType - The entity type to check permissions for
 * @param entityId - Optional specific entity ID for entity-level overrides
 * @param permissionOverrides - All permission overrides in the system
 * @param roles - All roles in the system
 * @returns The effective permission set for the user
 */
export function resolvePermissions(
  user: User,
  entityType: EntityType,
  entityId: string | undefined,
  permissionOverrides: GroupPermissionOverride[],
  roles: CustomRole[]
): PermissionSet {
  // Step 1: Get role defaults for user's role
  const userRole = roles.find(r => r.id === user.roleId);
  const basePermissions: PermissionSet = userRole?.permissions[entityType] ?? {
    create: false,
    read: false,
    update: false,
    delete: false,
  };

  // Step 2: Get all groups user belongs to
  const userGroups = user.groupIds;

  if (userGroups.length === 0) {
    // No groups = just role defaults
    return basePermissions;
  }

  // Step 3 & 4: Find overrides for those groups matching entityType and apply union logic
  const applicableOverrides = permissionOverrides.filter(
    override => userGroups.includes(override.groupId) && override.entityType === entityType
  );

  if (applicableOverrides.length === 0) {
    // No overrides = just role defaults
    return basePermissions;
  }

  // Step 5: Separate "all" overrides from specific entity overrides
  const allOverrides = applicableOverrides.filter(override => override.scope === 'all');
  const specificOverrides = entityId
    ? applicableOverrides.filter(
        override => override.scope === 'specific' && override.specificEntityIds.includes(entityId)
      )
    : [];

  // Start with base permissions
  const effectivePermissions: PermissionSet = { ...basePermissions };

  // Apply "all" overrides first
  allOverrides.forEach(override => {
    if (override.permissions.create !== undefined) {
      effectivePermissions.create = effectivePermissions.create || override.permissions.create;
    }
    if (override.permissions.read !== undefined) {
      effectivePermissions.read = effectivePermissions.read || override.permissions.read;
    }
    if (override.permissions.update !== undefined) {
      effectivePermissions.update = effectivePermissions.update || override.permissions.update;
    }
    if (override.permissions.delete !== undefined) {
      effectivePermissions.delete = effectivePermissions.delete || override.permissions.delete;
    }
  });

  // Apply specific entity overrides (these take precedence)
  specificOverrides.forEach(override => {
    if (override.permissions.create !== undefined) {
      effectivePermissions.create = override.permissions.create;
    }
    if (override.permissions.read !== undefined) {
      effectivePermissions.read = override.permissions.read;
    }
    if (override.permissions.update !== undefined) {
      effectivePermissions.update = override.permissions.update;
    }
    if (override.permissions.delete !== undefined) {
      effectivePermissions.delete = override.permissions.delete;
    }
  });

  return effectivePermissions;
}

/**
 * Resolves permissions for all entity types for a user
 *
 * @param user - The user to resolve permissions for
 * @param permissionOverrides - All permission overrides in the system
 * @param roles - All roles in the system
 * @returns A map of entity types to their effective permission sets
 */
export function resolveAllPermissions(
  user: User,
  permissionOverrides: GroupPermissionOverride[],
  roles: CustomRole[]
): Record<EntityType, PermissionSet> {
  const entityTypes: EntityType[] = [
    'projects',
    'project_files',
    'financial_models',
    'designs',
    'design_files',
    'design_comments',
    'user_management',
  ];

  const permissions: Record<string, PermissionSet> = {};

  entityTypes.forEach(entityType => {
    permissions[entityType] = resolvePermissions(user, entityType, undefined, permissionOverrides, roles);
  });

  return permissions as Record<EntityType, PermissionSet>;
}
