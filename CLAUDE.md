# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript RBAC (Role-Based Access Control) prototype for managing users, groups, and permissions in photovoltaic project teams. It's a fully client-side SPA using localStorage for persistence, built as a POC to validate requirements before backend development.

## Development Commands

### Running the Application
```bash
npm run dev           # Start dev server (Vite) - http://localhost:5173
npm run build         # Production build (runs TypeScript check first)
npm run preview       # Preview production build locally
npm run lint          # Run ESLint for code quality
```

### Key Development Workflows
- **Hot Reload**: Vite provides instant HMR - save any file to see changes
- **Type Checking**: `npm run build` will fail on TypeScript errors
- **No Tests**: This is a POC - no test suite configured yet

## High-Level Architecture

### State Management
- **Pattern**: React Context + useReducer (Redux-like without the library)
- **File**: `src/contexts/AppContext.tsx`
- **State Shape**:
  ```typescript
  {
    users: User[]
    groups: UserGroup[]
    entities: Entity[]
    roles: CustomRole[]
    permissionOverrides: GroupPermissionOverride[]
  }
  ```
- **Persistence**: Automatic localStorage sync on every state change via `useEffect`
- **Actions**: ADD/UPDATE/DELETE for each entity type, plus RESET_TO_SEED
- **Access**: Use `useApp()` hook in any component

### Permission System (Core Feature)

**Permission Resolution Algorithm** (`src/utils/permissionResolver.ts`):

The system uses **union-based permission logic** where multiple grants = broader access:

1. Start with **role default permissions** (CustomRole has full permission matrix)
2. Find all **group overrides** that apply (user's groups × entity type)
3. Apply union logic: `effectivePermission = basePermission || anyAllOverride || anySpecificOverride`
4. **Specific entity overrides** take precedence over "all" scope

Example:
- User role: Viewer (read-only)
- Group override: Engineering → designs → [create: true]
- Result: User can read ALL entities + create designs

**Key Types**:
- `CustomRole`: Full permission matrix for all entity types (can be system or custom)
- `GroupPermissionOverride`: Partial permission override with scope (all vs specific entities)
- `PermissionSet`: { create, read, update, delete } booleans
- `EntityType`: projects | project_files | financial_models | designs | design_files | design_comments | user_management

### Routing
- **Pattern**: Hash-based routing (no external library)
- **File**: `src/App.tsx`
- **Routes**: #users, #groups, #permissions, #entities
- **Mechanism**: `window.location.hash` listener + switch statement

### Component Organization
```
src/
├── pages/              # Route-level components (UsersPage, GroupsPage, etc.)
├── components/
│   ├── ui/             # shadcn/ui base components (auto-generated)
│   ├── layout/         # AppLayout, Sidebar
│   ├── users/          # User management components
│   ├── groups/         # Group management components
│   ├── permissions/    # Permission/role management (PermissionMatrix, RoleForm, etc.)
│   └── entities/       # Entity tree browser
├── contexts/           # AppContext (state management)
├── types/              # TypeScript interfaces (user, group, role, permission, entity)
├── data/               # Seed data (seedUsers, seedGroups, seedRoles, seedEntities)
├── utils/              # permissionResolver, storage (localStorage wrapper)
└── styles/             # Global CSS (tokens.css, globals.css, reset.css)
```

**Pages manage dialog/modal states** - child components receive callbacks and open/close props.

### Styling Approach
- **NO Tailwind classes in usage** (only in shadcn internals)
- **CSS Modules + BEM convention** - each component has `.tsx` + `.css` file
- **CSS Variables for theming** - see `src/styles/tokens.css` and `globals.css`
- **Icons**: Lucide React only (line-style, consistent sizing)

## Important Implementation Details

### Data Flow for State Changes
```
Component → Dispatch Action → Reducer (AppContext.tsx) → New State
                                    ↓
                              localStorage sync (useEffect)
                                    ↓
                              Component re-render
```

### Data Migration on Load
`AppContext.tsx` (lines 22-59) handles backward compatibility:
- Migrates old `{ role: 'admin' }` → new `{ roleId: 'role-admin' }`
- Initializes missing roles from seed data
- Falls back to seed data if localStorage corrupt/missing

### localStorage Keys
Defined in `src/utils/storage.ts`:
- `PV_USERMGMT_STATE` - entire app state
- `PV_USERMGMT_VERSION` - for migrations

### System Roles (Immutable)
Three built-in roles with `isSystem: true` (cannot delete):
- **Admin**: Full access to everything
- **User**: Full access to content, read-only to user_management
- **Viewer**: Read-only access (no user_management access)

Custom roles can be created/deleted freely.

### Entity Hierarchy
```
User Management (standalone)

Projects
├── Project Files
├── Financial Models
└── Designs
    ├── Design Files
    └── Design Comments
```

### shadcn/ui Components
Installed via MCP server (auto-configured):
- Button, Card, Dialog, Input, Select, Table, Badge, Tabs, Checkbox, Separator, Label, Toast
- Customized via CSS variables in `globals.css`
- Located in `src/components/ui/` (auto-generated)

## Key Files for Understanding

**To understand the system quickly, read in this order:**

1. **Types** (data model):
   - `src/types/index.ts` - all type exports
   - `src/types/user.ts`, `role.ts`, `permission.ts` - core entities

2. **State** (data flow):
   - `src/contexts/AppContext.tsx` - reducer + actions
   - `src/utils/storage.ts` - persistence layer

3. **Permission Logic** (core feature):
   - `src/utils/permissionResolver.ts` - resolution algorithm

4. **Pages** (UI entry points):
   - `src/pages/UsersPage.tsx` - user management
   - `src/pages/PermissionsPage.tsx` - role + override management

5. **Reusable Components**:
   - `src/components/permissions/PermissionMatrix.tsx` - CRUD grid display

## Implementation Plan

There is a detailed **Epic/Story-based implementation plan** in:
`PV_USER_MANAGEMENT_PERMISSIONS_POC_IMPLEMENTATION_PLAN.md`

**CRITICAL**: This plan contains strict rules:
- One story at a time
- One commit per story
- Test before committing
- No premature optimization
- CSS in separate files (no inline styles, no Tailwind classes in usage)

If working on a specific story, always reference the plan for acceptance criteria and technical specifications.

## Future Extension Points

When this POC becomes production:

1. **Backend Integration**:
   - Replace `src/utils/storage.ts` with API client
   - Add authentication/session management
   - Add server-side permission checks

2. **Performance Optimization**:
   - Cache permission resolution results (memoization)
   - Index overrides by groupId for O(1) lookups
   - Consider React Query or SWR for data fetching

3. **Advanced Permissions**:
   - Time-based permissions (expiration)
   - Conditional rules (e.g., "only during business hours")
   - Hierarchical entity permissions (inherit from parent)

4. **Testing**:
   - Unit tests for `permissionResolver.ts` (pure function, easy to test)
   - Reducer tests (state transitions)
   - Component tests with React Testing Library
