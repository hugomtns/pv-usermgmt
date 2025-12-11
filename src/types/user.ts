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
