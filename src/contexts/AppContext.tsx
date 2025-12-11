import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, AppAction } from './AppContext.types';
import { seedUsers } from '@/data/seedUsers';
import { seedGroups } from '@/data/seedGroups';
import { seedEntities } from '@/data/seedEntities';

const STORAGE_KEY = 'pv-usermgmt-state';

// Initial state from seed data
const getInitialState = (): AppState => {
  // Try to load from localStorage first
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse stored state:', error);
    }
  }

  // Fall back to seed data
  return {
    users: seedUsers,
    groups: seedGroups,
    entities: seedEntities,
    permissionOverrides: [],
  };
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // User actions
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };

    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
      };

    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
        // Also remove user from groups
        groups: state.groups.map(group => ({
          ...group,
          memberIds: group.memberIds.filter(id => id !== action.payload),
        })),
      };

    // Group actions
    case 'ADD_GROUP':
      return { ...state, groups: [...state.groups, action.payload] };

    case 'UPDATE_GROUP':
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === action.payload.id ? action.payload : group
        ),
      };

    case 'DELETE_GROUP':
      return {
        ...state,
        groups: state.groups.filter(group => group.id !== action.payload),
        // Also remove group from users
        users: state.users.map(user => ({
          ...user,
          groupIds: user.groupIds.filter(id => id !== action.payload),
        })),
        // Remove permission overrides for this group
        permissionOverrides: state.permissionOverrides.filter(
          override => override.groupId !== action.payload
        ),
      };

    // Permission override actions
    case 'ADD_PERMISSION_OVERRIDE':
      return {
        ...state,
        permissionOverrides: [...state.permissionOverrides, action.payload],
      };

    case 'UPDATE_PERMISSION_OVERRIDE':
      return {
        ...state,
        permissionOverrides: state.permissionOverrides.map(override =>
          override.id === action.payload.id ? action.payload : override
        ),
      };

    case 'DELETE_PERMISSION_OVERRIDE':
      return {
        ...state,
        permissionOverrides: state.permissionOverrides.filter(
          override => override.id !== action.payload
        ),
      };

    // State management
    case 'SET_STATE':
      return action.payload;

    case 'RESET_TO_SEED':
      return {
        users: seedUsers,
        groups: seedGroups,
        entities: seedEntities,
        permissionOverrides: [],
      };

    default:
      return state;
  }
}

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
