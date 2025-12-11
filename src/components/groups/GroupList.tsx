import { Users, Pencil, Trash2, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { UserGroup } from '@/types';
import './GroupList.css';

interface GroupListProps {
  onEditGroup?: (group: UserGroup) => void;
  onManageMembers?: (group: UserGroup) => void;
}

export function GroupList({ onEditGroup, onManageMembers }: GroupListProps) {
  const { state, dispatch } = useApp();

  const handleDelete = (group: UserGroup) => {
    if (window.confirm(`Are you sure you want to delete the group "${group.name}"? This will remove all members from the group.`)) {
      dispatch({ type: 'DELETE_GROUP', payload: group.id });
    }
  };

  return (
    <div className="group-list">
      <div className="group-list__header">
        <h2 className="group-list__title">Groups</h2>
        <p className="group-list__description">
          {state.groups.length} {state.groups.length === 1 ? 'group' : 'groups'}
        </p>
      </div>

      {state.groups.length === 0 ? (
        <Card>
          <CardContent className="group-list__empty">
            <Users size={48} strokeWidth={1.5} />
            <p>No groups yet. Create your first group!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="group-list__grid">
          {state.groups.map((group) => (
            <Card key={group.id} className="group-list__card">
              <CardHeader>
                <div className="group-list__card-header">
                  <div>
                    <CardTitle className="group-list__card-title">
                      {group.name}
                    </CardTitle>
                    <CardDescription className="group-list__card-description">
                      {group.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="group-list__member-badge">
                    <Users size={14} strokeWidth={1.5} />
                    {group.memberIds.length} {group.memberIds.length === 1 ? 'member' : 'members'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="group-list__actions">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditGroup?.(group)}
                    className="group-list__action-button"
                  >
                    <Pencil size={16} strokeWidth={1.5} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onManageMembers?.(group)}
                    className="group-list__action-button"
                  >
                    <UserCog size={16} strokeWidth={1.5} />
                    Members
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(group)}
                    className="group-list__action-button group-list__action-button--delete"
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
