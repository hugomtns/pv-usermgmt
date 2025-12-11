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
