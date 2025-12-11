import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GroupList } from '@/components/groups/GroupList';
import { GroupForm } from '@/components/groups/GroupForm';
import { GroupMembersDialog } from '@/components/groups/GroupMembersDialog';
import { UserGroup } from '@/types';
import './GroupsPage.css';

export function GroupsPage() {
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);

  const handleEditGroup = (group: UserGroup) => {
    setSelectedGroup(group);
    setEditDialogOpen(true);
  };

  const handleManageMembers = (group: UserGroup) => {
    setSelectedGroup(group);
    setMembersDialogOpen(true);
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setSelectedGroup(null);
  };

  return (
    <div className="groups-page">
      <div className="groups-page__header">
        <div>
          <h1 className="groups-page__title">Group Management</h1>
          <p className="groups-page__description">
            Organize users into groups for easier permission management.
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="groups-page__create-button">
          <Plus size={16} strokeWidth={1.5} />
          Create Group
        </Button>
      </div>

      <div className="groups-page__content">
        <GroupList onEditGroup={handleEditGroup} onManageMembers={handleManageMembers} />
      </div>

      {/* Create Group Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="groups-page__dialog-title">
              <Plus size={20} strokeWidth={1.5} />
              Create New Group
            </DialogTitle>
            <DialogDescription>
              Create a new group to organize users with similar permissions
            </DialogDescription>
          </DialogHeader>
          <GroupForm mode="create" onSuccess={handleCreateSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <GroupForm mode="edit" group={selectedGroup} onSuccess={handleEditSuccess} />
        </DialogContent>
      </Dialog>

      {/* Manage Members Dialog */}
      <GroupMembersDialog
        group={selectedGroup}
        open={membersDialogOpen}
        onOpenChange={setMembersDialogOpen}
      />
    </div>
  );
}
