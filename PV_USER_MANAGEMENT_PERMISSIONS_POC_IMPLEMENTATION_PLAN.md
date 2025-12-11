# PV User Management & Permissions POC — Implementation Plan

## Claude Code Instructions

**READ THIS FIRST BEFORE ANY IMPLEMENTATION**

You are implementing a user management and permissions (RBAC) prototype for photovoltaic project teams. This plan is organized into Epics and Stories. Follow these rules strictly:

### Implementation Rules

1. **One story at a time.** Complete and test each story before moving to the next. Do not implement multiple stories in a single session.

2. **One commit per story.** Each story should result in exactly one commit with a clear message referencing the story ID (e.g., `feat(E1-S1): initialize project with Vite and React`).

3. **Test before committing.** Every story has acceptance criteria. Verify all criteria pass before committing. Run the app and manually test the feature.

4. **No premature optimization.** Implement the simplest solution that satisfies the acceptance criteria. Refactoring is a separate task.

5. **Follow the file structure.** Place files in the designated locations. Do not reorganize unless a story explicitly requires it.

6. **CSS in separate files.** No inline styles, no Tailwind. Each component has a corresponding `.css` file. Use BEM naming convention.

7. **Use shadcn MCP for components.** You have access to the shadcn MCP server. Use it to install components:
   - First, run the shadcn MCP `get_started` tool to initialize shadcn/ui in the project
   - Use `add_component` to install individual components as needed (Button, Dialog, Input, Select, Table, Checkbox, etc.)
   - Customize component styles via CSS variables in `globals.css`

8. **TypeScript strict mode.** All code must be properly typed. Define interfaces in `/src/types/`.

9. **State management.** Use React Context + useReducer for global state (users, groups, permissions). No external state libraries.

10. **Mock data.** All data is client-side. Use localStorage for persistence across sessions. Initialize with seed data on first load.

11. **Icons.** Use Lucide React for all icons. Follow these conventions:
    - Use **line-style icons only** (the default Lucide style) — no filled/solid variants, no emoji-style icons
    - Consistent sizing: `size={16}` for inline/buttons, `size={20}` for standalone, `size={24}` for headers
    - Add `strokeWidth={1.5}` for a lighter, more refined look (default is 2)
    - Always pair icons with text for accessibility, or add `aria-label` for icon-only buttons
    - Common icons for this app:
      - Users: `Users`, `UserPlus`, `UserCog`
      - Groups: `UsersRound`, `Group`
      - Actions: `Plus`, `Pencil`, `Trash2`, `Eye`, `Check`, `X`
      - Permissions: `Shield`, `ShieldCheck`, `Lock`, `Unlock`
      - Navigation: `ChevronRight`, `ChevronDown`, `FolderOpen`, `File`
      - Entities: `Building2` (projects), `FileText`, `Calculator` (financial), `PenTool` (designs), `MessageSquare` (comments)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Components | shadcn/ui (via MCP) |
| Styling | CSS Modules + CSS Variables (design tokens) |
| State | React Context + useReducer |
| Persistence | localStorage (mock) |
| Icons | Lucide React |

---

## File Structure

```
src/
├── components/
│   ├── ui/                      # shadcn/ui components (auto-generated)
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── AppLayout.css
│   │   ├── Sidebar.tsx
│   │   └── Sidebar.css
│   ├── users/
│   │   ├── UserInviteForm.tsx
│   │   ├── UserInviteForm.css
│   │   ├── UserList.tsx
│   │   ├── UserList.css
│   │   ├── UserEditDialog.tsx
│   │   └── UserEditDialog.css
│   ├── groups/
│   │   ├── GroupList.tsx
│   │   ├── GroupList.css
│   │   ├── GroupForm.tsx
│   │   ├── GroupForm.css
│   │   ├── GroupMembersDialog.tsx
│   │   └── GroupMembersDialog.css
│   ├── permissions/
│   │   ├── PermissionMatrix.tsx
│   │   ├── PermissionMatrix.css
│   │   ├── RoleDefaults.tsx
│   │   ├── RoleDefaults.css
│   │   ├── GroupOverrides.tsx
│   │   ├── GroupOverrides.css
│   │   ├── EntitySelector.tsx
│   │   └── EntitySelector.css
│   └── entities/
│       ├── EntityTree.tsx
│       └── EntityTree.css
├── contexts/
│   ├── AppContext.tsx
│   └── AppContext.types.ts
├── hooks/
│   ├── usePermissions.ts
│   └── useLocalStorage.ts
├── types/
│   ├── user.ts
│   ├── group.ts
│   ├── permission.ts
│   └── entity.ts
├── data/
│   ├── seedUsers.ts
│   ├── seedGroups.ts
│   ├── seedEntities.ts
│   └── defaultPermissions.ts
├── utils/
│   ├── permissionResolver.ts
│   └── storage.ts
├── styles/
│   ├── globals.css              # CSS variables / design tokens
│   ├── reset.css
│   └── tokens.css
├── App.tsx
├── App.css
└── main.tsx
```

---

## Data Models (TypeScript Interfaces)

```typescript
// src/types/user.ts
export type Role = 'admin' | 'user' | 'viewer';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  function: string;           // Job function/title
  role: Role;
  groupIds: string[];
  createdAt: string;
  updatedAt: string;
}

// src/types/group.ts
export interface UserGroup {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

// src/types/entity.ts
export type EntityType = 
  | 'projects'
  | 'project_files'
  | 'financial_models'
  | 'designs'
  | 'design_files'
  | 'design_comments'
  | 'user_management';

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  parentId: string | null;    // For hierarchy
  children?: Entity[];
}

// src/types/permission.ts
export type PermissionAction = 'create' | 'read' | 'update' | 'delete';

export type PermissionValue = boolean;

export interface PermissionSet {
  create: PermissionValue;
  read: PermissionValue;
  update: PermissionValue;
  delete: PermissionValue;
}

// Role-based default permissions (baseline)
export interface RolePermissions {
  role: Role;
  permissions: Record<EntityType, PermissionSet>;
}

// Group override - applies to ALL entities of a type OR specific entities
export interface GroupPermissionOverride {
  id: string;
  groupId: string;
  entityType: EntityType;
  scope: 'all' | 'specific';
  specificEntityIds: string[];  // Only used when scope === 'specific'
  permissions: Partial<PermissionSet>;  // Only overridden actions
}
```

---

## Default Role Permissions

| Entity Type | Admin | User | Viewer |
|-------------|-------|------|--------|
| **Projects** | CRUD | CRUD | R |
| → Project Files | CRUD | CRUD | R |
| → Financial Models | CRUD | CRUD | R |
| → Designs | CRUD | CRUD | R |
| →→ Design Files | CRUD | CRUD | R |
| →→ Design Comments | CRUD | CRUD | R |
| **User Management** | CRUD | R | — |

Legend: C=Create, R=Read, U=Update, D=Delete, —=No Access

---

## Permission Resolution Logic

When resolving a user's effective permissions for an entity:

```
1. Start with ROLE DEFAULTS for the user's role
2. Get all GROUPS the user belongs to
3. For each group, check for OVERRIDES matching the entity type
4. Apply overrides using UNION with HIGHEST PERMISSION WINS:
   - If any override grants 'create', user can create
   - If any override grants 'read', user can read
   - etc.
5. Specific entity overrides take precedence over "all" overrides
```

---

## Mock Data Seed

### Users (5)
- Maria Silva (Admin) - Engineering Director
- João Santos (User) - Senior Design Engineer  
- Ana Costa (User) - Project Manager
- Pedro Oliveira (Viewer) - Client Representative
- Clara Fernandes (Viewer) - External Auditor

### Groups (3)
- "Project Alpha Team" - João, Ana
- "External Reviewers" - Pedro, Clara
- "Design Leads" - Maria, João

### Entities (Mock Projects/Designs)
- Project: "Solar Farm Alentejo" (with files, models, designs)
- Project: "Rooftop Porto Industrial" (with files, models, designs)
- Project: "Floating PV Alqueva" (with files, models, designs)

---

## Epic 0: Project Setup & Design System

### E0-S1: Initialize Vite + React + TypeScript Project

**Description:** Bootstrap the project with Vite, React 18, and TypeScript in strict mode.

**Tasks:**
- [ ] Create new Vite project: `npm create vite@latest pv-user-management -- --template react-ts`
- [ ] Enable strict mode in `tsconfig.json`
- [ ] Clean up default Vite boilerplate
- [ ] Verify dev server runs without errors

**Acceptance Criteria:**
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes without TypeScript errors
- [ ] Browser shows blank React app

---

### E0-S2: Initialize shadcn/ui via MCP

**Description:** Use the shadcn MCP to set up the component library and design tokens.

**Tasks:**
- [ ] Run shadcn MCP `get_started` tool to initialize shadcn/ui
- [ ] Configure `components.json` for CSS variables (not Tailwind classes)
- [ ] Create `src/styles/tokens.css` with design tokens (colors, spacing, typography)
- [ ] Create `src/styles/globals.css` importing tokens and setting CSS variables
- [ ] Create `src/styles/reset.css` with CSS reset

**Acceptance Criteria:**
- [ ] shadcn/ui is initialized in project
- [ ] CSS variables defined in `:root` for colors, spacing, fonts
- [ ] Global styles applied correctly

---

### E0-S3: Install Base shadcn Components

**Description:** Install the foundational shadcn/ui components needed throughout the app.

**Tasks:**
- [ ] Use shadcn MCP `add_component` for: Button, Input, Label, Select, Dialog, Table, Checkbox, Card, Badge, Separator, Tabs
- [ ] Verify all components render correctly
- [ ] Override component CSS variables in `globals.css` to match design tokens

**Acceptance Criteria:**
- [ ] All listed components installed and importable
- [ ] Components use CSS variables for theming
- [ ] No Tailwind utility classes in component usage (only in shadcn internals)

---

### E0-S4: Create App Layout Shell

**Description:** Create the main application layout with sidebar navigation.

**Tasks:**
- [ ] Create `AppLayout.tsx` with header and sidebar
- [ ] Create `Sidebar.tsx` with navigation links: Users, Groups, Permissions, Entities
- [ ] Style with BEM in separate `.css` files
- [ ] Add placeholder content area

**Acceptance Criteria:**
- [ ] Layout renders with sidebar and main content area
- [ ] Navigation links are visible (non-functional for now)
- [ ] Responsive: sidebar collapses on mobile (optional, can defer)

---

## Epic 1: Type Definitions & State Management

### E1-S1: Define TypeScript Interfaces

**Description:** Create all type definitions for the application domain.

**Tasks:**
- [ ] Create `src/types/user.ts` with User and Role types
- [ ] Create `src/types/group.ts` with UserGroup type
- [ ] Create `src/types/entity.ts` with Entity and EntityType types
- [ ] Create `src/types/permission.ts` with PermissionSet, RolePermissions, GroupPermissionOverride types
- [ ] Export all types from `src/types/index.ts`

**Acceptance Criteria:**
- [ ] All interfaces match the Data Models section above
- [ ] No TypeScript errors
- [ ] Types are importable from `@/types`

---

### E1-S2: Create Mock Data Seeds

**Description:** Create seed data files for users, groups, and entities.

**Tasks:**
- [ ] Create `src/data/seedUsers.ts` with 5 mock users
- [ ] Create `src/data/seedGroups.ts` with 3 mock groups
- [ ] Create `src/data/seedEntities.ts` with mock project hierarchy
- [ ] Create `src/data/defaultPermissions.ts` with role permission defaults

**Acceptance Criteria:**
- [ ] Seed data matches the Mock Data Seed section above
- [ ] All IDs are unique UUIDs
- [ ] Group memberIds reference valid user IDs
- [ ] User groupIds reference valid group IDs

---

### E1-S3: Implement App Context & Reducer

**Description:** Create global state management with React Context and useReducer.

**Tasks:**
- [ ] Create `src/contexts/AppContext.types.ts` with state shape and action types
- [ ] Create `src/contexts/AppContext.tsx` with:
  - AppState interface (users, groups, entities, permissionOverrides)
  - AppAction union type (ADD_USER, UPDATE_USER, DELETE_USER, etc.)
  - appReducer function
  - AppProvider component
  - useApp hook
- [ ] Initialize state from localStorage or seed data
- [ ] Persist state changes to localStorage

**Acceptance Criteria:**
- [ ] Context provides users, groups, entities, permissionOverrides
- [ ] Dispatch actions correctly update state
- [ ] State persists across page refreshes (localStorage)
- [ ] First load initializes from seed data

---

### E1-S4: Create localStorage Utility

**Description:** Create utility for localStorage operations with type safety.

**Tasks:**
- [ ] Create `src/utils/storage.ts` with:
  - `getStorageItem<T>(key: string, fallback: T): T`
  - `setStorageItem<T>(key: string, value: T): void`
  - `clearStorage(): void`
- [ ] Add storage keys constants

**Acceptance Criteria:**
- [ ] Functions handle JSON parse/stringify
- [ ] Type-safe get/set operations
- [ ] Graceful handling of localStorage errors

---

## Epic 2: User Management

### E2-S1: Create User Invite Form

**Description:** Build the form to invite new users with all required fields.

**Tasks:**
- [ ] Create `UserInviteForm.tsx` with fields:
  - First Name (text input, required)
  - Last Name (text input, required)
  - Email (email input, required, validated)
  - Function (text input, required) — job title/role description
  - Role (select: Admin, User, Viewer)
- [ ] Add form validation (required fields, email format)
- [ ] Dispatch ADD_USER action on submit
- [ ] Clear form after successful submission
- [ ] Style with `UserInviteForm.css`

**Acceptance Criteria:**
- [ ] All fields render correctly
- [ ] Validation prevents submission with empty required fields
- [ ] Invalid email shows error message
- [ ] Successful submission adds user to state
- [ ] Form clears after submission

---

### E2-S2: Create User List Table

**Description:** Display all users in a sortable, searchable table.

**Tasks:**
- [ ] Create `UserList.tsx` using shadcn Table component
- [ ] Display columns: Name, Email, Function, Role, Groups, Actions
- [ ] Add search/filter input (filters by name or email)
- [ ] Add "Edit" and "Delete" action buttons per row
- [ ] Style with `UserList.css`

**Acceptance Criteria:**
- [ ] All users from state display in table
- [ ] Search filters users in real-time
- [ ] Edit button exists (functionality in next story)
- [ ] Delete button removes user from state (with confirmation)

---

### E2-S3: Create User Edit Dialog

**Description:** Modal dialog to edit existing user details.

**Tasks:**
- [ ] Create `UserEditDialog.tsx` using shadcn Dialog
- [ ] Pre-populate form with selected user's data
- [ ] Allow editing: First Name, Last Name, Email, Function, Role
- [ ] Dispatch UPDATE_USER action on save
- [ ] Add cancel button to close without saving

**Acceptance Criteria:**
- [ ] Dialog opens when Edit button clicked
- [ ] Form shows current user values
- [ ] Save updates user in state
- [ ] Cancel closes dialog without changes
- [ ] Dialog closes after successful save

---

### E2-S4: Wire Up Users Page

**Description:** Create the Users page combining invite form and user list.

**Tasks:**
- [ ] Create `src/pages/UsersPage.tsx`
- [ ] Layout: Invite form on top/side, User list below/main
- [ ] Connect to AppContext
- [ ] Add to sidebar navigation

**Acceptance Criteria:**
- [ ] Users page accessible from sidebar
- [ ] Invite form and user list both visible
- [ ] New users appear in list immediately after invite
- [ ] Edits reflect immediately in list

---

## Epic 3: User Groups

### E3-S1: Create Group List

**Description:** Display all user groups with member counts.

**Tasks:**
- [ ] Create `GroupList.tsx` using shadcn Table or Card layout
- [ ] Display: Group Name, Description, Member Count, Actions
- [ ] Add "Edit", "Manage Members", "Delete" actions
- [ ] Style with `GroupList.css`

**Acceptance Criteria:**
- [ ] All groups from state display
- [ ] Member count shows correctly
- [ ] Action buttons visible

---

### E3-S2: Create Group Form (Add/Edit)

**Description:** Form to create new groups or edit existing ones.

**Tasks:**
- [ ] Create `GroupForm.tsx` with fields:
  - Name (text input, required)
  - Description (textarea, optional)
- [ ] Support both "create" and "edit" modes
- [ ] Dispatch ADD_GROUP or UPDATE_GROUP actions

**Acceptance Criteria:**
- [ ] Create mode: empty form, creates new group
- [ ] Edit mode: pre-populated, updates existing group
- [ ] Validation for required name field

---

### E3-S3: Create Group Members Dialog

**Description:** Dialog to add/remove users from a group.

**Tasks:**
- [ ] Create `GroupMembersDialog.tsx` using shadcn Dialog
- [ ] Show list of all users with checkboxes
- [ ] Pre-check users already in group
- [ ] Save updates group memberIds and user groupIds
- [ ] Style with `GroupMembersDialog.css`

**Acceptance Criteria:**
- [ ] Dialog shows all users
- [ ] Current members are checked
- [ ] Checking/unchecking users updates membership
- [ ] Save persists changes to both group and user records

---

### E3-S4: Wire Up Groups Page

**Description:** Create the Groups page with list and form.

**Tasks:**
- [ ] Create `src/pages/GroupsPage.tsx`
- [ ] Layout: Add Group button, Group list, dialogs for edit/members
- [ ] Connect to AppContext
- [ ] Add to sidebar navigation

**Acceptance Criteria:**
- [ ] Groups page accessible from sidebar
- [ ] Can create, edit, delete groups
- [ ] Can manage group membership

---

## Epic 4: Permission Matrix & Role Defaults

### E4-S1: Create Role Defaults Display

**Description:** Show the default CRUD permissions for each role.

**Tasks:**
- [ ] Create `RoleDefaults.tsx` 
- [ ] Display matrix: Rows = Entity Types, Columns = Roles (Admin, User, Viewer)
- [ ] Show CRUD as icons or checkmarks (read-only display)
- [ ] Use hierarchical indentation for nested entity types
- [ ] Style with `RoleDefaults.css`

**Acceptance Criteria:**
- [ ] Matrix shows all entity types with correct hierarchy
- [ ] Admin shows CRUD for all except User Management special case
- [ ] User shows CRUD for content, R for User Management
- [ ] Viewer shows R for content, — for User Management
- [ ] Clear visual hierarchy (Projects → Files, Designs → Design Files)

---

### E4-S2: Create Permission Matrix Component

**Description:** Reusable permission matrix grid component.

**Tasks:**
- [ ] Create `PermissionMatrix.tsx` as generic component
- [ ] Props: entityTypes, permissionData, editable (boolean), onChange
- [ ] Render grid with CRUD columns
- [ ] If editable, use Checkboxes; if not, use icons/badges
- [ ] Style with `PermissionMatrix.css`

**Acceptance Criteria:**
- [ ] Component renders permission grid
- [ ] Read-only mode shows current permissions
- [ ] Editable mode allows toggling permissions
- [ ] onChange callback fires with updated permissions

---

### E4-S3: Wire Up Permissions Overview Page

**Description:** Page showing role defaults and navigation to group overrides.

**Tasks:**
- [ ] Create `src/pages/PermissionsPage.tsx`
- [ ] Show Role Defaults matrix (read-only)
- [ ] Add section/tab for "Group Overrides" (content in next epic)
- [ ] Add to sidebar navigation

**Acceptance Criteria:**
- [ ] Permissions page accessible from sidebar
- [ ] Role defaults clearly displayed
- [ ] Tab/section structure for future group overrides

---

## Epic 5: Group Permission Overrides

### E5-S1: Create Entity Selector Component

**Description:** Component to select scope (ALL vs SPECIFIC) and specific entities.

**Tasks:**
- [ ] Create `EntitySelector.tsx`
- [ ] Props: entityType, scope, selectedEntityIds, onChange
- [ ] Radio buttons: "All [Entity Type]" vs "Specific [Entity Type]"
- [ ] If "Specific" selected, show multi-select with entity names from mock data
- [ ] Style with `EntitySelector.css`

**Acceptance Criteria:**
- [ ] Can toggle between "All" and "Specific"
- [ ] Multi-select only visible when "Specific" chosen
- [ ] Multi-select shows entities of the selected type
- [ ] Selection changes fire onChange

---

### E5-S2: Create Group Override Form

**Description:** Form to create/edit permission overrides for a group.

**Tasks:**
- [ ] Create `GroupOverrideForm.tsx`
- [ ] Fields:
  - Select Group (dropdown of all groups)
  - Select Entity Type (dropdown, exclude User Management)
  - Entity Selector (ALL vs SPECIFIC with multi-select)
  - Permission checkboxes (C, R, U, D)
- [ ] Dispatch ADD_PERMISSION_OVERRIDE or UPDATE_PERMISSION_OVERRIDE

**Acceptance Criteria:**
- [ ] Can select group and entity type
- [ ] Can choose scope and specific entities
- [ ] Can toggle CRUD permissions
- [ ] Save creates/updates override in state

---

### E5-S3: Create Group Overrides List

**Description:** Display existing permission overrides with ability to edit/delete.

**Tasks:**
- [ ] Create `GroupOverrides.tsx`
- [ ] List all GroupPermissionOverride records
- [ ] Display: Group Name, Entity Type, Scope, Permissions, Actions
- [ ] Add Edit and Delete actions
- [ ] Style with `GroupOverrides.css`

**Acceptance Criteria:**
- [ ] All overrides display in list
- [ ] Scope shows "All" or lists specific entity names
- [ ] Can edit existing override
- [ ] Can delete override

---

### E5-S4: Integrate Overrides into Permissions Page

**Description:** Add group overrides section to Permissions page.

**Tasks:**
- [ ] Add "Group Overrides" tab/section to PermissionsPage
- [ ] Include GroupOverrides list and "Add Override" button
- [ ] Add GroupOverrideForm in a dialog

**Acceptance Criteria:**
- [ ] Can view all group overrides
- [ ] Can add new overrides via dialog
- [ ] Can edit/delete existing overrides

---

## Epic 6: Permission Resolution & Testing

### E6-S1: Implement Permission Resolver

**Description:** Utility function to calculate effective permissions for a user.

**Tasks:**
- [ ] Create `src/utils/permissionResolver.ts`
- [ ] Function: `resolvePermissions(user: User, entityType: EntityType, entityId?: string): PermissionSet`
- [ ] Logic:
  1. Get role defaults for user's role
  2. Get all groups user belongs to
  3. Find overrides for those groups matching entityType
  4. Apply union logic (highest permission wins)
  5. Specific entity overrides take precedence
- [ ] Export function

**Acceptance Criteria:**
- [ ] Returns correct permissions for user with no group overrides
- [ ] Returns elevated permissions when group override grants more
- [ ] Specific entity overrides override "all" overrides
- [ ] Multiple group memberships union correctly

---

### E6-S2: Create User Permission Preview

**Description:** UI to preview a user's effective permissions.

**Tasks:**
- [ ] Create `UserPermissionPreview.tsx`
- [ ] Select a user from dropdown
- [ ] Display their effective permissions for all entity types
- [ ] Show which permissions come from role vs group override
- [ ] Style appropriately

**Acceptance Criteria:**
- [ ] Can select any user
- [ ] Shows effective CRUD for each entity type
- [ ] Visual indicator for overridden permissions (e.g., highlight or icon)

---

### E6-S3: Add Preview to Users Page

**Description:** Integrate permission preview into user management.

**Tasks:**
- [ ] Add "View Permissions" action to UserList
- [ ] Open preview in dialog or side panel
- [ ] Show user's effective permissions with override source

**Acceptance Criteria:**
- [ ] Can access permission preview from user list
- [ ] Preview shows accurate resolved permissions
- [ ] Clear indication of base role vs overrides

---

## Epic 7: Entity Browser (Simple)

### E7-S1: Create Entity Tree View

**Description:** Simple tree view showing the entity hierarchy for context.

**Tasks:**
- [ ] Create `EntityTree.tsx`
- [ ] Display mock entities in tree structure:
  - Projects (collapsible)
    - Project Files
    - Financial Models
    - Designs (collapsible)
      - Design Files
      - Design Comments
- [ ] Show entity names from mock data
- [ ] Style with `EntityTree.css`

**Acceptance Criteria:**
- [ ] Tree renders all mock entities
- [ ] Hierarchy is visually clear (indentation, icons)
- [ ] Can expand/collapse parent nodes

---

### E7-S2: Wire Up Entities Page

**Description:** Create Entities page with tree view.

**Tasks:**
- [ ] Create `src/pages/EntitiesPage.tsx`
- [ ] Display EntityTree
- [ ] Add to sidebar navigation
- [ ] Optional: clicking entity shows its ID (for permission testing)

**Acceptance Criteria:**
- [ ] Entities page accessible from sidebar
- [ ] Tree displays correctly
- [ ] Provides context for permission system

---

## Epic 8: Polish & Final Testing

### E8-S1: Add Toast Notifications

**Description:** User feedback for actions (create, update, delete).

**Tasks:**
- [ ] Install shadcn Toast component via MCP
- [ ] Add toast notifications for:
  - User invited successfully
  - User updated/deleted
  - Group created/updated/deleted
  - Permission override saved
- [ ] Style consistently

**Acceptance Criteria:**
- [ ] Toasts appear for all CRUD operations
- [ ] Success and error states distinguished
- [ ] Toasts auto-dismiss

---

### E8-S2: Add Data Reset Functionality

**Description:** Allow resetting to seed data for demo purposes.

**Tasks:**
- [ ] Add "Reset Demo Data" button in settings/header
- [ ] Confirmation dialog before reset
- [ ] Clear localStorage and reinitialize from seed

**Acceptance Criteria:**
- [ ] Reset button accessible
- [ ] Confirmation prevents accidental reset
- [ ] App returns to initial seed state

---

### E8-S3: Responsive Layout Polish

**Description:** Ensure app works on different screen sizes.

**Tasks:**
- [ ] Test on mobile viewport
- [ ] Adjust sidebar (collapsible drawer on mobile)
- [ ] Ensure tables scroll horizontally if needed
- [ ] Dialog sizing appropriate for mobile

**Acceptance Criteria:**
- [ ] Usable on mobile viewport (375px)
- [ ] Usable on tablet viewport (768px)
- [ ] Desktop experience unchanged

---

### E8-S4: End-to-End Walkthrough Test

**Description:** Manual test of complete user journey.

**Tasks:**
- [ ] Reset to seed data
- [ ] Invite a new user (test all fields)
- [ ] Edit that user's role
- [ ] Create a new group
- [ ] Add users to the group
- [ ] Create permission override for the group
- [ ] Verify user's effective permissions updated
- [ ] Delete override and verify permissions revert

**Acceptance Criteria:**
- [ ] All flows complete without errors
- [ ] State persists across refresh
- [ ] Permission resolution accurate throughout

---

## Story Checklist Template

Use this checklist for each story:

```
### Before Starting
- [ ] Read story description and acceptance criteria
- [ ] Identify files to create/modify
- [ ] Check if shadcn components needed (use MCP to install)

### Implementation
- [ ] Create/modify files per specification
- [ ] Follow CSS (separate files, BEM) and TypeScript conventions
- [ ] Use shadcn/ui components where appropriate

### Testing
- [ ] Run `npm run dev` - no console errors
- [ ] Run `npm run build` - no TypeScript errors
- [ ] Manually test all acceptance criteria

### Commit
- [ ] Stage only files related to this story
- [ ] Write commit message: `<type>(story-id): description`
- [ ] Commit

### Done
- [ ] All acceptance criteria pass
- [ ] Code is clean and follows conventions
- [ ] Ready for next story
```

---

## Quick Reference: Entity Hierarchy

```
User Management (standalone)

Projects
├── Project Files
├── Financial Models
└── Designs
    ├── Design Files
    └── Design Comments
```

---

## Quick Reference: Permission Resolution

```
User's Effective Permission = 
  ROLE_DEFAULT 
  + UNION(all group overrides for "all" entities)
  + UNION(all group overrides for "specific" entity) [takes precedence]

Union Logic: If ANY source grants permission, user has it.
```

---

*End of Implementation Plan*
