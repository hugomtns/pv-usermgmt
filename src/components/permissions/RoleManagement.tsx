import { Shield, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { CustomRole } from '@/types/role';
import './RoleManagement.css';

interface RoleManagementProps {
  onCreateRole?: () => void;
  onEditRole?: (role: CustomRole) => void;
  onDeleteRole?: (role: CustomRole) => void;
}

export function RoleManagement({ onCreateRole, onEditRole, onDeleteRole }: RoleManagementProps) {
  const { state } = useApp();

  const getPermissionSummary = (role: CustomRole): string => {
    const allPermissions = Object.values(role.permissions).flatMap(permSet =>
      Object.values(permSet)
    );
    const grantedCount = allPermissions.filter(p => p === true).length;
    const totalCount = allPermissions.length;
    return `${grantedCount}/${totalCount} permissions`;
  };

  return (
    <div className="role-management">
      <div className="role-management__header">
        <div className="role-management__header-content">
          <h2 className="role-management__title">Role Management</h2>
          <p className="role-management__description">
            Create and manage custom roles with specific CRUD permissions for all entity types
          </p>
        </div>
        <Button onClick={onCreateRole}>
          <Plus size={16} strokeWidth={1.5} />
          Create Custom Role
        </Button>
      </div>

      <div className="role-management__grid">
        {state.roles.map((role) => (
          <Card key={role.id} className="role-management__card">
            <CardHeader>
              <div className="role-management__card-header">
                <CardTitle className="role-management__card-title">
                  <Shield size={18} strokeWidth={1.5} />
                  {role.name}
                  {role.isSystem && (
                    <Badge variant="outline" className="role-management__system-badge">
                      System
                    </Badge>
                  )}
                </CardTitle>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="role-management__card-content">
                <div className="role-management__summary">
                  <span className="role-management__summary-text">
                    {getPermissionSummary(role)}
                  </span>
                </div>
                <div className="role-management__actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditRole?.(role)}
                  >
                    <Pencil size={16} strokeWidth={1.5} />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteRole?.(role)}
                    disabled={role.isSystem}
                    className="role-management__delete-button"
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
