import { useState } from 'react';
import { UserInviteForm } from '@/components/users/UserInviteForm';
import { UserList } from '@/components/users/UserList';
import { UserEditDialog } from '@/components/users/UserEditDialog';
import { User } from '@/types';
import './UsersPage.css';

export function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  return (
    <div className="users-page">
      <div className="users-page__header">
        <h1 className="users-page__title">User Management</h1>
        <p className="users-page__description">
          Manage users, assign roles, and control access to the system.
        </p>
      </div>

      <div className="users-page__content">
        <aside className="users-page__sidebar">
          <UserInviteForm />
        </aside>

        <main className="users-page__main">
          <UserList onEditUser={handleEditUser} />
        </main>
      </div>

      <UserEditDialog
        user={selectedUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
}
