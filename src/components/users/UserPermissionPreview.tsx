import { Check, X, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useApp } from '@/contexts/AppContext';
import { User, EntityType } from '@/types';
import { resolveAllPermissions } from '@/utils/permissionResolver';
import './UserPermissionPreview.css';

interface UserPermissionPreviewProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EntityHierarchy {
  type: EntityType;
  label: string;
  level: number;
}

const entityHierarchy: EntityHierarchy[] = [
  { type: 'workspaces', label: 'Workspaces', level: 0 },
  { type: 'projects', label: 'Projects', level: 1 },
  { type: 'project_files', label: 'Project Files', level: 2 },
  { type: 'financial_models', label: 'Financial Models', level: 2 },
  { type: 'designs', label: 'Designs', level: 2 },
  { type: 'design_files', label: 'Design Files', level: 3 },
  { type: 'design_comments', label: 'Design Comments', level: 3 },
  { type: 'user_management', label: 'User Management', level: 0 },
];

function PermissionIcon({ granted }: { granted: boolean }) {
  if (granted) {
    return <Check size={14} strokeWidth={2} className="user-permission-preview__icon user-permission-preview__icon--granted" />;
  }
  return <X size={14} strokeWidth={2} className="user-permission-preview__icon user-permission-preview__icon--denied" />;
}

export function UserPermissionPreview({ user, open, onOpenChange }: UserPermissionPreviewProps) {
  const { state } = useApp();

  if (!user) return null;

  const effectivePermissions = resolveAllPermissions(user, state.permissionOverrides, state.roles);
  const userGroupNames = user.groupIds.map(id => state.groups.find(g => g.id === id)?.name).filter(Boolean);
  const roleName = state.roles.find(r => r.id === user.roleId)?.name ?? 'Unknown';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="user-permission-preview">
        <DialogHeader>
          <DialogTitle className="user-permission-preview__title">
            <Eye size={20} strokeWidth={1.5} />
            {user.firstName} {user.lastName} - Effective Permissions
          </DialogTitle>
          <DialogDescription>
            View resolved permissions including role defaults and group overrides
          </DialogDescription>
        </DialogHeader>

        <div className="user-permission-preview__content">
          <div className="user-permission-preview__user-info">
            <div className="user-permission-preview__info-item">
              <span className="user-permission-preview__info-label">Role:</span>
              <Badge variant="secondary">{roleName}</Badge>
            </div>
            <div className="user-permission-preview__info-item">
              <span className="user-permission-preview__info-label">Groups:</span>
              {userGroupNames.length > 0 ? (
                <div className="user-permission-preview__groups">
                  {userGroupNames.map((name, idx) => (
                    <Badge key={idx} variant="outline">{name}</Badge>
                  ))}
                </div>
              ) : (
                <span className="user-permission-preview__no-groups">No groups</span>
              )}
            </div>
          </div>

          <div className="user-permission-preview__table-wrapper">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity Type</TableHead>
                  <TableHead className="user-permission-preview__action-header">Create</TableHead>
                  <TableHead className="user-permission-preview__action-header">Read</TableHead>
                  <TableHead className="user-permission-preview__action-header">Update</TableHead>
                  <TableHead className="user-permission-preview__action-header">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entityHierarchy.map((entity) => {
                  const perms = effectivePermissions[entity.type];
                  return (
                    <TableRow key={entity.type}>
                      <TableCell
                        style={{ paddingLeft: `calc(var(--space-4) + ${entity.level * 24}px)` }}
                        className={entity.level > 0 ? 'user-permission-preview__entity-cell--child' : ''}
                      >
                        {entity.label}
                      </TableCell>
                      <TableCell className="user-permission-preview__permission-cell">
                        <PermissionIcon granted={perms.create} />
                      </TableCell>
                      <TableCell className="user-permission-preview__permission-cell">
                        <PermissionIcon granted={perms.read} />
                      </TableCell>
                      <TableCell className="user-permission-preview__permission-cell">
                        <PermissionIcon granted={perms.update} />
                      </TableCell>
                      <TableCell className="user-permission-preview__permission-cell">
                        <PermissionIcon granted={perms.delete} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
