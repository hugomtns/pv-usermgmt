import { UserGroup } from '@/types';

export const seedGroups: UserGroup[] = [
  {
    id: 'group-1',
    name: 'Project Alpha Team',
    description: 'Core team working on Project Alpha development and implementation',
    memberIds: ['user-2', 'user-3'],
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-02-15').toISOString(),
  },
  {
    id: 'group-2',
    name: 'External Reviewers',
    description: 'External stakeholders with review and audit access',
    memberIds: ['user-4', 'user-5'],
    createdAt: new Date('2024-02-05').toISOString(),
    updatedAt: new Date('2024-03-20').toISOString(),
  },
  {
    id: 'group-3',
    name: 'Design Leads',
    description: 'Senior design and engineering leadership team',
    memberIds: ['user-1', 'user-2'],
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
  },
];
