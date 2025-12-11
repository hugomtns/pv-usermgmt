import { Users, UsersRound, Shield, Building2 } from 'lucide-react'
import './Sidebar.css'

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <h1 className="sidebar__title">PV User Management</h1>
      </div>

      <nav className="sidebar__nav">
        <a href="#users" className="sidebar__link">
          <Users size={20} strokeWidth={1.5} />
          <span>Users</span>
        </a>
        <a href="#groups" className="sidebar__link">
          <UsersRound size={20} strokeWidth={1.5} />
          <span>Groups</span>
        </a>
        <a href="#permissions" className="sidebar__link">
          <Shield size={20} strokeWidth={1.5} />
          <span>Permissions</span>
        </a>
        <a href="#entities" className="sidebar__link">
          <Building2 size={20} strokeWidth={1.5} />
          <span>Entities</span>
        </a>
      </nav>
    </aside>
  )
}
