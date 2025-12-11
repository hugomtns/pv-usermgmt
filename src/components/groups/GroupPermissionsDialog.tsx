import { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { EntitySelector } from '@/components/permissions/EntitySelector';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { UserGroup, EntityType, GroupPermissionOverride } from '@/types';
import './GroupPermissionsDialog.css';

interface GroupPermissionsDialogProps {
  group: UserGroup | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupPermissionsDialog({ group, open, onOpenChange }: GroupPermissionsDialogProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    entityType: '' as EntityType | '',
    scope: 'all' as 'all' | 'specific',
    specificEntityIds: [] as string[],
    permissions: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
  });

  const entityTypes: EntityType[] = [
    'projects',
    'project_files',
    'financial_models',
    'designs',
    'design_files',
    'design_comments',
  ];

  const getEntityTypeLabel = (type: EntityType): string => {
    const labels: Record<EntityType, string> = {
      projects: 'Projects',
      project_files: 'Project Files',
      financial_models: 'Financial Models',
      designs: 'Designs',
      design_files: 'Design Files',
      design_comments: 'Design Comments',
      user_management: 'User Management',
    };
    return labels[type];
  };

  const getEntityNames = (entityIds: string[]): string[] => {
    const names: string[] = [];
    const collectNames = (entities: typeof state.entities) => {
      entities.forEach(entity => {
        if (entityIds.includes(entity.id)) {
          names.push(entity.name);
        }
        if (entity.children) {
          collectNames(entity.children);
        }
      });
    };
    collectNames(state.entities);
    return names;
  };

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        entityType: '' as EntityType | '',
        scope: 'all',
        specificEntityIds: [],
        permissions: {
          create: false,
          read: false,
          update: false,
          delete: false,
        },
      });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!group || !formData.entityType) {
      return;
    }

    const newOverride: GroupPermissionOverride = {
      id: `override-${Date.now()}`,
      groupId: group.id,
      entityType: formData.entityType,
      scope: formData.scope,
      specificEntityIds: formData.scope === 'specific' ? formData.specificEntityIds : [],
      permissions: formData.permissions,
    };

    dispatch({ type: 'ADD_PERMISSION_OVERRIDE', payload: newOverride });

    toast({
      title: 'Permission override added',
      description: `Override for ${group.name} on ${formData.entityType} has been created.`,
    });

    // Reset form
    setFormData({
      entityType: '' as EntityType | '',
      scope: 'all',
      specificEntityIds: [],
      permissions: {
        create: false,
        read: false,
        update: false,
        delete: false,
      },
    });
  };

  const handlePermissionToggle = (action: keyof typeof formData.permissions) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [action]: !formData.permissions[action],
      },
    });
  };

  const handleEntitySelectorChange = (scope: 'all' | 'specific', selectedEntityIds: string[]) => {
    setFormData({
      ...formData,
      scope,
      specificEntityIds: selectedEntityIds,
    });
  };

  const handleDeleteOverride = (overrideId: string) => {
    if (window.confirm('Are you sure you want to delete this permission override?')) {
      dispatch({ type: 'DELETE_PERMISSION_OVERRIDE', payload: overrideId });
      toast({
        title: 'Permission override deleted',
        description: 'Override has been removed.',
      });
    }
  };

  const renderPermissions = (permissions: Partial<{ create: boolean; read: boolean; update: boolean; delete: boolean }>) => {
    return (
      <div className="group-permissions-dialog__permission-badges">
        {permissions.create && (
          <Badge variant="secondary" className="group-permissions-dialog__permission-badge">
            <Check size={12} strokeWidth={2} /> C
          </Badge>
        )}
        {permissions.read && (
          <Badge variant="secondary" className="group-permissions-dialog__permission-badge">
            <Check size={12} strokeWidth={2} /> R
          </Badge>
        )}
        {permissions.update && (
          <Badge variant="secondary" className="group-permissions-dialog__permission-badge">
            <Check size={12} strokeWidth={2} /> U
          </Badge>
        )}
        {permissions.delete && (
          <Badge variant="secondary" className="group-permissions-dialog__permission-badge">
            <Check size={12} strokeWidth={2} /> D
          </Badge>
        )}
      </div>
    );
  };

  if (!group) return null;

  const canSubmit = formData.entityType &&
    (formData.permissions.create || formData.permissions.read || formData.permissions.update || formData.permissions.delete);

  const groupOverrides = state.permissionOverrides.filter(o => o.groupId === group.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="group-permissions-dialog">
        <DialogHeader>
          <DialogTitle className="group-permissions-dialog__title">
            <Shield size={20} strokeWidth={1.5} />
            Manage Permissions - {group.name}
          </DialogTitle>
          <DialogDescription>
            Add and manage permission overrides for this group
          </DialogDescription>
        </DialogHeader>

        <div className="group-permissions-dialog__layout">
          {/* Left: Add Override Form */}
          <div className="group-permissions-dialog__form-section">
            <h3 className="group-permissions-dialog__section-title">Add Permission Override</h3>
            <form onSubmit={handleSubmit} className="group-permissions-dialog__form">
              <div className="group-permissions-dialog__field">
                <Label htmlFor="entityType">Entity Type *</Label>
                <Select
                  value={formData.entityType}
                  onValueChange={(value: EntityType) => setFormData({ ...formData, entityType: value, specificEntityIds: [] })}
                >
                  <SelectTrigger id="entityType">
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {getEntityTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.entityType && (
                <EntitySelector
                  entityType={formData.entityType}
                  scope={formData.scope}
                  selectedEntityIds={formData.specificEntityIds}
                  onChange={handleEntitySelectorChange}
                />
              )}

              <div className="group-permissions-dialog__field">
                <Label className="group-permissions-dialog__permissions-label">
                  <Shield size={16} strokeWidth={1.5} />
                  Permissions *
                </Label>
                <div className="group-permissions-dialog__permissions">
                  {(['create', 'read', 'update', 'delete'] as const).map((action) => (
                    <div key={action} className="group-permissions-dialog__permission-item">
                      <Checkbox
                        id={`permission-${action}`}
                        checked={formData.permissions[action]}
                        onCheckedChange={() => handlePermissionToggle(action)}
                      />
                      <Label htmlFor={`permission-${action}`} className="group-permissions-dialog__permission-label">
                        {action.charAt(0).toUpperCase() + action.slice(1)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={!canSubmit} className="group-permissions-dialog__submit">
                <Plus size={16} strokeWidth={1.5} />
                Add Override
              </Button>
            </form>
          </div>

          {/* Right: Existing Overrides List */}
          <div className="group-permissions-dialog__list-section">
            <h3 className="group-permissions-dialog__section-title">
              Existing Overrides ({groupOverrides.length})
            </h3>
            {groupOverrides.length === 0 ? (
              <div className="group-permissions-dialog__empty">
                <Shield size={32} strokeWidth={1.5} />
                <p>No permission overrides for this group yet.</p>
              </div>
            ) : (
              <div className="group-permissions-dialog__list">
                {groupOverrides.map((override) => {
                  const entityNames = override.scope === 'specific' ? getEntityNames(override.specificEntityIds) : [];

                  return (
                    <div key={override.id} className="group-permissions-dialog__override-item">
                      <div className="group-permissions-dialog__override-header">
                        <div className="group-permissions-dialog__override-info">
                          <h4 className="group-permissions-dialog__override-title">
                            {getEntityTypeLabel(override.entityType)}
                          </h4>
                          <div className="group-permissions-dialog__override-scope">
                            {override.scope === 'all' ? (
                              <Badge variant="outline">All {getEntityTypeLabel(override.entityType)}</Badge>
                            ) : (
                              <>
                                <Badge variant="outline">Specific</Badge>
                                <span className="group-permissions-dialog__entity-names">
                                  {entityNames.join(', ')}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteOverride(override.id)}
                          className="group-permissions-dialog__delete-button"
                        >
                          <Trash2 size={16} strokeWidth={1.5} />
                        </Button>
                      </div>
                      <div className="group-permissions-dialog__override-permissions">
                        <span className="group-permissions-dialog__override-label">Permissions:</span>
                        {renderPermissions(override.permissions)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
