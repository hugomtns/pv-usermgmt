import { useState, useEffect } from 'react';
import { Users, UsersRound, Shield, Building2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import './Sidebar.css';

export function Sidebar() {
  const [activeHash, setActiveHash] = useState('users');
  const { dispatch } = useApp();
  const { toast } = useToast();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'users';
      setActiveHash(hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data to the initial seed data? This action cannot be undone.')) {
      dispatch({ type: 'RESET_TO_SEED' });
      toast({
        title: 'Data reset successful',
        description: 'All data has been reset to the initial seed state.',
      });
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <h1 className="sidebar__title">PV User Management</h1>
      </div>

      <nav className="sidebar__nav">
        <a
          href="#users"
          className={`sidebar__link ${activeHash === 'users' ? 'sidebar__link--active' : ''}`}
        >
          <Users size={20} strokeWidth={1.5} />
          <span>Users</span>
        </a>
        <a
          href="#groups"
          className={`sidebar__link ${activeHash === 'groups' ? 'sidebar__link--active' : ''}`}
        >
          <UsersRound size={20} strokeWidth={1.5} />
          <span>Groups</span>
        </a>
        <a
          href="#permissions"
          className={`sidebar__link ${activeHash === 'permissions' ? 'sidebar__link--active' : ''}`}
        >
          <Shield size={20} strokeWidth={1.5} />
          <span>Permissions</span>
        </a>
        <a
          href="#entities"
          className={`sidebar__link ${activeHash === 'entities' ? 'sidebar__link--active' : ''}`}
        >
          <Building2 size={20} strokeWidth={1.5} />
          <span>Entities</span>
        </a>
      </nav>

      <div className="sidebar__footer">
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetData}
          className="sidebar__reset-button"
        >
          <RotateCcw size={16} strokeWidth={1.5} />
          Reset Data
        </Button>
      </div>
    </aside>
  );
}
