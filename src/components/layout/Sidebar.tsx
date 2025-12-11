import { useState, useEffect } from 'react';
import { Users, UsersRound, Shield, Building2 } from 'lucide-react';
import './Sidebar.css';

export function Sidebar() {
  const [activeHash, setActiveHash] = useState('users');

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
    </aside>
  );
}
