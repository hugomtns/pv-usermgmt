import { Shield, Trash2, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { EntityType } from '@/types';
import './GroupOverrides.css';

interface GroupOverridesProps {
  readOnly?: boolean;
}

export function GroupOverrides({ readOnly = false }: GroupOverridesProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();

  const getEntityTypeLabel = (type: EntityType): string => {
    const labels: Record<EntityType, string> = {
      workspaces: 'Workspaces',
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

  const getGroupName = (groupId: string): string => {
    const group = state.groups.find(g => g.id === groupId);
    return group?.name ?? 'Unknown Group';
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

  const handleDelete = (id: string, groupName: string) => {
    if (window.confirm(`Are you sure you want to delete this permission override for "${groupName}"?`)) {
      dispatch({ type: 'DELETE_PERMISSION_OVERRIDE', payload: id });
      toast({
        title: 'Permission override deleted',
        description: `Override for ${groupName} has been removed.`,
      });
    }
  };

  const renderPermissions = (permissions: Partial<{ create: boolean; read: boolean; update: boolean; delete: boolean }>) => {
    return (
      <div className="group-overrides__permissions">
        {permissions.create && (
          <Badge variant="secondary" className="group-overrides__permission-badge">
            <Check size={12} strokeWidth={2} /> C
          </Badge>
        )}
        {permissions.read && (
          <Badge variant="secondary" className="group-overrides__permission-badge">
            <Check size={12} strokeWidth={2} /> R
          </Badge>
        )}
        {permissions.update && (
          <Badge variant="secondary" className="group-overrides__permission-badge">
            <Check size={12} strokeWidth={2} /> U
          </Badge>
        )}
        {permissions.delete && (
          <Badge variant="secondary" className="group-overrides__permission-badge">
            <Check size={12} strokeWidth={2} /> D
          </Badge>
        )}
      </div>
    );
  };

  return (
    <Card className="group-overrides">
      <CardHeader>
        <CardTitle className="group-overrides__title">
          <Shield size={20} strokeWidth={1.5} />
          Group Permission Overrides
        </CardTitle>
        <CardDescription>
          Additional permissions granted to specific groups
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state.permissionOverrides.length === 0 ? (
          <div className="group-overrides__empty">
            <Shield size={48} strokeWidth={1.5} />
            <p>No permission overrides configured yet.</p>
          </div>
        ) : (
          <div className="group-overrides__list">
            {state.permissionOverrides.map((override) => {
              const groupName = getGroupName(override.groupId);
              const entityNames = override.scope === 'specific' ? getEntityNames(override.specificEntityIds) : [];

              return (
                <div key={override.id} className="group-overrides__item">
                  <div className="group-overrides__item-header">
                    <div className="group-overrides__item-info">
                      <h4 className="group-overrides__item-title">{groupName}</h4>
                      <p className="group-overrides__item-subtitle">
                        {getEntityTypeLabel(override.entityType)}
                      </p>
                    </div>
                    {readOnly ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.hash = '#groups'}
                        className="group-overrides__edit-link"
                      >
                        <ExternalLink size={16} strokeWidth={1.5} />
                        Edit in Groups
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(override.id, groupName)}
                        className="group-overrides__delete-button"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </Button>
                    )}
                  </div>

                  <div className="group-overrides__item-details">
                    <div className="group-overrides__detail">
                      <span className="group-overrides__detail-label">Scope:</span>
                      {override.scope === 'all' ? (
                        <Badge variant="outline">All {getEntityTypeLabel(override.entityType)}</Badge>
                      ) : (
                        <div className="group-overrides__specific-entities">
                          <Badge variant="outline">Specific</Badge>
                          <span className="group-overrides__entity-names">
                            {entityNames.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="group-overrides__detail">
                      <span className="group-overrides__detail-label">Permissions:</span>
                      {renderPermissions(override.permissions)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
