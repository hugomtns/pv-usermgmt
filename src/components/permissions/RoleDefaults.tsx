import { Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { defaultRolePermissions } from '@/data/defaultPermissions';
import { EntityType, PermissionSet } from '@/types';
import './RoleDefaults.css';

interface EntityHierarchy {
  type: EntityType;
  label: string;
  level: number;
}

const entityHierarchy: EntityHierarchy[] = [
  { type: 'projects', label: 'Projects', level: 0 },
  { type: 'project_files', label: 'Project Files', level: 1 },
  { type: 'financial_models', label: 'Financial Models', level: 1 },
  { type: 'designs', label: 'Designs', level: 1 },
  { type: 'design_files', label: 'Design Files', level: 2 },
  { type: 'design_comments', label: 'Design Comments', level: 2 },
  { type: 'user_management', label: 'User Management', level: 0 },
];

function PermissionIcon({ granted }: { granted: boolean }) {
  if (granted) {
    return <Check size={16} strokeWidth={2} className="role-defaults__icon role-defaults__icon--granted" />;
  }
  return <X size={16} strokeWidth={2} className="role-defaults__icon role-defaults__icon--denied" />;
}

function PermissionCell({ permissions }: { permissions: PermissionSet }) {
  return (
    <div className="role-defaults__permissions">
      <span className="role-defaults__permission">
        <PermissionIcon granted={permissions.create} />
        C
      </span>
      <span className="role-defaults__permission">
        <PermissionIcon granted={permissions.read} />
        R
      </span>
      <span className="role-defaults__permission">
        <PermissionIcon granted={permissions.update} />
        U
      </span>
      <span className="role-defaults__permission">
        <PermissionIcon granted={permissions.delete} />
        D
      </span>
    </div>
  );
}

export function RoleDefaults() {
  const getPermissionsForRole = (role: 'admin' | 'user' | 'viewer', entityType: EntityType): PermissionSet => {
    const rolePerms = defaultRolePermissions.find(rp => rp.role === role);
    if (!rolePerms) {
      return { create: false, read: false, update: false, delete: false };
    }
    return rolePerms.permissions[entityType] ?? { create: false, read: false, update: false, delete: false };
  };

  return (
    <Card className="role-defaults">
      <CardHeader>
        <CardTitle>Default Role Permissions</CardTitle>
        <CardDescription>
          Baseline CRUD permissions for each role across all entity types
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="role-defaults__table-wrapper">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="role-defaults__entity-header">Entity Type</TableHead>
                <TableHead className="role-defaults__role-header">Admin</TableHead>
                <TableHead className="role-defaults__role-header">User</TableHead>
                <TableHead className="role-defaults__role-header">Viewer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entityHierarchy.map((entity) => (
                <TableRow key={entity.type}>
                  <TableCell
                    className="role-defaults__entity-cell"
                    style={{ paddingLeft: `calc(var(--space-4) + ${entity.level * 24}px)` }}
                  >
                    <span
                      className={`role-defaults__entity-label ${
                        entity.level > 0 ? 'role-defaults__entity-label--child' : ''
                      }`}
                    >
                      {entity.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <PermissionCell permissions={getPermissionsForRole('admin', entity.type)} />
                  </TableCell>
                  <TableCell>
                    <PermissionCell permissions={getPermissionsForRole('user', entity.type)} />
                  </TableCell>
                  <TableCell>
                    <PermissionCell permissions={getPermissionsForRole('viewer', entity.type)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="role-defaults__legend">
          <h4 className="role-defaults__legend-title">Legend</h4>
          <div className="role-defaults__legend-items">
            <div className="role-defaults__legend-item">
              <Check size={16} strokeWidth={2} className="role-defaults__icon role-defaults__icon--granted" />
              Granted
            </div>
            <div className="role-defaults__legend-item">
              <X size={16} strokeWidth={2} className="role-defaults__icon role-defaults__icon--denied" />
              Denied
            </div>
            <div className="role-defaults__legend-item">
              <strong>C</strong> Create • <strong>R</strong> Read • <strong>U</strong> Update • <strong>D</strong> Delete
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
