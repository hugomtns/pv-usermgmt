import { CustomRole } from '@/types/role';
import { PermissionSet } from '@/types';

const fullAccess: PermissionSet = {
  create: true,
  read: true,
  update: true,
  delete: true,
};

const readOnly: PermissionSet = {
  create: false,
  read: true,
  update: false,
  delete: false,
};

const noAccess: PermissionSet = {
  create: false,
  read: false,
  update: false,
  delete: false,
};

export const seedRoles: CustomRole[] = [
  {
    id: 'role-admin',
    name: 'Admin',
    description: 'Full system access including user management',
    isSystem: true,
    permissions: {
      workspaces: fullAccess,
      projects: fullAccess,
      project_files: fullAccess,
      financial_models: fullAccess,
      designs: fullAccess,
      design_files: fullAccess,
      design_comments: fullAccess,
      user_management: fullAccess,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'role-user',
    name: 'User',
    description: 'Standard user access with full project permissions',
    isSystem: true,
    permissions: {
      workspaces: fullAccess,
      projects: fullAccess,
      project_files: fullAccess,
      financial_models: fullAccess,
      designs: fullAccess,
      design_files: fullAccess,
      design_comments: fullAccess,
      user_management: readOnly,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'role-viewer',
    name: 'Viewer',
    description: 'Read-only access to projects and files',
    isSystem: true,
    permissions: {
      workspaces: readOnly,
      projects: readOnly,
      project_files: readOnly,
      financial_models: readOnly,
      designs: readOnly,
      design_files: readOnly,
      design_comments: readOnly,
      user_management: noAccess,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
