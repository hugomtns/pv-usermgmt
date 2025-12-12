import { useState } from 'react';
import { ChevronRight, ChevronDown, Briefcase, Folder, FileText, DollarSign, Palette, File, MessageSquare } from 'lucide-react';
import { Entity, EntityType } from '@/types';
import './EntityTreeView.css';

interface EntityTreeViewProps {
  entities: Entity[];
}

interface EntityNodeProps {
  entity: Entity;
  level: number;
}

function getEntityIcon(type: EntityType) {
  switch (type) {
    case 'workspaces':
      return <Briefcase size={16} strokeWidth={1.5} />;
    case 'projects':
      return <Folder size={16} strokeWidth={1.5} />;
    case 'project_files':
      return <FileText size={16} strokeWidth={1.5} />;
    case 'financial_models':
      return <DollarSign size={16} strokeWidth={1.5} />;
    case 'designs':
      return <Palette size={16} strokeWidth={1.5} />;
    case 'design_files':
      return <File size={16} strokeWidth={1.5} />;
    case 'design_comments':
      return <MessageSquare size={16} strokeWidth={1.5} />;
    default:
      return <FileText size={16} strokeWidth={1.5} />;
  }
}

function getEntityTypeLabel(type: EntityType): string {
  const labels: Record<EntityType, string> = {
    workspaces: 'Workspace',
    projects: 'Project',
    project_files: 'File',
    financial_models: 'Financial Model',
    designs: 'Design',
    design_files: 'Design File',
    design_comments: 'Comment',
    user_management: 'User Management',
  };
  return labels[type] || type;
}

function EntityNode({ entity, level }: EntityNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = entity.children && entity.children.length > 0;

  return (
    <div className="entity-tree-view__node">
      <div
        className="entity-tree-view__node-content"
        style={{ paddingLeft: `calc(var(--space-4) + ${level * 24}px)` }}
      >
        <button
          className="entity-tree-view__toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={!hasChildren}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown size={16} strokeWidth={1.5} />
            ) : (
              <ChevronRight size={16} strokeWidth={1.5} />
            )
          ) : (
            <span className="entity-tree-view__toggle-placeholder" />
          )}
        </button>

        <span className="entity-tree-view__icon">
          {getEntityIcon(entity.type)}
        </span>

        <div className="entity-tree-view__info">
          <span className="entity-tree-view__name">{entity.name}</span>
          <span className="entity-tree-view__type">{getEntityTypeLabel(entity.type)}</span>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="entity-tree-view__children">
          {entity.children!.map((child) => (
            <EntityNode key={child.id} entity={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function EntityTreeView({ entities }: EntityTreeViewProps) {
  return (
    <div className="entity-tree-view">
      <div className="entity-tree-view__header">
        <h2 className="entity-tree-view__title">Entity Browser</h2>
        <p className="entity-tree-view__description">
          Browse the hierarchical structure of workspaces, projects, files, designs, and related entities
        </p>
      </div>

      <div className="entity-tree-view__tree">
        {entities.length === 0 ? (
          <div className="entity-tree-view__empty">
            No entities to display
          </div>
        ) : (
          entities.map((entity) => (
            <EntityNode key={entity.id} entity={entity} level={0} />
          ))
        )}
      </div>
    </div>
  );
}
