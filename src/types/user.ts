export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  function: string;           // Job function/title
  roleId: string;             // Reference to CustomRole.id
  groupIds: string[];
  createdAt: string;
  updatedAt: string;
}
