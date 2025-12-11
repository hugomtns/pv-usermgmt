import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoleDefaults } from '@/components/permissions/RoleDefaults';
import { RoleManagement } from '@/components/permissions/RoleManagement';
import { RoleForm } from '@/components/permissions/RoleForm';
import { RoleDeleteDialog } from '@/components/permissions/RoleDeleteDialog';
import { GroupOverrideForm } from '@/components/permissions/GroupOverrideForm';
import { GroupOverrides } from '@/components/permissions/GroupOverrides';
import { CustomRole } from '@/types/role';
import './PermissionsPage.css';

export function PermissionsPage() {
  const [roleFormOpen, setRoleFormOpen] = useState(false);
  const [roleFormMode, setRoleFormMode] = useState<'create' | 'edit'>('create');
  const [selectedRole, setSelectedRole] = useState<CustomRole | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleCreateRole = () => {
    setSelectedRole(null);
    setRoleFormMode('create');
    setRoleFormOpen(true);
  };

  const handleEditRole = (role: CustomRole) => {
    setSelectedRole(role);
    setRoleFormMode('edit');
    setRoleFormOpen(true);
  };

  const handleDeleteRole = (role: CustomRole) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="permissions-page">
      <div className="permissions-page__header">
        <h1 className="permissions-page__title">Permissions Management</h1>
        <p className="permissions-page__description">
          Manage roles and group permission overrides.
        </p>
      </div>

      <Tabs defaultValue="roles" className="permissions-page__tabs">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="role-defaults">Role Defaults</TabsTrigger>
          <TabsTrigger value="group-overrides">Group Overrides</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="permissions-page__tab-content">
          <RoleManagement
            onCreateRole={handleCreateRole}
            onEditRole={handleEditRole}
            onDeleteRole={handleDeleteRole}
          />
        </TabsContent>

        <TabsContent value="role-defaults" className="permissions-page__tab-content">
          <RoleDefaults />
        </TabsContent>

        <TabsContent value="group-overrides" className="permissions-page__tab-content">
          <div className="permissions-page__overrides-layout">
            <aside className="permissions-page__overrides-sidebar">
              <GroupOverrideForm />
            </aside>
            <main className="permissions-page__overrides-main">
              <div className="permissions-page__notice">
                <p className="permissions-page__notice-text">
                  <strong>Note:</strong> Group permissions are now managed on the Groups page.
                  Use the "Permissions" button on each group card to configure group-specific permission overrides.
                </p>
              </div>
              <GroupOverrides readOnly />
            </main>
          </div>
        </TabsContent>
      </Tabs>

      <RoleForm
        role={selectedRole}
        mode={roleFormMode}
        open={roleFormOpen}
        onOpenChange={setRoleFormOpen}
      />

      <RoleDeleteDialog
        role={selectedRole}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  );
}
