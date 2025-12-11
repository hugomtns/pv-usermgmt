import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext';
import { EntityType } from '@/types';
import './EntitySelector.css';

interface EntitySelectorProps {
  entityType: EntityType;
  scope: 'all' | 'specific';
  selectedEntityIds: string[];
  onChange: (scope: 'all' | 'specific', selectedEntityIds: string[]) => void;
}

export function EntitySelector({ entityType, scope, selectedEntityIds, onChange }: EntitySelectorProps) {
  const { state } = useApp();

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

  // Get all entities of the selected type
  const getEntitiesOfType = (type: EntityType) => {
    const allEntities: Array<{ id: string; name: string; type: EntityType }> = [];

    const collectEntities = (entities: typeof state.entities) => {
      entities.forEach(entity => {
        if (entity.type === type) {
          allEntities.push({ id: entity.id, name: entity.name, type: entity.type });
        }
        if (entity.children) {
          collectEntities(entity.children);
        }
      });
    };

    collectEntities(state.entities);
    return allEntities;
  };

  const availableEntities = getEntitiesOfType(entityType);

  const handleScopeChange = (newScope: 'all' | 'specific') => {
    if (newScope === 'all') {
      onChange('all', []);
    } else {
      onChange('specific', selectedEntityIds);
    }
  };

  const handleEntityToggle = (entityId: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedEntityIds, entityId]
      : selectedEntityIds.filter(id => id !== entityId);
    onChange('specific', newSelection);
  };

  return (
    <div className="entity-selector">
      <Label className="entity-selector__label">Scope</Label>

      <div className="entity-selector__scope">
        <div className="entity-selector__radio-group">
          <div
            className={`entity-selector__radio ${scope === 'all' ? 'entity-selector__radio--active' : ''}`}
            onClick={() => handleScopeChange('all')}
          >
            <input
              type="radio"
              name="scope"
              value="all"
              checked={scope === 'all'}
              onChange={() => handleScopeChange('all')}
              className="entity-selector__radio-input"
            />
            <Label htmlFor="scope-all" className="entity-selector__radio-label">
              All {getEntityTypeLabel(entityType)}
            </Label>
          </div>

          <div
            className={`entity-selector__radio ${scope === 'specific' ? 'entity-selector__radio--active' : ''}`}
            onClick={() => handleScopeChange('specific')}
          >
            <input
              type="radio"
              name="scope"
              value="specific"
              checked={scope === 'specific'}
              onChange={() => handleScopeChange('specific')}
              className="entity-selector__radio-input"
            />
            <Label htmlFor="scope-specific" className="entity-selector__radio-label">
              Specific {getEntityTypeLabel(entityType)}
            </Label>
          </div>
        </div>
      </div>

      {scope === 'specific' && (
        <div className="entity-selector__specific">
          <Label className="entity-selector__label">
            Select {getEntityTypeLabel(entityType)}
          </Label>
          {availableEntities.length === 0 ? (
            <p className="entity-selector__empty">
              No {getEntityTypeLabel(entityType).toLowerCase()} available
            </p>
          ) : (
            <div className="entity-selector__list">
              {availableEntities.map((entity) => (
                <div key={entity.id} className="entity-selector__item">
                  <Checkbox
                    id={`entity-${entity.id}`}
                    checked={selectedEntityIds.includes(entity.id)}
                    onCheckedChange={(checked) => handleEntityToggle(entity.id, checked as boolean)}
                  />
                  <Label htmlFor={`entity-${entity.id}`} className="entity-selector__item-label">
                    {entity.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
          {selectedEntityIds.length > 0 && (
            <p className="entity-selector__count">
              {selectedEntityIds.length} {selectedEntityIds.length === 1 ? 'item' : 'items'} selected
            </p>
          )}
        </div>
      )}
    </div>
  );
}
