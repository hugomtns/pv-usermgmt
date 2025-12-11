import { EntityTreeView } from '@/components/entities/EntityTreeView';
import { useApp } from '@/contexts/AppContext';
import './EntitiesPage.css';

export function EntitiesPage() {
  const { state } = useApp();

  return (
    <div className="entities-page">
      <div className="entities-page__header">
        <h1 className="entities-page__title">Entities</h1>
        <p className="entities-page__description">
          Browse and explore the hierarchical structure of projects, files, designs, and related entities in the system.
        </p>
      </div>

      <div className="entities-page__content">
        <EntityTreeView entities={state.entities} />
      </div>
    </div>
  );
}
