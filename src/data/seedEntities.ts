import { Entity } from '@/types';

export const seedEntities: Entity[] = [
  // Project 1: Solar Farm Alentejo
  {
    id: 'project-1',
    type: 'projects',
    name: 'Solar Farm Alentejo',
    parentId: null,
    children: [
      {
        id: 'project-1-file-1',
        type: 'project_files',
        name: 'Site Analysis Report.pdf',
        parentId: 'project-1',
      },
      {
        id: 'project-1-file-2',
        type: 'project_files',
        name: 'Environmental Impact Study.pdf',
        parentId: 'project-1',
      },
      {
        id: 'project-1-model-1',
        type: 'financial_models',
        name: 'ROI Projection Q1-Q4 2025',
        parentId: 'project-1',
      },
      {
        id: 'project-1-design-1',
        type: 'designs',
        name: 'Array Layout Design v3',
        parentId: 'project-1',
        children: [
          {
            id: 'project-1-design-1-file-1',
            type: 'design_files',
            name: 'array-layout-v3.dwg',
            parentId: 'project-1-design-1',
          },
          {
            id: 'project-1-design-1-file-2',
            type: 'design_files',
            name: 'electrical-schematic.pdf',
            parentId: 'project-1-design-1',
          },
          {
            id: 'project-1-design-1-comment-1',
            type: 'design_comments',
            name: 'Review: Optimize spacing for maintenance access',
            parentId: 'project-1-design-1',
          },
        ],
      },
    ],
  },

  // Project 2: Rooftop Porto Industrial
  {
    id: 'project-2',
    type: 'projects',
    name: 'Rooftop Porto Industrial',
    parentId: null,
    children: [
      {
        id: 'project-2-file-1',
        type: 'project_files',
        name: 'Structural Assessment.pdf',
        parentId: 'project-2',
      },
      {
        id: 'project-2-model-1',
        type: 'financial_models',
        name: 'Cost-Benefit Analysis 2025',
        parentId: 'project-2',
      },
      {
        id: 'project-2-design-1',
        type: 'designs',
        name: 'Rooftop Integration Design v2',
        parentId: 'project-2',
        children: [
          {
            id: 'project-2-design-1-file-1',
            type: 'design_files',
            name: 'rooftop-layout.pdf',
            parentId: 'project-2-design-1',
          },
          {
            id: 'project-2-design-1-comment-1',
            type: 'design_comments',
            name: 'Approved with minor adjustments',
            parentId: 'project-2-design-1',
          },
        ],
      },
    ],
  },

  // Project 3: Floating PV Alqueva
  {
    id: 'project-3',
    type: 'projects',
    name: 'Floating PV Alqueva',
    parentId: null,
    children: [
      {
        id: 'project-3-file-1',
        type: 'project_files',
        name: 'Hydrology Study.pdf',
        parentId: 'project-3',
      },
      {
        id: 'project-3-file-2',
        type: 'project_files',
        name: 'Anchoring System Specs.pdf',
        parentId: 'project-3',
      },
      {
        id: 'project-3-model-1',
        type: 'financial_models',
        name: 'Investment Model 10-Year',
        parentId: 'project-3',
      },
      {
        id: 'project-3-design-1',
        type: 'designs',
        name: 'Floating Platform Design v1',
        parentId: 'project-3',
        children: [
          {
            id: 'project-3-design-1-file-1',
            type: 'design_files',
            name: 'floating-platform-cad.dwg',
            parentId: 'project-3-design-1',
          },
          {
            id: 'project-3-design-1-file-2',
            type: 'design_files',
            name: 'mooring-details.pdf',
            parentId: 'project-3-design-1',
          },
          {
            id: 'project-3-design-1-comment-1',
            type: 'design_comments',
            name: 'Pending: Wave load calculations',
            parentId: 'project-3-design-1',
          },
          {
            id: 'project-3-design-1-comment-2',
            type: 'design_comments',
            name: 'Consider alternative anchoring method',
            parentId: 'project-3-design-1',
          },
        ],
      },
    ],
  },
];
