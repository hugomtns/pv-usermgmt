import { Check, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PermissionSet } from '@/types';
import './PermissionMatrix.css';

interface PermissionMatrixProps {
  entityTypes: { key: string; label: string; level?: number }[];
  permissionData: Record<string, PermissionSet>;
  editable?: boolean;
  onChange?: (entityKey: string, action: keyof PermissionSet, value: boolean) => void;
}

function PermissionIcon({ granted }: { granted: boolean }) {
  if (granted) {
    return <Check size={16} strokeWidth={2} className="permission-matrix__icon permission-matrix__icon--granted" />;
  }
  return <X size={16} strokeWidth={2} className="permission-matrix__icon permission-matrix__icon--denied" />;
}

export function PermissionMatrix({ entityTypes, permissionData, editable = false, onChange }: PermissionMatrixProps) {
  const handleCheckboxChange = (entityKey: string, action: keyof PermissionSet, checked: boolean) => {
    onChange?.(entityKey, action, checked);
  };

  const renderPermissionCell = (entityKey: string, action: keyof PermissionSet) => {
    const permissions = permissionData[entityKey];
    const granted = permissions?.[action] ?? false;

    if (editable) {
      return (
        <div className="permission-matrix__checkbox-cell">
          <Checkbox
            checked={granted}
            onCheckedChange={(checked) => handleCheckboxChange(entityKey, action, checked as boolean)}
          />
        </div>
      );
    }

    return (
      <div className="permission-matrix__icon-cell">
        <PermissionIcon granted={granted} />
      </div>
    );
  };

  return (
    <div className="permission-matrix">
      <div className="permission-matrix__table-wrapper">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="permission-matrix__entity-header">Entity</TableHead>
              <TableHead className="permission-matrix__action-header">Create</TableHead>
              <TableHead className="permission-matrix__action-header">Read</TableHead>
              <TableHead className="permission-matrix__action-header">Update</TableHead>
              <TableHead className="permission-matrix__action-header">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entityTypes.map((entity) => (
              <TableRow key={entity.key}>
                <TableCell
                  className="permission-matrix__entity-cell"
                  style={{
                    paddingLeft: entity.level ? `calc(var(--space-4) + ${entity.level * 24}px)` : undefined
                  }}
                >
                  <span className={entity.level ? 'permission-matrix__entity-label--child' : ''}>
                    {entity.label}
                  </span>
                </TableCell>
                <TableCell>{renderPermissionCell(entity.key, 'create')}</TableCell>
                <TableCell>{renderPermissionCell(entity.key, 'read')}</TableCell>
                <TableCell>{renderPermissionCell(entity.key, 'update')}</TableCell>
                <TableCell>{renderPermissionCell(entity.key, 'delete')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
