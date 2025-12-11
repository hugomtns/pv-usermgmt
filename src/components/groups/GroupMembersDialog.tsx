import { useState, useEffect } from 'react';
import { UserCog, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { UserGroup } from '@/types';
import './GroupMembersDialog.css';

interface GroupMembersDialogProps {
  group: UserGroup | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupMembersDialog({ group, open, onOpenChange }: GroupMembersDialogProps) {
  const { state, dispatch } = useApp();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Pre-check users already in group
  useEffect(() => {
    if (group) {
      setSelectedUserIds(group.memberIds);
    }
  }, [group]);

  const handleToggleUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds([...selectedUserIds, userId]);
    } else {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
    }
  };

  const handleSave = () => {
    if (!group) return;

    // Update group memberIds
    const updatedGroup: UserGroup = {
      ...group,
      memberIds: selectedUserIds,
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'UPDATE_GROUP', payload: updatedGroup });

    // Update user groupIds
    // For users being added to the group
    selectedUserIds.forEach(userId => {
      const user = state.users.find(u => u.id === userId);
      if (user && !user.groupIds.includes(group.id)) {
        dispatch({
          type: 'UPDATE_USER',
          payload: {
            ...user,
            groupIds: [...user.groupIds, group.id],
            updatedAt: new Date().toISOString(),
          },
        });
      }
    });

    // For users being removed from the group
    group.memberIds.forEach(userId => {
      if (!selectedUserIds.includes(userId)) {
        const user = state.users.find(u => u.id === userId);
        if (user) {
          dispatch({
            type: 'UPDATE_USER',
            payload: {
              ...user,
              groupIds: user.groupIds.filter(id => id !== group.id),
              updatedAt: new Date().toISOString(),
            },
          });
        }
      }
    });

    onOpenChange(false);
  };

  const handleCancel = () => {
    if (group) {
      setSelectedUserIds(group.memberIds);
    }
    onOpenChange(false);
  };

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="group-members-dialog">
        <DialogHeader>
          <DialogTitle className="group-members-dialog__title">
            <UserCog size={20} strokeWidth={1.5} />
            Manage Group Members
          </DialogTitle>
          <DialogDescription>
            Select users to add or remove from "{group.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="group-members-dialog__content">
          {state.users.length === 0 ? (
            <div className="group-members-dialog__empty">
              <Users size={48} strokeWidth={1.5} />
              <p>No users available. Create users first!</p>
            </div>
          ) : (
            <div className="group-members-dialog__list">
              {state.users.map((user) => (
                <div key={user.id} className="group-members-dialog__item">
                  <div className="group-members-dialog__checkbox-wrapper">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedUserIds.includes(user.id)}
                      onCheckedChange={(checked) =>
                        handleToggleUser(user.id, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`user-${user.id}`}
                      className="group-members-dialog__label"
                    >
                      <div className="group-members-dialog__user-info">
                        <span className="group-members-dialog__user-name">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="group-members-dialog__user-details">
                          {user.function} • {user.role}
                        </span>
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="group-members-dialog__summary">
            <Users size={16} strokeWidth={1.5} />
            {selectedUserIds.length} {selectedUserIds.length === 1 ? 'member' : 'members'} selected
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
