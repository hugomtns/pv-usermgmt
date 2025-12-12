import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { CustomRole } from '@/types/role';
import { EntityType, PermissionSet } from '@/types';
import './RoleForm.css';

interface RoleFormProps {
  role: CustomRole | null;
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EntityHierarchy {
  type: EntityType;
  label: string;
  level: number;
}

const entityHierarchy: EntityHierarchy[] = [
  { type: 'workspaces', label: 'Workspaces', level: 0 },
  { type: 'projects', label: 'Projects', level: 1 },
  { type: 'project_files', label: 'Project Files', level: 2 },
  { type: 'financial_models', label: 'Financial Models', level: 2 },
  { type: 'designs', label: 'Designs', level: 2 },
  { type: 'design_files', label: 'Design Files', level: 3 },
  { type: 'design_comments', label: 'Design Comments', level: 3 },
  { type: 'user_management', label: 'User Management', level: 0 },
];

const emptyPermissions: Record<EntityType, PermissionSet> = {
  workspaces: { create: false, read: false, update: false, delete: false },
  projects: { create: false, read: false, update: false, delete: false },
  project_files: { create: false, read: false, update: false, delete: false },
  financial_models: { create: false, read: false, update: false, delete: false },
  designs: { create: false, read: false, update: false, delete: false },
  design_files: { create: false, read: false, update: false, delete: false },
  design_comments: { create: false, read: false, update: false, delete: false },
  user_management: { create: false, read: false, update: false, delete: false },
};

export function RoleForm({ role, mode, open, onOpenChange }: RoleFormProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: emptyPermissions,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (role && mode === 'edit') {
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      });
      setErrors({});
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        permissions: emptyPermissions,
      });
      setErrors({});
    }
  }, [role, mode, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    } else if (mode === 'create' && state.roles.some(r => r.name.toLowerCase() === formData.name.trim().toLowerCase())) {
      newErrors.name = 'Role name must be unique';
    } else if (mode === 'edit' && role && state.roles.some(r => r.id !== role.id && r.name.toLowerCase() === formData.name.trim().toLowerCase())) {
      newErrors.name = 'Role name must be unique';
    }

    const hasAtLeastOnePermission = Object.values(formData.permissions).some(permSet =>
      Object.values(permSet).some(p => p === true)
    );
    if (!hasAtLeastOnePermission) {
      newErrors.permissions = 'At least one permission must be granted';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePermissionChange = (entityType: EntityType, action: keyof PermissionSet, checked: boolean) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [entityType]: {
          ...formData.permissions[entityType],
          [action]: checked,
        },
      },
    });
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    if (mode === 'create') {
      const newRole: CustomRole = {
        id: `role-${Date.now()}`,
        name: formData.name.trim(),
        description: formData.description.trim(),
        isSystem: false,
        permissions: formData.permissions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_ROLE', payload: newRole });
      toast({
        title: 'Role created successfully',
        description: `${newRole.name} has been added to the system.`,
      });
    } else if (role) {
      const updatedRole: CustomRole = {
        ...role,
        name: formData.name.trim(),
        description: formData.description.trim(),
        permissions: formData.permissions,
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'UPDATE_ROLE', payload: updatedRole });
      toast({
        title: 'Role updated successfully',
        description: `Changes to ${updatedRole.name} have been saved.`,
      });
    }

    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="role-form">
        <DialogHeader>
          <DialogTitle className="role-form__title">
            <Shield size={20} strokeWidth={1.5} />
            {mode === 'create' ? 'Create Custom Role' : `Edit Role: ${role?.name}`}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Define a new role with custom CRUD permissions for all entity types'
              : 'Update role information and permissions'}
          </DialogDescription>
        </DialogHeader>

        <div className="role-form__content">
          <div className="role-form__field">
            <Label htmlFor="role-name">Role Name *</Label>
            <Input
              id="role-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Project Manager, Finance Viewer"
              className={errors.name ? 'role-form__input--error' : ''}
              disabled={role?.isSystem}
            />
            {errors.name && (
              <span className="role-form__error">{errors.name}</span>
            )}
            {role?.isSystem && (
              <span className="role-form__hint">System role names cannot be changed</span>
            )}
          </div>

          <div className="role-form__field">
            <Label htmlFor="role-description">Description</Label>
            <Input
              id="role-description"
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this role"
            />
          </div>

          <div className="role-form__permissions">
            <div className="role-form__permissions-header">
              <Label>Permissions *</Label>
              {errors.permissions && (
                <span className="role-form__error">{errors.permissions}</span>
              )}
            </div>

            <div className="role-form__matrix">
              <div className="role-form__matrix-header">
                <div className="role-form__matrix-entity">Entity Type</div>
                <div className="role-form__matrix-action">C</div>
                <div className="role-form__matrix-action">R</div>
                <div className="role-form__matrix-action">U</div>
                <div className="role-form__matrix-action">D</div>
              </div>

              {entityHierarchy.map((entity) => (
                <div
                  key={entity.type}
                  className="role-form__matrix-row"
                  style={{ paddingLeft: `calc(var(--space-3) + ${entity.level * 16}px)` }}
                >
                  <div className={`role-form__matrix-entity ${entity.level > 0 ? 'role-form__matrix-entity--child' : ''}`}>
                    {entity.label}
                  </div>
                  <div className="role-form__matrix-action">
                    <Checkbox
                      checked={formData.permissions[entity.type].create}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(entity.type, 'create', checked as boolean)
                      }
                    />
                  </div>
                  <div className="role-form__matrix-action">
                    <Checkbox
                      checked={formData.permissions[entity.type].read}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(entity.type, 'read', checked as boolean)
                      }
                    />
                  </div>
                  <div className="role-form__matrix-action">
                    <Checkbox
                      checked={formData.permissions[entity.type].update}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(entity.type, 'update', checked as boolean)
                      }
                    />
                  </div>
                  <div className="role-form__matrix-action">
                    <Checkbox
                      checked={formData.permissions[entity.type].delete}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(entity.type, 'delete', checked as boolean)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="role-form__matrix-legend">
              <strong>C</strong> Create • <strong>R</strong> Read • <strong>U</strong> Update • <strong>D</strong> Delete
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === 'create' ? 'Create Role' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
