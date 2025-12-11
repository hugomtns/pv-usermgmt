import { useState, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { UsersPage } from './pages/UsersPage';
import { GroupsPage } from './pages/GroupsPage';
import { PermissionsPage } from './pages/PermissionsPage';
import { EntitiesPage } from './pages/EntitiesPage';

function App() {
  const [currentPage, setCurrentPage] = useState('users');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'users';
      setCurrentPage(hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'users':
        return <UsersPage />;
      case 'groups':
        return <GroupsPage />;
      case 'permissions':
        return <PermissionsPage />;
      case 'entities':
        return <EntitiesPage />;
      default:
        return <UsersPage />;
    }
  };

  return (
    <AppLayout>
      {renderPage()}
    </AppLayout>
  );
}

export default App;
