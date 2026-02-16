import type { Client, ClientGroup } from '../types';

/**
 * Demo data for testing the structure diagram without a live OData connection.
 * Models a typical Australian accounting practice client group structure.
 */

export const demoClientGroups: ClientGroup[] = [
  { id: 'grp-001', name: 'Smith Family Group', taxable: true },
  { id: 'grp-002', name: 'Johnson Holdings Group', taxable: true },
  { id: 'grp-003', name: 'Williams Investment Group', taxable: true },
];

export const demoClients: Client[] = [
  // === Smith Family Group ===
  {
    id: 'cli-001',
    name: 'John Smith',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@smith.com',
    businessStructure: 'Individual',
    groups: [{ id: 'grp-001', name: 'Smith Family Group' }],
    relationships: [
      { relatedClientId: 'cli-003', relatedClientName: 'Smith Holdings Pty Ltd', relationshipType: 'Director Of' },
      { relatedClientId: 'cli-003', relatedClientName: 'Smith Holdings Pty Ltd', relationshipType: 'Shareholder Of', shares: 50 },
      { relatedClientId: 'cli-005', relatedClientName: 'Smith Family Trust', relationshipType: 'Trustee Of' },
      { relatedClientId: 'cli-007', relatedClientName: 'Smith Super Fund', relationshipType: 'Member Of' },
    ],
    isArchived: false,
    isDeleted: false,
  },
  {
    id: 'cli-002',
    name: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@smith.com',
    businessStructure: 'Individual',
    groups: [{ id: 'grp-001', name: 'Smith Family Group' }],
    relationships: [
      { relatedClientId: 'cli-003', relatedClientName: 'Smith Holdings Pty Ltd', relationshipType: 'Shareholder Of', shares: 50 },
      { relatedClientId: 'cli-005', relatedClientName: 'Smith Family Trust', relationshipType: 'Beneficiary Of' },
      { relatedClientId: 'cli-004', relatedClientName: 'Smith Consulting Pty Ltd', relationshipType: 'Director Of' },
      { relatedClientId: 'cli-007', relatedClientName: 'Smith Super Fund', relationshipType: 'Member Of' },
    ],
    isArchived: false,
    isDeleted: false,
  },
  {
    id: 'cli-003',
    name: 'Smith Holdings Pty Ltd',
    businessStructure: 'Company',
    groups: [{ id: 'grp-001', name: 'Smith Family Group' }],
    relationships: [
      { relatedClientId: 'cli-005', relatedClientName: 'Smith Family Trust', relationshipType: 'Trustee Of' },
    ],
    isArchived: false,
    isDeleted: false,
  },
  {
    id: 'cli-004',
    name: 'Smith Consulting Pty Ltd',
    businessStructure: 'Company',
    groups: [{ id: 'grp-001', name: 'Smith Family Group' }],
    relationships: [],
    isArchived: false,
    isDeleted: false,
  },
  {
    id: 'cli-005',
    name: 'Smith Family Trust',
    businessStructure: 'Trust',
    groups: [{ id: 'grp-001', name: 'Smith Family Group' }],
    relationships: [
      { relatedClientId: 'cli-004', relatedClientName: 'Smith Consulting Pty Ltd', relationshipType: 'Shareholder Of', shares: 100 },
    ],
    isArchived: false,
    isDeleted: false,
  },
  {
    id: 'cli-006',
    name: 'Smith & Smith Partnership',
    businessStructure: 'Partnership',
    groups: [{ id: 'grp-001', name: 'Smith Family Group' }],
    relationships: [],
    isArchived: false,
    isDeleted: false,
  },
  {
    id: 'cli-007',
    name: 'Smith Super Fund',
    businessStructure: 'Fund',
    groups: [{ id: 'grp-001', name: 'Smith Family Group' }],
    relationships: [],
    isArchived: false,
    isDeleted: false,
  },

  // === Johnson Holdings Group ===
  {
    id: 'cli-010',
    name: 'Robert Johnson',
    firstName: 'Robert',
    lastName: 'Johnson',
    businessStructure: 'Individual',
    groups: [{ id: 'grp-002', name: 'Johnson Holdings Group' }],
    relationships: [
      { relatedClientId: 'cli-012', relatedClientName: 'Johnson Industries Pty Ltd', relationshipType: 'Director Of' },
      { relatedClientId: 'cli-012', relatedClientName: 'Johnson Industries Pty Ltd', relationshipType: 'Shareholder Of', shares: 60 },
      { relatedClientId: 'cli-013', relatedClientName: 'Johnson Family Trust', relationshipType: 'Beneficiary Of' },
    ],
    isArchived: false,
    isDeleted: false,
  },
  {
    id: 'cli-011',
    name: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    businessStructure: 'Individual',
    groups: [{ id: 'grp-002', name: 'Johnson Holdings Group' }],
    relationships: [
      { relatedClientId: 'cli-012', relatedClientName: 'Johnson Industries Pty Ltd', relationshipType: 'Shareholder Of', shares: 40 },
      { relatedClientId: 'cli-013', relatedClientName: 'Johnson Family Trust', relationshipType: 'Beneficiary Of' },
      { relatedClientId: 'cli-014', relatedClientName: 'Johnson Property Trust', relationshipType: 'Trustee Of' },
    ],
    isArchived: false,
    isDeleted: false,
  },
  {
    id: 'cli-012',
    name: 'Johnson Industries Pty Ltd',
    businessStructure: 'Company',
    groups: [{ id: 'grp-002', name: 'Johnson Holdings Group' }],
    relationships: [
      { relatedClientId: 'cli-013', relatedClientName: 'Johnson Family Trust', relationshipType: 'Trustee Of' },
    ],
    isArchived: false,
    isDeleted: false,
  },
  {
    id: 'cli-013',
    name: 'Johnson Family Trust',
    businessStructure: 'Trust',
    groups: [{ id: 'grp-002', name: 'Johnson Holdings Group' }],
    relationships: [
      { relatedClientId: 'cli-015', relatedClientName: 'JFT Trading Pty Ltd', relationshipType: 'Shareholder Of', shares: 100 },
    ],
    isArchived: false,
    isDeleted: false,
  },
  {
    id: 'cli-014',
    name: 'Johnson Property Trust',
    businessStructure: 'Trust',
    groups: [{ id: 'grp-002', name: 'Johnson Holdings Group' }],
    relationships: [],
    isArchived: false,
    isDeleted: false,
  },
  {
    id: 'cli-015',
    name: 'JFT Trading Pty Ltd',
    businessStructure: 'Company',
    groups: [{ id: 'grp-002', name: 'Johnson Holdings Group' }],
    relationships: [],
    isArchived: false,
    isDeleted: false,
  },

  // === Williams Investment Group ===
  {
    id: 'cli-020',
    name: 'Michael Williams',
    firstName: 'Michael',
    lastName: 'Williams',
    businessStructure: 'Individual',
    groups: [{ id: 'grp-003', name: 'Williams Investment Group' }],
    relationships: [
      { relatedClientId: 'cli-022', relatedClientName: 'Williams Capital Pty Ltd', relationshipType: 'Director Of' },
      { relatedClientId: 'cli-022', relatedClientName: 'Williams Capital Pty Ltd', relationshipType: 'Shareholder Of', shares: 100 },
      { relatedClientId: 'cli-023', relatedClientName: 'Williams Discretionary Trust', relationshipType: 'Beneficiary Of' },
    ],
    isArchived: false,
    isDeleted: false,
  },
  {
    id: 'cli-021',
    name: 'Emma Williams',
    firstName: 'Emma',
    lastName: 'Williams',
    businessStructure: 'Individual',
    groups: [{ id: 'grp-003', name: 'Williams Investment Group' }],
    relationships: [
      { relatedClientId: 'cli-023', relatedClientName: 'Williams Discretionary Trust', relationshipType: 'Beneficiary Of' },
    ],
    isArchived: false,
    isDeleted: false,
  },
  {
    id: 'cli-022',
    name: 'Williams Capital Pty Ltd',
    businessStructure: 'Company',
    groups: [{ id: 'grp-003', name: 'Williams Investment Group' }],
    relationships: [
      { relatedClientId: 'cli-023', relatedClientName: 'Williams Discretionary Trust', relationshipType: 'Trustee Of' },
    ],
    isArchived: false,
    isDeleted: false,
  },
  {
    id: 'cli-023',
    name: 'Williams Discretionary Trust',
    businessStructure: 'Trust',
    groups: [{ id: 'grp-003', name: 'Williams Investment Group' }],
    relationships: [],
    isArchived: false,
    isDeleted: false,
  },
];
