import { User, UserGroup, Entity, GroupPermissionOverride } from '@/types';

export interface AppState {
  users: User[];
  groups: UserGroup[];
  entities: Entity[];
  permissionOverrides: GroupPermissionOverride[];
}

export type AppAction =
  // User actions
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  // Group actions
  | { type: 'ADD_GROUP'; payload: UserGroup }
  | { type: 'UPDATE_GROUP'; payload: UserGroup }
  | { type: 'DELETE_GROUP'; payload: string }
  // Permission override actions
  | { type: 'ADD_PERMISSION_OVERRIDE'; payload: GroupPermissionOverride }
  | { type: 'UPDATE_PERMISSION_OVERRIDE'; payload: GroupPermissionOverride }
  | { type: 'DELETE_PERMISSION_OVERRIDE'; payload: string }
  // Initialize/reset
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'RESET_TO_SEED' };
