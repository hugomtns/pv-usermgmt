import { useState } from 'react';
import { Shield, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { EntitySelector } from './EntitySelector';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { EntityType, GroupPermissionOverride } from '@/types';
import './GroupOverrideForm.css';

export function GroupOverrideForm() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    groupId: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.groupId || !formData.entityType) {
      return;
    }

    const newOverride: GroupPermissionOverride = {
      id: `override-${Date.now()}`,
      groupId: formData.groupId,
      entityType: formData.entityType,
      scope: formData.scope,
      specificEntityIds: formData.scope === 'specific' ? formData.specificEntityIds : [],
      permissions: formData.permissions,
    };

    dispatch({ type: 'ADD_PERMISSION_OVERRIDE', payload: newOverride });

    const groupName = state.groups.find(g => g.id === formData.groupId)?.name || 'Group';
    toast({
      title: 'Permission override added',
      description: `Override for ${groupName} on ${formData.entityType} has been created.`,
    });

    // Reset form
    setFormData({
      groupId: '',
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

  const canSubmit = formData.groupId && formData.entityType &&
    (formData.permissions.create || formData.permissions.read || formData.permissions.update || formData.permissions.delete);

  return (
    <Card className="group-override-form">
      <CardHeader>
        <CardTitle className="group-override-form__title">
          <Plus size={20} strokeWidth={1.5} />
          Add Permission Override
        </CardTitle>
        <CardDescription>
          Grant additional permissions to a group for specific entity types
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="group-override-form__form">
          <div className="group-override-form__field">
            <Label htmlFor="group">Group *</Label>
            <Select
              value={formData.groupId}
              onValueChange={(value) => setFormData({ ...formData, groupId: value })}
            >
              <SelectTrigger id="group">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {state.groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="group-override-form__field">
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

          <div className="group-override-form__field">
            <Label className="group-override-form__permissions-label">
              <Shield size={16} strokeWidth={1.5} />
              Permissions *
            </Label>
            <div className="group-override-form__permissions">
              {(['create', 'read', 'update', 'delete'] as const).map((action) => (
                <div key={action} className="group-override-form__permission-item">
                  <Checkbox
                    id={`permission-${action}`}
                    checked={formData.permissions[action]}
                    onCheckedChange={() => handlePermissionToggle(action)}
                  />
                  <Label htmlFor={`permission-${action}`} className="group-override-form__permission-label">
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={!canSubmit} className="group-override-form__submit">
            <Plus size={16} strokeWidth={1.5} />
            Add Override
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
