import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoleDefaults } from '@/components/permissions/RoleDefaults';
import './PermissionsPage.css';

export function PermissionsPage() {
  return (
    <div className="permissions-page">
      <div className="permissions-page__header">
        <h1 className="permissions-page__title">Permissions Management</h1>
        <p className="permissions-page__description">
          View and manage role-based permissions and group overrides.
        </p>
      </div>

      <Tabs defaultValue="role-defaults" className="permissions-page__tabs">
        <TabsList>
          <TabsTrigger value="role-defaults">Role Defaults</TabsTrigger>
          <TabsTrigger value="group-overrides">Group Overrides</TabsTrigger>
        </TabsList>

        <TabsContent value="role-defaults" className="permissions-page__tab-content">
          <RoleDefaults />
        </TabsContent>

        <TabsContent value="group-overrides" className="permissions-page__tab-content">
          <div className="permissions-page__placeholder">
            <h3>Group Permission Overrides</h3>
            <p>Group override management coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
