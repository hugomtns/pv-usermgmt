import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { CustomRole } from '@/types/role';
import './RoleDeleteDialog.css';

interface RoleDeleteDialogProps {
  role: CustomRole | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoleDeleteDialog({ role, open, onOpenChange }: RoleDeleteDialogProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [replacementRoleId, setReplacementRoleId] = useState<string>('');
  const [affectedUsers, setAffectedUsers] = useState<number>(0);

  useEffect(() => {
    if (role && open) {
      const usersWithRole = state.users.filter(u => u.roleId === role.id);
      setAffectedUsers(usersWithRole.length);

      // Auto-select first available replacement role
      const availableRoles = state.roles.filter(r => r.id !== role.id);
      if (availableRoles.length > 0 && availableRoles[0]) {
        setReplacementRoleId(availableRoles[0].id);
      }
    }
  }, [role, open, state.users, state.roles]);

  const handleDelete = () => {
    if (!role) return;

    if (role.isSystem) {
      toast({
        title: 'Cannot delete system role',
        description: 'System roles (Admin, User, Viewer) cannot be deleted.',
        variant: 'destructive',
      });
      return;
    }

    if (affectedUsers > 0 && !replacementRoleId) {
      toast({
        title: 'Please select a replacement role',
        description: 'You must select a role to reassign the affected users.',
        variant: 'destructive',
      });
      return;
    }

    // Reassign users if needed
    if (affectedUsers > 0) {
      state.users
        .filter(u => u.roleId === role.id)
        .forEach(user => {
          dispatch({
            type: 'UPDATE_USER',
            payload: {
              ...user,
              roleId: replacementRoleId,
              updatedAt: new Date().toISOString(),
            },
          });
        });
    }

    // Delete the role
    dispatch({ type: 'DELETE_ROLE', payload: role.id });

    toast({
      title: 'Role deleted successfully',
      description: affectedUsers > 0
        ? `${role.name} has been deleted and ${affectedUsers} ${affectedUsers === 1 ? 'user has' : 'users have'} been reassigned.`
        : `${role.name} has been deleted.`,
    });

    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!role) return null;

  const availableRoles = state.roles.filter(r => r.id !== role.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="role-delete-dialog">
        <DialogHeader>
          <DialogTitle className="role-delete-dialog__title">
            <AlertTriangle size={20} strokeWidth={1.5} />
            Delete Role: {role.name}
          </DialogTitle>
          <DialogDescription>
            {affectedUsers > 0
              ? 'This role is currently assigned to users. They must be reassigned before deletion.'
              : 'Are you sure you want to delete this role? This action cannot be undone.'}
          </DialogDescription>
        </DialogHeader>

        <div className="role-delete-dialog__content">
          {affectedUsers > 0 && (
            <>
              <div className="role-delete-dialog__warning">
                <AlertTriangle size={16} strokeWidth={1.5} />
                <span className="role-delete-dialog__warning-text">
                  {affectedUsers} {affectedUsers === 1 ? 'user is' : 'users are'} currently assigned to this role
                </span>
              </div>

              <div className="role-delete-dialog__field">
                <Label htmlFor="replacement-role">Reassign users to *</Label>
                <Select
                  value={replacementRoleId}
                  onValueChange={(value: string) => setReplacementRoleId(value)}
                >
                  <SelectTrigger id="replacement-role">
                    <SelectValue placeholder="Select a replacement role" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {affectedUsers === 0 && (
            <div className="role-delete-dialog__info">
              This role has no users assigned and can be safely deleted.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={affectedUsers > 0 && !replacementRoleId}
          >
            Delete Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
