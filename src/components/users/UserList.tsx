import { useState } from 'react';
import { Pencil, Trash2, Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';
import './UserList.css';

interface UserListProps {
  onEditUser?: (user: User) => void;
  onViewPermissions?: (user: User) => void;
}

export function UserList({ onEditUser, onViewPermissions }: UserListProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = state.users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const handleDelete = (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      dispatch({ type: 'DELETE_USER', payload: user.id });
      toast({
        title: 'User deleted',
        description: `${user.firstName} ${user.lastName} has been removed from the system.`,
      });
    }
  };

  const getGroupNames = (groupIds: string[]): string => {
    const groupNames = groupIds
      .map(id => state.groups.find(g => g.id === id)?.name)
      .filter(Boolean);
    return groupNames.length > 0 ? groupNames.join(', ') : 'None';
  };

  const getRoleName = (roleId: string): string => {
    return state.roles.find(r => r.id === roleId)?.name ?? 'Unknown';
  };

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return 'default';
      case 'user':
        return 'secondary';
      case 'viewer':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="user-list">
      <div className="user-list__header">
        <h2 className="user-list__title">Users</h2>
        <div className="user-list__search">
          <Search size={16} strokeWidth={1.5} />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="user-list__search-input"
          />
        </div>
      </div>

      <div className="user-list__table-wrapper">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Function</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Groups</TableHead>
              <TableHead className="user-list__actions-header">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="user-list__empty">
                  {searchQuery ? 'No users found matching your search.' : 'No users yet. Invite your first user!'}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="user-list__name">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.function}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(getRoleName(user.roleId))}>
                      {getRoleName(user.roleId)}
                    </Badge>
                  </TableCell>
                  <TableCell className="user-list__groups">
                    {getGroupNames(user.groupIds)}
                  </TableCell>
                  <TableCell>
                    <div className="user-list__actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewPermissions?.(user)}
                        className="user-list__action-button"
                      >
                        <Eye size={16} strokeWidth={1.5} />
                        Permissions
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditUser?.(user)}
                        className="user-list__action-button"
                      >
                        <Pencil size={16} strokeWidth={1.5} />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user)}
                        className="user-list__action-button user-list__action-button--delete"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
