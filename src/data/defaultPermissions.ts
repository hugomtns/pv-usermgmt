import { RolePermissions, PermissionSet } from '@/types';

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

export const defaultRolePermissions: RolePermissions[] = [
  {
    role: 'admin',
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
  },
  {
    role: 'user',
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
  },
  {
    role: 'viewer',
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
  },
];
